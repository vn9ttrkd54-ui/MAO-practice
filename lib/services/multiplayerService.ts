import "server-only";

import { createHash, randomBytes, randomInt } from "node:crypto";
import { cookies } from "next/headers";

import { questions } from "@/data/questions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type {
  CreatePrivateRoomInput,
  JoinPrivateRoomInput,
  MultiplayerAnswerSubmission,
  MultiplayerMatchResult,
  MultiplayerLobbyState,
  MultiplayerPlayer,
  MultiplayerProfile,
  MultiplayerRatingLeaderboardEntry,
  MultiplayerRoom,
  MultiplayerRoomAccess,
  MultiplayerRoomSettings,
  MultiplayerRoundState,
  MultiplayerSpectator,
  MultiplayerSpectatorState,
} from "@/types/multiplayer";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const GUEST_COOKIE_PREFIX = "mao_mp_guest_";
const ROOM_CODE_PATTERN = /^[A-Z0-9]{8}$/;
const ALLOWED_TIMES = new Set([30, 60, 90, 120]);

interface RoomRow {
  id: string;
  code: string | null;
  visibility: "public" | "private";
  mode: "ranked" | "unranked";
  division: "Mu" | "Alpha" | "Theta";
  question_count: number;
  seconds_per_question: 30 | 60 | 90 | 120;
  status: "waiting" | "countdown" | "in-progress" | "completed" | "cancelled";
  capacity: number;
  host_player_id: string | null;
  countdown_ends_at: string | null;
  created_at: string;
  started_at: string | null;
  current_question_number: number;
}

interface PlayerRow {
  id: string;
  user_id: string | null;
  guest_nickname: string | null;
  is_host: boolean;
  connected: boolean;
  score: number;
  placement: number | null;
  has_submitted_current_question: boolean;
}

interface MatchQuestionRow {
  question_number: number;
  question_id: number;
  difficulty: number;
  started_at: string | null;
  ends_at: string | null;
  intermission_ends_at: string | null;
}

interface SpectatorRow {
  user_id: string;
  joined_at: string;
}

function notImplemented(): never {
  throw new Error("This multiplayer feature is not implemented yet.");
}

function validateSettings(settings: MultiplayerRoomSettings) {
  if (!["Mu", "Alpha", "Theta"].includes(settings.division)) {
    throw new Error("Choose a valid division.");
  }
  if (!Number.isInteger(settings.questionCount) || settings.questionCount < 1 || settings.questionCount > 30) {
    throw new Error("Choose between 1 and 30 questions.");
  }
  if (settings.mode === "ranked" && settings.questionCount < 5) {
    throw new Error("Ranked rooms require at least 5 questions.");
  }
  if (!["ranked", "unranked"].includes(settings.mode)) {
    throw new Error("Choose ranked or unranked mode.");
  }
  if (!ALLOWED_TIMES.has(settings.secondsPerQuestion)) {
    throw new Error("Choose 30, 60, 90, or 120 seconds per question.");
  }
}

function normalizeNickname(value?: string) {
  const nickname = value?.trim() ?? "";
  if (Array.from(nickname).length < 1 || Array.from(nickname).length > 20) {
    throw new Error("Guest nicknames must be between 1 and 20 characters.");
  }
  return nickname;
}

function generateRoomCode() {
  const bytes = randomBytes(8);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cookieName(roomId: string) {
  return `${GUEST_COOKIE_PREFIX}${roomId}`;
}

function mapRoom(row: RoomRow, playerCount: number): MultiplayerRoom {
  return {
    id: row.id,
    code: row.code,
    visibility: row.visibility,
    status: row.status,
    settings: {
      division: row.division,
      questionCount: row.question_count,
      secondsPerQuestion: row.seconds_per_question,
      mode: row.mode,
    },
    playerCount,
    spectatorCount: 0,
    capacity: row.capacity,
    hostPlayerId: row.host_player_id,
    countdownEndsAt: row.countdown_ends_at ? new Date(row.countdown_ends_at).getTime() : null,
    createdAt: new Date(row.created_at).getTime(),
    startedAt: row.started_at ? new Date(row.started_at).getTime() : null,
  };
}

function mapPlayer(row: PlayerRow, displayName: string): MultiplayerPlayer {
  return {
    playerId: row.id,
    userId: row.user_id,
    displayName,
    isGuest: row.user_id === null,
    rankTier: row.user_id ? "Novice" : null,
    rp: row.user_id ? 0 : null,
    globalRank: null,
    isHost: row.is_host,
    connected: row.connected,
    score: row.score,
    placement: row.placement,
    hasSubmittedCurrentQuestion: row.has_submitted_current_question,
  };
}

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function addPlayer(room: RoomRow, guestNickname?: string, isHost = false) {
  const admin = createAdminClient();
  const user = await currentUser();
  let reconnectToken: string | null = null;
  let displayName: string;

  if (user) {
    const { error: profileError } = await admin.from("multiplayer_profiles").upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
    if (profileError) throw new Error(`Unable to initialize multiplayer profile: ${profileError.message}`);
    const { data: profile, error: nameError } = await admin.from("profiles").select("username").eq("id", user.id).single<{ username: string }>();
    if (nameError) throw new Error(`Unable to load username: ${nameError.message}`);
    displayName = profile.username;
  } else {
    displayName = normalizeNickname(guestNickname);
    reconnectToken = randomBytes(32).toString("base64url");
  }

  const { data, error } = await admin.from("multiplayer_players").insert({
    room_id: room.id,
    user_id: user?.id ?? null,
    guest_nickname: user ? null : displayName,
    reconnect_token_hash: reconnectToken ? hashToken(reconnectToken) : null,
    is_host: isHost,
  }).select("id, user_id, guest_nickname, is_host, connected, score, placement, has_submitted_current_question").single<PlayerRow>();

  if (error) {
    if (error.code === "23505") throw new Error("That account or nickname is already in this room.");
    throw new Error(`Unable to join the private room: ${error.message}`);
  }

  if (reconnectToken) {
    const cookieStore = await cookies();
    cookieStore.set(cookieName(room.id), reconnectToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return { player: mapPlayer(data, displayName), user };
}

export async function createPrivateRoom(input: CreatePrivateRoomInput): Promise<MultiplayerRoom> {
  validateSettings(input.settings);
  const admin = createAdminClient();
  let room: RoomRow | null = null;

  for (let attempt = 0; attempt < 5 && !room; attempt += 1) {
    const { data, error } = await admin.from("multiplayer_rooms").insert({
      code: generateRoomCode(), visibility: "private", mode: input.settings.mode,
      division: input.settings.division, question_count: input.settings.questionCount,
      seconds_per_question: input.settings.secondsPerQuestion, capacity: 30,
    }).select("*").single<RoomRow>();
    if (!error) room = data;
    else if (error.code !== "23505") throw new Error(`Unable to create the private room: ${error.message}`);
  }
  if (!room) throw new Error("Unable to create a unique room code. Please try again.");

  try {
    const { player } = await addPlayer(room, input.guestNickname, true);
    const { data: updated, error } = await admin.from("multiplayer_rooms").update({ host_player_id: player.playerId }).eq("id", room.id).select("*").single<RoomRow>();
    if (error) throw error;
    return mapRoom(updated, 1);
  } catch (error) {
    await admin.from("multiplayer_rooms").delete().eq("id", room.id);
    throw error;
  }
}

export async function joinPrivateRoom(input: JoinPrivateRoomInput): Promise<MultiplayerRoom> {
  const code = input.code.trim().toUpperCase();
  if (!ROOM_CODE_PATTERN.test(code)) throw new Error("Enter a valid 8-character room code.");
  const admin = createAdminClient();
  const { data: room, error } = await admin.from("multiplayer_rooms").select("*").eq("code", code).eq("visibility", "private").maybeSingle<RoomRow>();
  if (error) throw new Error(`Unable to find the private room: ${error.message}`);
  if (!room) throw new Error("Private room not found.");
  if (room.status !== "waiting") throw new Error("That room is no longer accepting players.");
  const { count, error: countError } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).is("left_at", null);
  if (countError) throw new Error(`Unable to check room capacity: ${countError.message}`);
  if ((count ?? 0) >= room.capacity) throw new Error("That private room is full.");
  await addPlayer(room, input.guestNickname);
  return mapRoom(room, (count ?? 0) + 1);
}

export async function getMultiplayerRoom(roomId: string): Promise<MultiplayerRoomAccess | null> {
  const admin = createAdminClient();
  const user = await currentUser();
  const { data: room, error } = await admin.from("multiplayer_rooms").select("*").eq("id", roomId).maybeSingle<RoomRow>();
  if (error || !room) return null;

  let player: PlayerRow | null = null;
  if (user) {
    const response = await admin.from("multiplayer_players").select("id, user_id, guest_nickname, is_host, connected, score, placement, has_submitted_current_question").eq("room_id", roomId).eq("user_id", user.id).is("left_at", null).maybeSingle<PlayerRow>();
    player = response.data;
  } else {
    const token = (await cookies()).get(cookieName(roomId))?.value;
    if (token) {
      const response = await admin.from("multiplayer_players").select("id, user_id, guest_nickname, is_host, connected, score, placement, has_submitted_current_question").eq("room_id", roomId).eq("reconnect_token_hash", hashToken(token)).is("left_at", null).maybeSingle<PlayerRow>();
      player = response.data;
    }
  }
  if (!player) return null;

  const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", roomId).is("left_at", null);
  let displayName = player.guest_nickname ?? "Player";
  if (player.user_id) {
    const { data: profile } = await admin.from("profiles").select("username").eq("id", player.user_id).maybeSingle<{ username: string }>();
    displayName = profile?.username ?? displayName;
  }
  return { room: mapRoom(room, count ?? 0), currentPlayer: mapPlayer(player, displayName) };
}

function tierForRp(rp: number): MultiplayerPlayer["rankTier"] {
  if (rp >= 2200) return "Legend";
  if (rp >= 1750) return "Grandmaster";
  if (rp >= 1350) return "Master";
  if (rp >= 1000) return "Diamond";
  if (rp >= 700) return "Platinum";
  if (rp >= 450) return "Gold";
  if (rp >= 250) return "Silver";
  if (rp >= 100) return "Bronze";
  return "Novice";
}

async function listActiveSpectators(roomId: string): Promise<MultiplayerSpectator[]> {
  const admin = createAdminClient();
  await admin.from("multiplayer_spectators").delete().eq("room_id", roomId).lt("last_seen_at", new Date(Date.now() - 10_000).toISOString());
  const { data, error } = await admin.from("multiplayer_spectators").select("user_id, joined_at").eq("room_id", roomId).order("joined_at");
  if (error) throw new Error(`Unable to load spectators: ${error.message}`);
  const rows = (data ?? []) as SpectatorRow[];
  if (rows.length === 0) return [];
  const userIds = rows.map((row) => row.user_id);
  const [namesResponse, ratingsResponse] = await Promise.all([
    admin.from("profiles").select("id, username").in("id", userIds),
    admin.from("multiplayer_profiles").select("user_id, rp").in("user_id", userIds),
  ]);
  const names = new Map((namesResponse.data ?? []).map((profile) => [profile.id, profile.username]));
  const ratings = new Map((ratingsResponse.data ?? []).map((profile) => [profile.user_id, profile.rp]));
  return rows.map((row) => {
    const rp = ratings.get(row.user_id) ?? 0;
    return { playerId: row.user_id, userId: row.user_id, displayName: names.get(row.user_id) ?? "Spectator", isGuest: false, rankTier: tierForRp(rp), rp, globalRank: null, joinedAt: new Date(row.joined_at).getTime() };
  });
}

export async function updatePrivateRoomPresence(roomId: string, connected: boolean): Promise<boolean> {
  const admin = createAdminClient();
  const user = await currentUser();
  let query = admin.from("multiplayer_players").update({ connected }).eq("room_id", roomId).is("left_at", null);

  if (user) {
    query = query.eq("user_id", user.id);
  } else {
    const token = (await cookies()).get(cookieName(roomId))?.value;
    if (!token) return false;
    query = query.eq("reconnect_token_hash", hashToken(token));
  }

  const { data, error } = await query.select("id");
  return !error && (data?.length ?? 0) === 1;
}

export async function getPrivateLobby(roomId: string): Promise<MultiplayerLobbyState | null> {
  const access = await getMultiplayerRoom(roomId);
  if (!access) return null;

  const admin = createAdminClient();
  await updatePrivateRoomPresence(roomId, true);
  await admin
    .from("multiplayer_players")
    .update({ connected: false })
    .eq("room_id", roomId)
    .eq("connected", true)
    .lt("updated_at", new Date(Date.now() - 10_000).toISOString());

  const { data, error } = await admin
    .from("multiplayer_players")
    .select("id, user_id, guest_nickname, is_host, connected, score, placement, has_submitted_current_question")
    .eq("room_id", roomId)
    .eq("connected", true)
    .is("left_at", null)
    .order("joined_at", { ascending: true });
  if (error) throw new Error(`Unable to load the lobby: ${error.message}`);

  const rows = (data ?? []) as PlayerRow[];
  const userIds = rows.flatMap((row) => row.user_id ? [row.user_id] : []);
  const [namesResponse, ratingsResponse] = userIds.length > 0
    ? await Promise.all([
        admin.from("profiles").select("id, username").in("id", userIds),
        admin.from("multiplayer_profiles").select("user_id, rp").in("user_id", userIds),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];
  if (namesResponse.error || ratingsResponse.error) {
    throw new Error("Unable to load player profiles.");
  }

  const names = new Map((namesResponse.data ?? []).map((profile) => [profile.id, profile.username]));
  const ratings = new Map((ratingsResponse.data ?? []).map((profile) => [profile.user_id, profile.rp]));
  const players = rows.map((row) => {
    const player = mapPlayer(row, row.user_id ? names.get(row.user_id) ?? "Player" : row.guest_nickname ?? "Guest");
    if (row.user_id) {
      const rp = ratings.get(row.user_id) ?? 0;
      player.rp = rp;
      player.rankTier = tierForRp(rp);
    }
    return player;
  });

  return { ...access, room: { ...access.room, playerCount: players.length }, players };
}

async function prepareRoomMatch(lobby: MultiplayerLobbyState, expectedStatus: "waiting" | "countdown"): Promise<MultiplayerRoom> {
  const roomId = lobby.room.id;
  const admin = createAdminClient();
  const availableQuestions = questions.filter((question) => question.division === lobby.room.settings.division);
  if (availableQuestions.length < lobby.room.settings.questionCount) {
    throw new Error(`There are not enough ${lobby.room.settings.division} questions for this room.`);
  }

  const randomizedQuestions = [...availableQuestions];
  for (let index = randomizedQuestions.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [randomizedQuestions[index], randomizedQuestions[swapIndex]] = [randomizedQuestions[swapIndex], randomizedQuestions[index]];
  }
  const selectedQuestions = randomizedQuestions.slice(0, lobby.room.settings.questionCount);
  const startedAt = new Date();
  const firstQuestionEndsAt = new Date(startedAt.getTime() + lobby.room.settings.secondsPerQuestion * 1000);
  const { error: questionsError } = await admin.from("multiplayer_match_questions").insert(
    selectedQuestions.map((question, index) => ({
      room_id: roomId,
      question_number: index + 1,
      question_id: question.id,
      difficulty: question.difficulty,
      started_at: index === 0 ? startedAt.toISOString() : null,
      ends_at: index === 0 ? firstQuestionEndsAt.toISOString() : null,
    }))
  );
  if (questionsError) {
    if (questionsError.code === "23505") {
      const { data: existingRoom } = await admin.from("multiplayer_rooms").select("*").eq("id", roomId).single<RoomRow>();
      if (existingRoom?.status === "in-progress") return mapRoom(existingRoom, lobby.players.length);
    }
    throw new Error(`Unable to prepare match questions: ${questionsError.message}`);
  }

  const { data, error } = await admin.from("multiplayer_rooms").update({
    status: "in-progress",
    started_at: startedAt.toISOString(),
    current_question_number: 1,
    mode: lobby.players.length === 1 ? "unranked" : lobby.room.settings.mode,
  }).eq("id", roomId).eq("status", expectedStatus).select("*").single<RoomRow>();
  if (error) {
    await admin.from("multiplayer_match_questions").delete().eq("room_id", roomId);
    throw new Error(`Unable to start the room: ${error.message}`);
  }

  if (lobby.room.visibility === "public") {
    await admin.from("multiplayer_rooms").insert({
      visibility: "public", mode: "ranked", division: lobby.room.settings.division,
      question_count: lobby.room.settings.questionCount, seconds_per_question: 60,
      status: "waiting", capacity: 20,
    });
  }
  return mapRoom(data, lobby.players.length);
}

export async function beginPrivateRoom(roomId: string): Promise<MultiplayerRoom> {
  const lobby = await getPrivateLobby(roomId);
  if (!lobby) throw new Error("Private room not found.");
  if (lobby.room.visibility !== "private") throw new Error("This is not a private room.");
  if (!lobby.currentPlayer.isHost) throw new Error("Only the host can start this room.");
  if (lobby.room.status !== "waiting") throw new Error("This room has already started.");
  return prepareRoomMatch(lobby, "waiting");
}

export async function beginPublicRoomIfReady(roomId: string): Promise<MultiplayerRoom | null> {
  const lobby = await getPrivateLobby(roomId);
  if (!lobby || lobby.room.visibility !== "public") return null;
  if (lobby.room.status !== "countdown") return lobby.room;
  if (lobby.players.length < 2) {
    const admin = createAdminClient();
    const { data } = await admin.from("multiplayer_rooms").update({ status: "waiting", countdown_ends_at: null }).eq("id", roomId).eq("status", "countdown").select("*").single<RoomRow>();
    return data ? mapRoom(data, lobby.players.length) : lobby.room;
  }
  if ((lobby.room.countdownEndsAt ?? Infinity) > Date.now() && lobby.players.length < lobby.room.capacity) return lobby.room;
  return prepareRoomMatch(lobby, "countdown");
}

export async function getMultiplayerRoundState(roomId: string): Promise<MultiplayerRoundState | null> {
  const lobby = await getPrivateLobby(roomId);
  if (!lobby || lobby.room.status !== "in-progress") return null;

  const admin = createAdminClient();
  const { data: room } = await admin.from("multiplayer_rooms").select("*").eq("id", roomId).single<RoomRow>();
  if (!room || room.status !== "in-progress") return null;

  const questionResponse = await admin
    .from("multiplayer_match_questions")
    .select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at")
    .eq("room_id", roomId)
    .eq("question_number", room.current_question_number)
    .maybeSingle<MatchQuestionRow>();
  let data = questionResponse.data;
  const error = questionResponse.error;
  if (error || !data?.ends_at) return null;

  const now = Date.now();
  if (!data.intermission_ends_at) {
    const [{ count: submissionCount }, { count: activePlayerCount }] = await Promise.all([
      admin.from("multiplayer_submissions").select("id", { count: "exact", head: true }).eq("room_id", roomId).eq("question_number", data.question_number),
      admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", roomId).eq("connected", true).is("left_at", null),
    ]);
    if (now >= new Date(data.ends_at).getTime() || ((activePlayerCount ?? 0) > 0 && (submissionCount ?? 0) >= (activePlayerCount ?? 0))) {
      const response = await admin.from("multiplayer_match_questions").update({ intermission_ends_at: new Date(now + 10_000).toISOString() }).eq("room_id", roomId).eq("question_number", data.question_number).select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at").single<MatchQuestionRow>();
      if (!response.error) data = response.data;
    }
  }

  if (data.intermission_ends_at && now >= new Date(data.intermission_ends_at).getTime()) {
    if (data.question_number >= room.question_count) {
      await admin.from("multiplayer_rooms").update({ status: "completed", completed_at: new Date(now).toISOString() }).eq("id", roomId).eq("status", "in-progress");
      await finalizeCompletedMatch(roomId);
      return null;
    }

    const nextQuestionNumber = data.question_number + 1;
    const nextResponse = await admin.from("multiplayer_match_questions").update({
      started_at: new Date(now).toISOString(),
      ends_at: new Date(now + room.seconds_per_question * 1000).toISOString(),
    }).eq("room_id", roomId).eq("question_number", nextQuestionNumber).is("started_at", null).select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at").single<MatchQuestionRow>();
    if (nextResponse.error) {
      const existingNext = await admin.from("multiplayer_match_questions").select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at").eq("room_id", roomId).eq("question_number", nextQuestionNumber).not("started_at", "is", null).maybeSingle<MatchQuestionRow>();
      if (existingNext.error || !existingNext.data?.ends_at) return null;
      data = existingNext.data;
    } else {
      await Promise.all([
        admin.from("multiplayer_rooms").update({ current_question_number: nextQuestionNumber }).eq("id", roomId),
        admin.from("multiplayer_players").update({ has_submitted_current_question: false }).eq("room_id", roomId).is("left_at", null),
      ]);
      data = nextResponse.data;
    }
  }

  const question = questions.find((entry) => entry.id === data.question_id);
  if (!question || !data.ends_at) return null;

  return {
    roomId,
    currentPlayerId: lobby.currentPlayer.playerId,
    questionNumber: data.question_number,
    totalQuestions: lobby.room.settings.questionCount,
    question: {
      questionId: question.id,
      number: data.question_number,
      division: question.division,
      topic: question.topic,
      difficulty: data.difficulty,
      question: question.question,
      choices: question.choices,
    },
    questionEndsAt: new Date(data.ends_at).getTime(),
    intermissionEndsAt: data.intermission_ends_at ? new Date(data.intermission_ends_at).getTime() : null,
    players: lobby.players,
    spectators: await listActiveSpectators(roomId),
  };
}

export async function submitMultiplayerAnswer(input: MultiplayerAnswerSubmission): Promise<MultiplayerRoundState> {
  if (!["A", "B", "C", "D", "E"].includes(input.selectedAnswer)) throw new Error("Choose a valid answer.");
  const lobby = await getPrivateLobby(input.roomId);
  if (!lobby || lobby.room.status !== "in-progress") throw new Error("This match is not accepting answers.");

  const admin = createAdminClient();
  const { data: room } = await admin.from("multiplayer_rooms").select("*").eq("id", input.roomId).single<RoomRow>();
  if (!room) throw new Error("Unable to load the active room.");
  const { data: matchQuestion, error: questionError } = await admin.from("multiplayer_match_questions").select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at").eq("room_id", input.roomId).eq("question_number", room.current_question_number).single<MatchQuestionRow>();
  if (questionError || !matchQuestion.started_at || !matchQuestion.ends_at || matchQuestion.intermission_ends_at) throw new Error("This question is closed.");
  if (matchQuestion.question_id !== input.questionId) throw new Error("That question is no longer active.");

  const submittedAt = Date.now();
  const endsAt = new Date(matchQuestion.ends_at).getTime();
  if (submittedAt > endsAt) throw new Error("Time has expired for this question.");
  const question = questions.find((entry) => entry.id === matchQuestion.question_id);
  if (!question) throw new Error("Unable to load the active question.");

  const correct = input.selectedAnswer === question.answer;
  const answerTimeMs = Math.max(0, submittedAt - new Date(matchQuestion.started_at).getTime());
  const remainingMs = Math.max(0, endsAt - submittedAt);
  const pointsEarned = correct ? 1000 + Math.round(500 * remainingMs / (room.seconds_per_question * 1000)) : 0;
  const { error: submissionError } = await admin.from("multiplayer_submissions").insert({
    room_id: input.roomId,
    question_number: matchQuestion.question_number,
    question_id: matchQuestion.question_id,
    player_id: lobby.currentPlayer.playerId,
    selected_answer: input.selectedAnswer,
    correct,
    answer_time_ms: answerTimeMs,
    points_earned: pointsEarned,
  });
  if (submissionError) {
    if (submissionError.code === "23505") throw new Error("You already answered this question.");
    throw new Error(`Unable to submit the answer: ${submissionError.message}`);
  }

  const { error: playerError } = await admin.from("multiplayer_players").update({ score: lobby.currentPlayer.score + pointsEarned, has_submitted_current_question: true }).eq("room_id", input.roomId).eq("id", lobby.currentPlayer.playerId);
  if (playerError) throw new Error(`Unable to update the score: ${playerError.message}`);

  const [{ count: submissionCount }, { count: activePlayerCount }] = await Promise.all([
    admin.from("multiplayer_submissions").select("id", { count: "exact", head: true }).eq("room_id", input.roomId).eq("question_number", matchQuestion.question_number),
    admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", input.roomId).eq("connected", true).is("left_at", null),
  ]);
  let intermissionEndsAt: string | null = null;
  if ((activePlayerCount ?? 0) > 0 && (submissionCount ?? 0) >= (activePlayerCount ?? 0)) {
    intermissionEndsAt = new Date(Date.now() + 10_000).toISOString();
    await admin.from("multiplayer_match_questions").update({ intermission_ends_at: intermissionEndsAt }).eq("room_id", input.roomId).eq("question_number", matchQuestion.question_number).is("intermission_ends_at", null);
  }

  const updatedPlayers = lobby.players.map((player) => player.playerId === lobby.currentPlayer.playerId ? {
    ...player,
    score: player.score + pointsEarned,
    hasSubmittedCurrentQuestion: true,
  } : player);

  return {
    roomId: input.roomId,
    currentPlayerId: lobby.currentPlayer.playerId,
    questionNumber: matchQuestion.question_number,
    totalQuestions: room.question_count,
    question: {
      questionId: question.id,
      number: matchQuestion.question_number,
      division: question.division,
      topic: question.topic,
      difficulty: matchQuestion.difficulty,
      question: question.question,
      choices: question.choices,
    },
    questionEndsAt: endsAt,
    intermissionEndsAt: intermissionEndsAt ? new Date(intermissionEndsAt).getTime() : null,
    players: updatedPlayers,
    spectators: await listActiveSpectators(input.roomId),
  };
}

interface FinalPlayerRow extends PlayerRow {
  joined_at: string;
}

interface SubmissionRow {
  player_id: string;
  question_number: number;
  question_id: number;
  selected_answer: "A" | "B" | "C" | "D" | "E";
  correct: boolean;
  answer_time_ms: number;
  points_earned: number;
}

async function finalizeCompletedMatch(roomId: string): Promise<void> {
  const admin = createAdminClient();
  const { count } = await admin.from("multiplayer_match_results").select("player_id", { count: "exact", head: true }).eq("room_id", roomId);
  if ((count ?? 0) > 0) return;

  const [{ data: room }, playersResponse, submissionsResponse, matchQuestionsResponse] = await Promise.all([
    admin.from("multiplayer_rooms").select("*").eq("id", roomId).single<RoomRow>(),
    admin.from("multiplayer_players").select("id, user_id, guest_nickname, is_host, connected, score, placement, has_submitted_current_question, joined_at").eq("room_id", roomId).is("left_at", null),
    admin.from("multiplayer_submissions").select("player_id, question_number, question_id, selected_answer, correct, answer_time_ms, points_earned").eq("room_id", roomId),
    admin.from("multiplayer_match_questions").select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at").eq("room_id", roomId),
  ]);
  if (!room || room.status !== "completed") return;

  const players = (playersResponse.data ?? []) as FinalPlayerRow[];
  const submissions = (submissionsResponse.data ?? []) as SubmissionRow[];
  const matchQuestions = (matchQuestionsResponse.data ?? []) as MatchQuestionRow[];
  const userIds = players.flatMap((player) => player.user_id ? [player.user_id] : []);
  const { data: profiles } = userIds.length > 0
    ? await admin.from("multiplayer_profiles").select("user_id, rp, ranked_matches_played, ranked_wins").in("user_id", userIds)
    : { data: [] };
  const profileByUser = new Map((profiles ?? []).map((profile) => [profile.user_id, profile]));
  const totalDifficulty = matchQuestions.reduce((sum, question) => sum + question.difficulty, 0) || 1;

  const metrics = players.map((player) => {
    const playerSubmissions = submissions.filter((submission) => submission.player_id === player.id);
    const correctDifficulty = playerSubmissions.filter((submission) => submission.correct).reduce((sum, submission) => sum + (matchQuestions.find((question) => question.question_number === submission.question_number)?.difficulty ?? 0), 0);
    const weightedAccuracy = correctDifficulty / totalDifficulty;
    const normalizedScore = player.score / Math.max(1, room.question_count * 1500);
    const performance = Math.min(1, Math.max(0, 0.7 * weightedAccuracy + 0.3 * normalizedScore));
    const totalTime = playerSubmissions.reduce((sum, submission) => sum + submission.answer_time_ms, 0);
    return { player, performance, totalTime, profile: player.user_id ? profileByUser.get(player.user_id) : undefined };
  }).sort((a, b) => b.player.score - a.player.score || a.totalTime - b.totalTime || new Date(a.player.joined_at).getTime() - new Date(b.player.joined_at).getTime());

  const signedRps = metrics.flatMap((metric) => metric.profile ? [metric.profile.rp] : []);
  const averageSignedRp = signedRps.reduce((sum, rp) => sum + rp, 0) / Math.max(1, signedRps.length);
  const completionFactor = Math.min(1, matchQuestions.filter((question) => question.started_at).length / room.question_count);
  const ranked = room.mode === "ranked" && players.length > 1;

  const resultRows = metrics.map((metric, index) => {
    const placement = index + 1;
    let previousRp: number | null = null;
    let rpChange: number | null = null;
    let newRp: number | null = null;
    let opponentAdjustment: number | null = null;
    let performanceIndex: number | null = null;

    if (ranked && metric.player.user_id && metric.profile) {
      const currentRp = metric.profile.rp;
      previousRp = currentRp;
      const opponents = metrics.filter((opponent) => opponent.player.id !== metric.player.id);
      const contributions = opponents.map((opponent) => {
        const opponentRp = opponent.profile?.rp ?? Math.max(0, averageSignedRp + (opponent.performance - 0.5) * 400);
        const expected = 1 / (1 + 10 ** ((opponentRp - currentRp) / 400));
        const opponentPlacement = metrics.findIndex((entry) => entry.player.id === opponent.player.id) + 1;
        if (placement < opponentPlacement) return 40 * (1 - expected);
        if (placement > opponentPlacement) return -16 * expected;
        return 0;
      });
      const baseChange = contributions.reduce((sum, value) => sum + value, 0) / Math.max(1, contributions.length);
      const multiplier = baseChange >= 0 ? 0.8 + 0.4 * metric.performance : 0.75 - 0.25 * metric.performance;
      rpChange = Math.round(Math.max(-15, Math.min(40, baseChange * multiplier * completionFactor)));
      newRp = Math.max(0, currentRp + rpChange);
      opponentAdjustment = contributions.reduce((sum, value) => sum + value, 0) / Math.max(1, contributions.length);
      performanceIndex = metric.performance;
    }

    return {
      room_id: roomId, player_id: metric.player.id, user_id: metric.player.user_id,
      placement, final_score: metric.player.score, ranked,
      previous_rp: previousRp, rp_change: rpChange, new_rp: newRp,
      opponent_adjustment: opponentAdjustment, performance_index: performanceIndex,
      completion_factor: completionFactor,
    };
  });

  const { error: insertError } = await admin.from("multiplayer_match_results").insert(resultRows);
  if (insertError) return;

  await Promise.all(resultRows.flatMap((result) => {
    if (!result.user_id || result.new_rp === null) return [];
    const profile = profileByUser.get(result.user_id);
    if (!profile) return [];
    return [admin.from("multiplayer_profiles").update({
      rp: result.new_rp,
      ranked_matches_played: profile.ranked_matches_played + 1,
      ranked_wins: profile.ranked_wins + (result.placement === 1 ? 1 : 0),
    }).eq("user_id", result.user_id)];
  }));
}

export async function getMultiplayerMatchResult(roomId: string): Promise<MultiplayerMatchResult | null> {
  const access = await getMultiplayerRoom(roomId);
  if (!access || access.room.status !== "completed") return null;
  await finalizeCompletedMatch(roomId);

  const admin = createAdminClient();
  const [resultResponse, resultsResponse, playersResponse, submissionsResponse, matchQuestionsResponse] = await Promise.all([
    admin.from("multiplayer_match_results").select("*").eq("room_id", roomId).eq("player_id", access.currentPlayer.playerId).maybeSingle(),
    admin.from("multiplayer_match_results").select("*").eq("room_id", roomId).order("placement"),
    admin.from("multiplayer_players").select("id, user_id, guest_nickname, is_host, connected, score, placement, has_submitted_current_question").eq("room_id", roomId),
    admin.from("multiplayer_submissions").select("player_id, question_number, question_id, selected_answer, correct, answer_time_ms, points_earned").eq("room_id", roomId).eq("player_id", access.currentPlayer.playerId),
    admin.from("multiplayer_match_questions").select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at").eq("room_id", roomId).order("question_number"),
  ]);
  const result = resultResponse.data;
  if (!result) return null;

  const resultByPlayer = new Map((resultsResponse.data ?? []).map((entry) => [entry.player_id, entry]));
  const finalPlayerRows = (playersResponse.data ?? []) as PlayerRow[];
  const finalUserIds = finalPlayerRows.flatMap((player) => player.user_id ? [player.user_id] : []);
  const { data: finalNames } = finalUserIds.length > 0 ? await admin.from("profiles").select("id, username").in("id", finalUserIds) : { data: [] };
  const finalNameByUser = new Map((finalNames ?? []).map((profile) => [profile.id, profile.username]));
  const finalLeaderboard = finalPlayerRows.map((player) => {
    const mapped = mapPlayer(player, player.guest_nickname ?? (player.user_id ? finalNameByUser.get(player.user_id) ?? "Account player" : "Guest"));
    mapped.placement = resultByPlayer.get(player.id)?.placement ?? null;
    return mapped;
  }).sort((a, b) => (a.placement ?? 999) - (b.placement ?? 999));
  const submissionByQuestion = new Map(((submissionsResponse.data ?? []) as SubmissionRow[]).map((submission) => [submission.question_number, submission]));
  const rounds = ((matchQuestionsResponse.data ?? []) as MatchQuestionRow[]).map((matchQuestion) => {
    const question = questions.find((entry) => entry.id === matchQuestion.question_id)!;
    const submission = submissionByQuestion.get(matchQuestion.question_number);
    return {
      questionId: question.id, questionNumber: matchQuestion.question_number,
      question: question.question, choices: question.choices,
      selectedAnswer: submission?.selected_answer ?? null, correctAnswer: question.answer,
      correct: submission?.correct ?? false, answerTimeMs: submission?.answer_time_ms ?? null,
      pointsEarned: submission?.points_earned ?? 0, solution: question.solution,
    };
  });

  return {
    roomId, placement: result.placement, score: result.final_score, ranked: result.ranked,
    ratingChange: result.previous_rp === null ? null : {
      previousRp: result.previous_rp, change: result.rp_change, newRp: result.new_rp,
      previousTier: tierForRp(result.previous_rp)!, newTier: tierForRp(result.new_rp)!,
      opponentAdjustment: Number(result.opponent_adjustment), performanceIndex: Number(result.performance_index), completionFactor: Number(result.completion_factor),
    },
    rounds, finalLeaderboard,
  };
}

export async function listPublicRooms(): Promise<MultiplayerRoom[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("multiplayer_rooms").select("*").eq("visibility", "public").in("status", ["waiting", "countdown"]).order("division").order("question_count");
  if (error) throw new Error(`Unable to load public rooms: ${error.message}`);
  return Promise.all(((data ?? []) as RoomRow[]).map(async (room) => {
    const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).eq("connected", true).is("left_at", null);
    return mapRoom(room, count ?? 0);
  }));
}

function multiplayerRoomHasNotExpired(room: RoomRow): boolean {
  if (!room.started_at) return true;
  const expectedDurationMs = room.question_count * (room.seconds_per_question + 10) * 1000;
  const reconnectWindowMs = 2 * 60 * 1000;
  return Date.now() <= new Date(room.started_at).getTime() + expectedDurationMs + reconnectWindowMs;
}

export async function listOngoingPublicMatches(): Promise<MultiplayerRoom[]> {
  const admin = createAdminClient();
  await admin.from("multiplayer_players").update({ connected: false }).eq("connected", true).lt("updated_at", new Date(Date.now() - 10_000).toISOString());
  const { data, error } = await admin.from("multiplayer_rooms").select("*").eq("visibility", "public").eq("status", "in-progress").order("started_at", { ascending: false }).limit(20);
  if (error) throw new Error(`Unable to load ongoing public matches: ${error.message}`);
  const rooms = await Promise.all(((data ?? []) as RoomRow[]).map(async (room) => {
    if (!multiplayerRoomHasNotExpired(room)) {
      await admin.from("multiplayer_rooms").update({ status: "cancelled" }).eq("id", room.id).eq("status", "in-progress");
      return null;
    }
    const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).eq("connected", true).is("left_at", null);
    return (count ?? 0) > 0 ? mapRoom(room, count ?? 0) : null;
  }));
  return rooms.filter((room): room is MultiplayerRoom => room !== null);
}
export async function listMyActiveMultiplayerRooms(): Promise<MultiplayerRoom[]> {
  const user = await currentUser();
  if (!user) return [];
  const admin = createAdminClient();
  const { data: memberships, error: membershipError } = await admin.from("multiplayer_players").select("room_id").eq("user_id", user.id).is("left_at", null);
  if (membershipError) throw new Error(`Unable to load active games: ${membershipError.message}`);
  const roomIds = [...new Set((memberships ?? []).map((membership) => membership.room_id))];
  if (roomIds.length === 0) return [];

  const { data, error } = await admin.from("multiplayer_rooms").select("*").in("id", roomIds).in("status", ["waiting", "countdown", "in-progress"]).order("created_at", { ascending: false });
  if (error) throw new Error(`Unable to load active games: ${error.message}`);
  const rooms = await Promise.all(((data ?? []) as RoomRow[]).map(async (room) => {
    if (room.status === "in-progress" && !multiplayerRoomHasNotExpired(room)) return null;
    const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).is("left_at", null);
    return mapRoom(room, count ?? 0);
  }));
  return rooms.filter((room): room is MultiplayerRoom => room !== null);
}
export async function joinPublicRoom(roomId: string): Promise<MultiplayerRoom> {
  const user = await currentUser();
  if (!user) throw new Error("Sign in or create an account to join public rooms.");
  const admin = createAdminClient();
  const { data: room, error } = await admin.from("multiplayer_rooms").select("*").eq("id", roomId).eq("visibility", "public").maybeSingle<RoomRow>();
  if (error || !room) throw new Error("Public room not found.");
  if (!["waiting", "countdown"].includes(room.status)) throw new Error("That public room has already started.");

  const { data: existing } = await admin.from("multiplayer_players").select("id").eq("room_id", roomId).eq("user_id", user.id).is("left_at", null).maybeSingle();
  const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", roomId).is("left_at", null);
  if (!existing && (count ?? 0) >= room.capacity) throw new Error("That public room is full.");
  if (!existing) await addPlayer(room);
  const playerCount = (count ?? 0) + (existing ? 0 : 1);

  let updatedRoom = room;
  if (playerCount >= 2 && room.status === "waiting") {
    const countdownEndsAt = new Date(Date.now() + (playerCount >= room.capacity ? 0 : 60_000)).toISOString();
    const response = await admin.from("multiplayer_rooms").update({ status: "countdown", countdown_ends_at: countdownEndsAt }).eq("id", roomId).eq("status", "waiting").select("*").single<RoomRow>();
    if (!response.error) updatedRoom = response.data;
  }
  return mapRoom(updatedRoom, playerCount);
}
export async function startPrivateMatch(_roomId: string): Promise<MultiplayerRoundState> { void _roomId; return notImplemented(); }
export async function leaveMultiplayerRoom(_roomId: string): Promise<void> { void _roomId; return notImplemented(); }
export async function spectatePublicMatch(roomId: string): Promise<MultiplayerSpectatorState> {
  const user = await currentUser();
  if (!user) throw new Error("Sign in to spectate public games.");
  const admin = createAdminClient();
  const { data: room } = await admin.from("multiplayer_rooms").select("*").eq("id", roomId).eq("visibility", "public").eq("status", "in-progress").maybeSingle<RoomRow>();
  if (!room) throw new Error("That public match is no longer in progress.");
  const { data: player } = await admin.from("multiplayer_players").select("id").eq("room_id", roomId).eq("user_id", user.id).is("left_at", null).maybeSingle();
  if (player) throw new Error("You are playing in this match. Use Rejoin Game instead.");
  await admin.from("multiplayer_profiles").upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
  const { error: spectatorError } = await admin.from("multiplayer_spectators").upsert({ room_id: roomId, user_id: user.id, last_seen_at: new Date().toISOString() }, { onConflict: "room_id,user_id" });
  if (spectatorError) throw new Error(`Unable to spectate this match: ${spectatorError.message}`);
  const [questionResponse, players, spectators] = await Promise.all([
    admin.from("multiplayer_match_questions").select("question_number, question_id, difficulty, started_at, ends_at, intermission_ends_at").eq("room_id", roomId).eq("question_number", room.current_question_number).maybeSingle<MatchQuestionRow>(),
    getPublicMatchPlayers(roomId), listActiveSpectators(roomId),
  ]);
  const matchQuestion = questionResponse.data;
  const question = matchQuestion ? questions.find((entry) => entry.id === matchQuestion.question_id) : null;
  if (!matchQuestion?.ends_at || !question) throw new Error("The current question is unavailable.");
  return { roomId, questionNumber: matchQuestion.question_number, totalQuestions: room.question_count, question: { questionId: question.id, number: matchQuestion.question_number, division: question.division, topic: question.topic, difficulty: matchQuestion.difficulty, question: question.question, choices: question.choices }, questionEndsAt: new Date(matchQuestion.ends_at).getTime(), intermissionEndsAt: matchQuestion.intermission_ends_at ? new Date(matchQuestion.intermission_ends_at).getTime() : null, players, spectators };
}

async function getPublicMatchPlayers(roomId: string): Promise<MultiplayerPlayer[]> {
  const admin = createAdminClient();
  const { data } = await admin.from("multiplayer_players").select("id, user_id, guest_nickname, is_host, connected, score, placement, has_submitted_current_question").eq("room_id", roomId).is("left_at", null).order("score", { ascending: false });
  const rows = (data ?? []) as PlayerRow[];
  const userIds = rows.flatMap((row) => row.user_id ? [row.user_id] : []);
  const [namesResponse, ratingsResponse] = userIds.length ? await Promise.all([admin.from("profiles").select("id, username").in("id", userIds), admin.from("multiplayer_profiles").select("user_id, rp").in("user_id", userIds)]) : [{ data: [] }, { data: [] }];
  const names = new Map((namesResponse.data ?? []).map((profile) => [profile.id, profile.username]));
  const ratings = new Map((ratingsResponse.data ?? []).map((profile) => [profile.user_id, profile.rp]));
  return rows.map((row) => { const mapped = mapPlayer(row, row.user_id ? names.get(row.user_id) ?? "Player" : row.guest_nickname ?? "Guest"); if (row.user_id) { const rp = ratings.get(row.user_id) ?? 0; mapped.rp = rp; mapped.rankTier = tierForRp(rp); } return mapped; });
}

export async function leavePublicSpectator(roomId: string): Promise<void> {
  const user = await currentUser();
  if (user) await createAdminClient().from("multiplayer_spectators").delete().eq("room_id", roomId).eq("user_id", user.id);
}
export async function getMultiplayerProfile(): Promise<MultiplayerProfile | null> { return notImplemented(); }
export async function getMultiplayerRatingLeaderboard(): Promise<MultiplayerRatingLeaderboardEntry[]> { return notImplemented(); }
