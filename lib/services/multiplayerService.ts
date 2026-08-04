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
  ends_at: string | null;
  intermission_ends_at: string | null;
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
  if (!access || access.room.visibility !== "private") return null;

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

export async function beginPrivateRoom(roomId: string): Promise<MultiplayerRoom> {
  const lobby = await getPrivateLobby(roomId);
  if (!lobby) throw new Error("Private room not found.");
  if (!lobby.currentPlayer.isHost) throw new Error("Only the host can start this room.");
  if (lobby.room.status !== "waiting") throw new Error("This room has already started.");

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
  if (questionsError) throw new Error(`Unable to prepare match questions: ${questionsError.message}`);

  const { data, error } = await admin.from("multiplayer_rooms").update({
    status: "in-progress",
    started_at: startedAt.toISOString(),
    current_question_number: 1,
    mode: lobby.players.length === 1 ? "unranked" : lobby.room.settings.mode,
  }).eq("id", roomId).eq("status", "waiting").select("*").single<RoomRow>();
  if (error) {
    await admin.from("multiplayer_match_questions").delete().eq("room_id", roomId);
    throw new Error(`Unable to start the room: ${error.message}`);
  }
  return mapRoom(data, lobby.players.length);
}

export async function getMultiplayerRoundState(roomId: string): Promise<MultiplayerRoundState | null> {
  const lobby = await getPrivateLobby(roomId);
  if (!lobby || lobby.room.status !== "in-progress") return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("multiplayer_match_questions")
    .select("question_number, question_id, difficulty, ends_at, intermission_ends_at")
    .eq("room_id", roomId)
    .eq("question_number", 1)
    .maybeSingle<MatchQuestionRow>();
  if (error || !data?.ends_at) return null;

  const question = questions.find((entry) => entry.id === data.question_id);
  if (!question) return null;

  return {
    roomId,
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
  };
}

export async function listPublicRooms(): Promise<MultiplayerRoom[]> { return notImplemented(); }
export async function listOngoingPublicMatches(): Promise<MultiplayerRoom[]> { return notImplemented(); }
export async function joinPublicRoom(_roomId: string): Promise<MultiplayerRoom> { void _roomId; return notImplemented(); }
export async function startPrivateMatch(_roomId: string): Promise<MultiplayerRoundState> { void _roomId; return notImplemented(); }
export async function submitMultiplayerAnswer(_input: MultiplayerAnswerSubmission): Promise<MultiplayerRoundState> { void _input; return notImplemented(); }
export async function leaveMultiplayerRoom(_roomId: string): Promise<void> { void _roomId; return notImplemented(); }
export async function spectatePublicMatch(_roomId: string): Promise<MultiplayerRoundState> { void _roomId; return notImplemented(); }
export async function getMultiplayerMatchResult(_roomId: string): Promise<MultiplayerMatchResult | null> { void _roomId; return notImplemented(); }
export async function getMultiplayerProfile(): Promise<MultiplayerProfile | null> { return notImplemented(); }
export async function getMultiplayerRatingLeaderboard(): Promise<MultiplayerRatingLeaderboardEntry[]> { return notImplemented(); }
