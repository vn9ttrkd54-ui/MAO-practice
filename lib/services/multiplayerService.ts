import "server-only";
import { isPublicNameAllowed, PUBLIC_NAME_ERROR } from "@/lib/auth/publicNames";

import { createHash, randomBytes, randomInt } from "node:crypto";
import { cookies } from "next/headers";

import { questions } from "@/data/questions";
import { RequestBodyError } from "@/lib/security/request";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type {
  CreatePrivateRoomInput,
  JoinPrivateRoomInput,
  MultiplayerAnswerSubmission,
  MultiplayerActiveRoom,
  MultiplayerDeliveryReceipt,
  MultiplayerDifficultyBand,
  MultiplayerMatchResult,
  MultiplayerLobbyState,
  MultiplayerMatchHistoryEntry,
  MultiplayerPlayer,
  MultiplayerProfile,
  MultiplayerPublicRoom,
  MultiplayerRatingLeaderboardEntry,
  MultiplayerRoom,
  MultiplayerRoomAccess,
  MultiplayerRoomSettings,
  MultiplayerRoundState,
  MultiplayerRoundFeedback,
  MultiplayerScoringVersion,
  MultiplayerSpectator,
  MultiplayerSpectatorState,
} from "@/types/multiplayer";

// Static catalog only: build once per server module, not for every player's
// round read, answer, spectator refresh or each question in the final results.
// Never cache room state, permissions or player data here.
const questionById = new Map(questions.map(question => [question.id, question]));

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const GUEST_COOKIE_PREFIX = "mao_mp_guest_";
const ROOM_CODE_PATTERN = /^[A-Z0-9]{8}$/;
const ALLOWED_TIMES = new Set([30, 60, 90, 120, 150, 180]);
const DIFFICULTY_BANDS = new Set(["1-3", "2-4", "3-5"]);
// Six missed five-second heartbeats tolerate brief school-network interruptions.
// Membership survives expiry; only lobby presence expires, never match progress.
const LOBBY_PRESENCE_TIMEOUT_MS = 30_000;
function lobbyPresenceCutoff() {
  return new Date(Date.now() - LOBBY_PRESENCE_TIMEOUT_MS).toISOString();
}

interface RoomRow {
  scoring_version?: MultiplayerScoringVersion;
  id: string;
  code: string | null;
  visibility: "public" | "private";
  mode: "ranked" | "unranked";
  division: "Mu" | "Alpha" | "Theta";
  question_count: number;
  seconds_per_question: 30 | 60 | 90 | 120 | 150 | 180;
  difficulty_band: MultiplayerDifficultyBand | null;
  settings_version: number;
  status: "waiting" | "countdown" | "in-progress" | "completed" | "cancelled";
  capacity: number;
  host_player_id: string | null;
  countdown_ends_at: string | null;
  created_at: string;
  started_at: string | null;
  current_question_number: number;
  state_version: number;
}

interface PlayerRow {
  round_result?: MultiplayerRoundFeedback | null;
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
  hard_ends_at: string | null;
  intermission_ends_at: string | null;
}

interface SpectatorRow {
  user_id: string;
  joined_at: string;
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
    throw new Error("Choose 30, 60, 90, 120, 150, or 180 seconds per question.");
  }
  if (!settings.difficultyBand || !DIFFICULTY_BANDS.has(settings.difficultyBand)) {
    throw new Error("Choose difficulty 1–3, 2–4, or 3–5.");
  }
  availableRoomQuestions(settings);
}

function availableRoomQuestions(settings: MultiplayerRoomSettings) {
  const minimum = settings.difficultyBand ? Number(settings.difficultyBand[0]) : 1;
  const maximum = settings.difficultyBand ? minimum + 2 : 5;
  const available = questions.filter(question => question.division === settings.division &&
    question.difficulty >= minimum && question.difficulty <= maximum);
  if (available.length < settings.questionCount) throw new Error("There are not enough questions in that difficulty range. Choose fewer questions or another range.");
  return available;
}

function normalizeNickname(value?: string) {
  const nickname = value?.trim() ?? "";
  if (Array.from(nickname).length < 1 || Array.from(nickname).length > 20) {
    throw new Error("Guest nicknames must be between 1 and 20 characters.");
  }
  if (!isPublicNameAllowed(nickname)) throw new Error(PUBLIC_NAME_ERROR);
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
    scoringVersion: row.scoring_version ?? 1,
    id: row.id,
    code: row.code,
    visibility: row.visibility,
    status: row.status,
    settings: {
      division: row.division,
      questionCount: row.question_count,
      secondsPerQuestion: row.seconds_per_question,
      mode: row.mode,
      difficultyBand: row.difficulty_band ?? null,
    },
    playerCount,
    spectatorCount: 0,
    capacity: row.capacity,
    hostPlayerId: row.host_player_id,
    countdownEndsAt: row.countdown_ends_at ? new Date(row.countdown_ends_at).getTime() : null,
    createdAt: new Date(row.created_at).getTime(),
    startedAt: row.started_at ? new Date(row.started_at).getTime() : null,
    stateVersion: row.state_version,
    settingsVersion: row.settings_version ?? 0,
    currentQuestionNumber: row.current_question_number,
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
    roundResult: row.round_result ?? null,
  };
}

function mapScoreboardPlayers(rows: Array<PlayerRow & { display_name: string; rp: number | null }>): MultiplayerPlayer[] {
  return rows.map(row => {
    const player = mapPlayer(row, row.display_name);
    player.rp = row.user_id ? row.rp ?? 0 : null;
    player.rankTier = player.rp === null ? null : tierForRp(player.rp);
    return player;
  });
}

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

type LobbyIdentity = { p_user_id: string | null; p_guest_hash: string | null };
type LobbyPlayerRow = PlayerRow & { display_name: string; rp: number; lobby_ready?: boolean };
type LobbySnapshot = { room: RoomRow; currentPlayer: LobbyPlayerRow; players: LobbyPlayerRow[] };
export type LobbyPresenceAction = "connect" | "heartbeat" | "disconnect";
export type LobbyPresenceResult = {
  status: "connected" | "disconnected" | "left" | "started" | "conflict" | "full";
  lobby: MultiplayerLobbyState | null;
};

async function lobbyIdentity(roomId: string): Promise<LobbyIdentity | null> {
  const { data: { user }, error } = await (await createClient()).auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") throw new Error("Unable to verify your room membership. Please retry.");
  if (user) return { p_user_id: user.id, p_guest_hash: null };
  const token = (await cookies()).get(cookieName(roomId))?.value;
  return token ? { p_user_id: null, p_guest_hash: hashToken(token) } : null;
}

function mapLobbySnapshot(snapshot: LobbySnapshot | null): MultiplayerLobbyState | null {
  if (!snapshot?.currentPlayer) return null;
  const map = (row: LobbyPlayerRow) => ({ ...mapPlayer(row, row.display_name),
    lobbyReady: row.lobby_ready === true,
    rp: row.user_id ? row.rp : null, rankTier: row.user_id ? tierForRp(row.rp) : null });
  return { room: mapRoom(snapshot.room, snapshot.players.length),
    currentPlayer: map(snapshot.currentPlayer), players: snapshot.players.map(map) };
}

async function readLobby(roomId: string, identity: LobbyIdentity) {
  const { data, error } = await createAdminClient().rpc("read_multiplayer_lobby", { p_room_id: roomId, ...identity });
  if (error) throw new Error("Unable to load the lobby right now.");
  return mapLobbySnapshot(data as LobbySnapshot | null);
}

export async function changeMultiplayerLobbyPresence(roomId: string, action: LobbyPresenceAction, tabId: string, connectionId: string, generation: number, playerId: string): Promise<LobbyPresenceResult> {
  const identity = await lobbyIdentity(roomId);
  if (!identity) return { status: "left", lobby: null };
  const { data, error } = await createAdminClient().rpc("change_multiplayer_lobby_presence", {
    p_room_id: roomId, ...identity, p_action: action, p_tab_id: tabId, p_connection_id: connectionId, p_generation: generation, p_player_id: playerId,
  });
  if (error || !data) throw new Error("Unable to update your lobby connection. Please try again.");
  let lobby = mapLobbySnapshot(data.lobby ?? null);
  // Only a due heartbeat/start boundary attempts a transition; live GETs stay read-only.
  if (lobby?.room.visibility === "public" && lobby.room.status === "countdown" &&
    (lobby.room.countdownEndsAt ?? Infinity) <= Date.now()) {
    await prepareRoomMatch(lobby, "countdown", identity);
    lobby = await readLobby(roomId, identity);
  }
  return { status: data.status as LobbyPresenceResult["status"], lobby };
}

export async function updateMultiplayerLobbyReady(roomId: string, ready: boolean,
  settingsVersion: number, connectionId: string, playerId: string): Promise<MultiplayerLobbyState> {
  if (typeof ready !== "boolean" || !Number.isSafeInteger(settingsVersion) || settingsVersion < 0) {
    throw new RequestBodyError("Invalid Ready request.", 400);
  }
  const identity = await lobbyIdentity(roomId);
  if (!identity?.p_user_id) throw new RequestBodyError("Sign in to change Ready in a public room.", 403);
  // One authenticated identity and one room-locked RPC, never browser authority.
  const { data, error } = await createAdminClient().rpc("set_multiplayer_lobby_ready", {
    p_room_id: roomId, p_user_id: identity.p_user_id, p_ready: ready,
    p_settings_version: settingsVersion, p_connection_id: connectionId, p_player_id: playerId,
  });
  if (error?.code === "P0001") throw new RequestBodyError(error.message, 409);
  if (error || !data) throw new Error("Unable to confirm Ready. Please retry.");
  const updated = mapLobbySnapshot(data as LobbySnapshot);
  if (!updated) throw new Error("Unable to confirm Ready. Reconnect to the lobby.");
  return updated;
}

export async function confirmMultiplayerLeave(roomId: string, connectionId: string): Promise<"left" | "started" | "conflict"> {
  const identity = await lobbyIdentity(roomId);
  if (!identity) throw new Error("Sign in or rejoin to verify your room membership.");
  const { data, error } = await createAdminClient().rpc("leave_multiplayer_lobby", {
    p_room_id: roomId, ...identity, p_connection_id: connectionId,
  });
  if (error || !["left", "started", "conflict"].includes(data)) throw new Error("Unable to confirm you left. Please retry.");
  // Keep the now-inert guest cookie until expiry/rejoin. Deleting it in these
  // response headers would prevent a safe retry if only the response body is
  // lost. The deleted membership means this token no longer grants room access.
  return data;
}

export async function updateMultiplayerDifficulty(roomId: string, difficultyBand: MultiplayerDifficultyBand,
  settingsVersion: number, connectionId: string, playerId: string): Promise<MultiplayerLobbyState> {
  if (!DIFFICULTY_BANDS.has(difficultyBand) || !Number.isSafeInteger(settingsVersion) || settingsVersion < 0) {
    throw new RequestBodyError("Choose a valid difficulty range.", 400);
  }
  const identity = await lobbyIdentity(roomId);
  if (!identity) throw new RequestBodyError("Rejoin the lobby before changing settings.", 403);
  const lobby = await readLobby(roomId, identity);
  if (!lobby) throw new RequestBodyError("Room not found.", 404);
  // Check availability against the trusted catalog, never IDs supplied by a browser.
  availableRoomQuestions({ ...lobby.room.settings, difficultyBand });
  const { data, error } = await createAdminClient().rpc("set_multiplayer_lobby_difficulty", {
    p_room_id: roomId, ...identity, p_difficulty_band: difficultyBand,
    p_settings_version: settingsVersion, p_connection_id: connectionId, p_player_id: playerId,
  });
  if (error?.code === "P0001") throw new RequestBodyError(error.message, 409);
  if (error || !data) throw new Error("Unable to save the difficulty. Please retry.");
  const updated = mapLobbySnapshot(data as LobbySnapshot);
  if (!updated) throw new Error("Unable to confirm the new difficulty. Please reload.");
  return updated;
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
    if (error.code === "23514" && error.message.includes("public_name_not_allowed")) throw new Error(PUBLIC_NAME_ERROR);
    if (error.code === "P0001") throw new Error(error.message);
    throw new Error("Unable to join the private room right now.");
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
  const user = await currentUser();
  if (!user) throw new Error("Sign in to create a private room.");
  const admin = createAdminClient();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: roomId, error } = await admin.rpc("create_private_multiplayer_room", {
      p_user_id: user.id,
      p_code: generateRoomCode(),
      p_mode: input.settings.mode,
      p_division: input.settings.division,
      p_question_count: input.settings.questionCount,
      p_seconds_per_question: input.settings.secondsPerQuestion,
      p_difficulty_band: input.settings.difficultyBand,
    });
    if (error?.code === "23505") continue;
    if (error?.code === "P0001") throw new Error(error.message);
    if (error || typeof roomId !== "string") throw new Error("Unable to create the private room right now.");
    const { data: room, error: readError } = await admin.from("multiplayer_rooms")
      .select("*").eq("id", roomId).single<RoomRow>();
    if (readError || !room) throw new Error("Unable to load your new room right now.");
    return mapRoom(room, 1);
  }
  throw new Error("Unable to create a unique room code. Please try again.");
}

export async function joinPrivateRoom(input: JoinPrivateRoomInput): Promise<MultiplayerRoom> {
  const code = input.code.trim().toUpperCase();
  if (!ROOM_CODE_PATTERN.test(code)) throw new Error("Enter a valid 8-character room code.");
  const admin = createAdminClient();
  const { data: room, error } = await admin.from("multiplayer_rooms").select("*").eq("code", code).eq("visibility", "private").maybeSingle<RoomRow>();
  if (error) throw new Error("Unable to find the private room right now.");
  if (!room) throw new Error("Private room not found.");

  const user = await currentUser();
  let existingPlayerId: string | null = null;
  if (user) {
    const { data: existing } = await admin
      .from("multiplayer_players")
      .select("id")
      .eq("room_id", room.id)
      .eq("user_id", user.id)
      .is("left_at", null)
      .maybeSingle<{ id: string }>();
    existingPlayerId = existing?.id ?? null;
  } else {
    const reconnectToken = (await cookies()).get(cookieName(room.id))?.value;
    if (reconnectToken) {
      const { data: existing } = await admin
        .from("multiplayer_players")
        .select("id")
        .eq("room_id", room.id)
        .eq("reconnect_token_hash", hashToken(reconnectToken))
        .is("left_at", null)
        .maybeSingle<{ id: string }>();
      existingPlayerId = existing?.id ?? null;
    }
  }

  if (existingPlayerId) {
    // The lobby's fenced connect RPC owns reactivation, including capacity and
    // concurrent-start checks. Merely navigating here must not revive an old tab.
    const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).is("left_at", null);
    return mapRoom(room, count ?? 0);
  }

  if (room.status !== "waiting") throw new Error("That room is no longer accepting players.");
  const { count, error: countError } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).is("left_at", null);
  if (countError) throw new Error(`Unable to check room capacity: ${countError.message}`);
  if ((count ?? 0) >= room.capacity) throw new Error("That private room is full.");
  await addPlayer(room, input.guestNickname);
  return mapRoom(room, (count ?? 0) + 1);
}

export async function getMultiplayerRoom(roomId: string, includePlayerCount = true): Promise<MultiplayerRoomAccess | null> {
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

  const { count } = includePlayerCount
    ? await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", roomId).is("left_at", null)
    : { count: 0 };
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
  const { data, error } = await admin.from("multiplayer_spectators").select("user_id, joined_at").eq("room_id", roomId).gte("last_seen_at", new Date(Date.now() - 10_000).toISOString()).order("joined_at");
  if (error) throw new Error("Unable to load spectators right now.");
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

export async function getPrivateLobby(roomId: string): Promise<MultiplayerLobbyState | null> {
  const identity = await lobbyIdentity(roomId);
  return identity ? readLobby(roomId, identity) : null;
}

async function prepareRoomMatch(lobby: MultiplayerLobbyState, expectedStatus: "waiting" | "countdown", identity?: LobbyIdentity): Promise<MultiplayerRoom> {
  if (lobby.room.status !== expectedStatus) return lobby.room;
  const actor = identity ?? await lobbyIdentity(lobby.room.id);
  if (!actor) throw new Error("Room not found.");
  const available = availableRoomQuestions(lobby.room.settings);
  for (let index = available.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [available[index], available[swapIndex]] = [available[swapIndex], available[index]];
  }
  const selected = available.slice(0, lobby.room.settings.questionCount);
  const { data, error } = await createAdminClient().rpc("start_multiplayer_lobby", {
    p_room_id: lobby.room.id, ...actor,
    p_question_ids: selected.map((question) => question.id),
    p_difficulties: selected.map((question) => question.difficulty),
    p_settings_version: lobby.room.settingsVersion,
  });
  if (error?.code === "P0001") throw new Error(error.message);
  if (error || !data) throw new Error("Unable to start this room. Please return to the lobby and retry.");
  return mapRoom(data as RoomRow, lobby.players.length);
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
  const identity = await lobbyIdentity(roomId);
  if (!identity) return null;
  const lobby = await readLobby(roomId, identity);
  if (!lobby || lobby.room.visibility !== "public") return null;
  if (lobby.room.status !== "countdown") return lobby.room;
  return prepareRoomMatch(lobby, "countdown", identity);
}

export function getMultiplayerRoundState(roomId: string): Promise<MultiplayerRoundState | { completed: true } | null>;
export function getMultiplayerRoundState(roomId: string, knownVersion: number): Promise<MultiplayerRoundState | { unchanged: true } | { completed: true } | null>;
export async function getMultiplayerRoundState(roomId: string, knownVersion = -1): Promise<MultiplayerRoundState | { unchanged: true } | { completed: true } | null> {
  const identity = await lobbyIdentity(roomId);
  if (!identity) return null;
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("read_multiplayer_round_for_actor", {
    p_room_id: roomId, ...identity, p_known_version: knownVersion,
  });
  if (error) throw new Error("Unable to read multiplayer state.");
  if (data?.status === "completed") return { completed: true };
  if (!data || data.status !== "in-progress") return null;
  if (data.unchanged) return { unchanged: true };
  const q = data.question as MatchQuestionRow | null;
  if (!q) return null;
  const presentQuestion = (row: MatchQuestionRow) => {
    const source = questionById.get(row.question_id);
    if (!source) throw new Error("Question unavailable.");
    return { questionId: source.id, number: row.question_number, division: source.division,
      topic: source.topic, difficulty: row.difficulty, question: source.question, choices: source.choices,
      illustration: source.illustration, source: source.source };
  };
  const upcoming = data.upcoming as MatchQuestionRow | null;
  const players = mapScoreboardPlayers(data.players);
  return {
    roomId, stateVersion: data.stateVersion, currentPlayerId: data.currentPlayerId,
    questionNumber: q.question_number, totalQuestions: data.totalQuestions,
    scoringVersion: data.scoringVersion ?? 1,
    roundClosed: data.roundClosed === true,
    question: presentQuestion(q), questionDurationSeconds: data.questionDurationSeconds,
    preparing: !q.started_at,
    questionStartedAt: q.started_at ? new Date(q.started_at).getTime() : 0,
    questionEndsAt: q.ends_at ? new Date(q.ends_at).getTime() : 0,
    intermissionEndsAt: q.intermission_ends_at ? new Date(q.intermission_ends_at).getTime() : null,
    players, spectators: ((data.spectators ?? []) as Array<SpectatorRow & { display_name: string; rp: number }>).map(row => ({
      playerId: row.user_id, userId: row.user_id, displayName: row.display_name, isGuest: false,
      rankTier: tierForRp(row.rp), rp: row.rp, globalRank: null, joinedAt: new Date(row.joined_at).getTime(),
    })),
    upcomingQuestion: upcoming ? {
      preparing: !upcoming.started_at,
      questionNumber: upcoming.question_number, question: presentQuestion(upcoming),
      questionStartedAt: upcoming.started_at ? new Date(upcoming.started_at).getTime() : 0,
      questionEndsAt: upcoming.ends_at ? new Date(upcoming.ends_at).getTime() : 0,
    } : null,
  };
}
export async function acknowledgeMultiplayerQuestionReady(roomId: string, questionNumber: number) {
  const access = await getMultiplayerRoom(roomId, false);
  if (!access) throw new RequestBodyError("Player is not in this room.", 403);
  const { error } = await createAdminClient().rpc("acknowledge_multiplayer_question_ready", {
    p_room_id: roomId, p_player_id: access.currentPlayer.playerId, p_question_number: questionNumber,
  });
  if (error) throw new RequestBodyError("Unable to confirm question readiness.", error.code === "P0001" ? 409 : 503);
}

export async function acknowledgeMultiplayerQuestionDelivery(
  roomId: string,
  questionNumber: number,
): Promise<MultiplayerDeliveryReceipt> {
  if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > 30) {
    throw new Error("Choose a valid question.");
  }

  const access = await getMultiplayerRoom(roomId);
  if (!access || access.room.status !== "in-progress") {
    throw new Error("This match is not active.");
  }

  const admin = createAdminClient();
  const { data: matchQuestion, error: questionError } = await admin
    .from("multiplayer_match_questions")
    .select("question_number, question_id, difficulty, started_at, ends_at, hard_ends_at, intermission_ends_at")
    .eq("room_id", roomId)
    .eq("question_number", questionNumber)
    .single<MatchQuestionRow>();
  if (questionError || !matchQuestion.started_at || !matchQuestion.ends_at) {
    throw new Error("This question is unavailable.");
  }

  const { data: deliveredAt, error: deliveryError } = await admin.rpc(
    "acknowledge_multiplayer_question_delivery",
    {
      p_room_id: roomId,
      p_question_number: questionNumber,
      p_player_id: access.currentPlayer.playerId,
    },
  );
  if (deliveryError || typeof deliveredAt !== "string") {
    throw new Error("Unable to start your question timer.");
  }

  const deliveryTime = new Date(deliveredAt).getTime();
  const questionStartedAt = new Date(matchQuestion.started_at).getTime();
  const hardEndsAt = new Date(matchQuestion.hard_ends_at ?? matchQuestion.ends_at).getTime();
  return {
    questionNumber,
    deliveredAt: deliveryTime,
    personalEndsAt: Math.min(
      hardEndsAt,
      // Delivery receipts are diagnostic only, never a way to restart the clock.
      questionStartedAt + access.room.settings.secondsPerQuestion * 1000,
    ),
    hardEndsAt,
  };
}

export async function submitMultiplayerAnswer(input: MultiplayerAnswerSubmission): Promise<"accepted"> {
  if (!Number.isSafeInteger(input.questionId) || input.questionId <= 0
    || (input.selectedAnswer !== null && !["A", "B", "C", "D", "E"].includes(input.selectedAnswer))) {
    throw new RequestBodyError("Choose a valid answer.", 400);
  }
  const access = await getMultiplayerRoom(input.roomId, false);
  if (!access) throw new RequestBodyError("Player is not in this room.", 403);
  const question = questionById.get(input.questionId);
  if (!question) throw new RequestBodyError("Unknown question.", 400);
  const admin = createAdminClient();
  const { error } = await admin.rpc("accept_multiplayer_answer", {
    p_room_id: input.roomId,
    p_player_id: access.currentPlayer.playerId,
    p_question_id: input.questionId,
    p_selected_answer: input.selectedAnswer,
    p_correct: input.selectedAnswer === question.answer,
  });
  if (error) {
    if (error.code === "P0001") throw new RequestBodyError(error.message, 409);
    throw new Error("Unable to confirm your answer right now.");
  }
  // Acceptance and early completion are committed by one database call.
  return "accepted";
}
interface SubmissionRow {
  player_id: string;
  question_number: number;
  question_id: number;
  selected_answer: "A" | "B" | "C" | "D" | "E" | null;
  correct: boolean;
  answer_time_ms: number;
  points_earned: number;
}

async function finalizeCompletedMatch(roomId: string): Promise<void> {
  const { error } = await createAdminClient().rpc("finalize_multiplayer_match", { p_room_id: roomId });
  if (error) throw new Error("Results are still being prepared. Please retry.");
}
export async function getMultiplayerMatchResult(roomId: string): Promise<MultiplayerMatchResult | null> {
  const identity = await lobbyIdentity(roomId);
  if (!identity) return null;
  const admin = createAdminClient();
  async function read() {
    const { data, error } = await admin.rpc("read_multiplayer_result_snapshot", { p_room_id: roomId, ...identity });
    if (error) throw new Error("Unable to load match results right now.");
    return data;
  }
  let snapshot = await read();
  if (!snapshot) return null;
  if (snapshot.status === "pending") {
    // Keep the single-host fallback; guests do not compete on finalization locks.
    if (!snapshot.isHost) return null;
    await finalizeCompletedMatch(roomId);
    snapshot = await read();
    if (!snapshot || snapshot.status === "pending") return null;
  }
  const spectatorMode = snapshot.viewerMode === "spectator";
  const result = snapshot.result;
  if (snapshot.status !== "ready" || snapshot.scoreboard?.status !== "completed"
    || (!spectatorMode && !result)) throw new Error("Unable to load match results right now.");
  const placements = snapshot.placements as Array<{ player_id: string; placement: number }>;
  const resultByPlayer = new Map(placements.map(entry => [entry.player_id, entry]));
  const finalLeaderboard = mapScoreboardPlayers(snapshot.scoreboard.players).map((player) => {
    player.placement = resultByPlayer.get(player.playerId)?.placement ?? null;
    return player;
  }).sort((a, b) => (a.placement ?? 999) - (b.placement ?? 999));
  const submissionByQuestion = new Map((snapshot.submissions as SubmissionRow[]).map(submission => [submission.question_number, submission]));
  const rounds = (snapshot.questions as MatchQuestionRow[]).map((matchQuestion) => {
    const question = questionById.get(matchQuestion.question_id);
    if (!question) throw new Error("Unable to load a match question.");
    const submission = submissionByQuestion.get(matchQuestion.question_number);
    return {
      questionId: question.id, questionNumber: matchQuestion.question_number,
      question: question.question, choices: question.choices, illustration: question.illustration, source: question.source,
      selectedAnswer: submission?.selected_answer ?? null, correctAnswer: question.answer,
      correct: submission?.correct ?? false, answerTimeMs: submission?.answer_time_ms ?? null,
      pointsEarned: submission?.points_earned ?? 0, solution: question.solution,
    };
  });
  const displayedNewRp = result?.new_rp ?? 0;
  const displayedPreviousRp = result?.previous_rp ?? 0;

  return {
    roomId, viewerMode: spectatorMode ? "spectator" : "player",
    placement: spectatorMode ? null : result.placement,
    score: spectatorMode ? null : result.final_score,
    ranked: spectatorMode ? false : result.ranked,
    ratingChange: spectatorMode || result.previous_rp === null ? null : {
      previousRp: displayedPreviousRp,
      change: displayedNewRp - displayedPreviousRp,
      newRp: displayedNewRp,
      previousTier: tierForRp(displayedPreviousRp)!,
      newTier: tierForRp(displayedNewRp)!,
      opponentAdjustment: Number(result.opponent_adjustment), performanceIndex: Number(result.performance_index), completionFactor: Number(result.completion_factor),
    },
    rounds, finalLeaderboard,
  };
}

export async function hasAcknowledgedMultiplayerResult(roomId: string): Promise<boolean> {
  const access = await getMultiplayerRoom(roomId, false);
  if (!access) return false;
  const { data, error } = await createAdminClient().from("multiplayer_result_receipts")
    .select("player_id").eq("room_id", roomId)
    .eq("player_id", access.currentPlayer.playerId).maybeSingle();
  if (error) throw new Error("Unable to check match results right now.");
  return Boolean(data);
}

export async function acknowledgeMultiplayerResult(roomId: string): Promise<boolean> {
  const access = await getMultiplayerRoom(roomId, false);
  if (!access || access.room.status !== "completed") return false;
  const { data, error } = await createAdminClient().rpc("acknowledge_multiplayer_result", {
    p_room_id: roomId,
    p_player_id: access.currentPlayer.playerId,
  });
  if (error) throw new Error("Unable to confirm result delivery.");
  return data === true;
}

export async function listRecentMultiplayerMatches(): Promise<MultiplayerMatchHistoryEntry[]> {
  const user = await currentUser();
  if (!user) return [];
  const admin = createAdminClient();
  const { data, error } = await admin.from("multiplayer_match_history")
    .select("room_id, division, question_count, placement, final_score, ranked, previous_rp, new_rp, finalized_at")
    .eq("user_id", user.id).order("finalized_at", { ascending: false }).limit(10);
  if (error) throw new Error("Unable to load recent matches right now.");
  return (data ?? []).map((result) => ({
    roomId: result.room_id,
    division: result.division as MultiplayerMatchHistoryEntry["division"],
    questionCount: result.question_count,
    placement: result.placement,
    score: result.final_score,
    ranked: result.ranked,
    rpChange: result.previous_rp === null || result.new_rp === null
      ? null : result.new_rp - result.previous_rp,
    completedAt: new Date(result.finalized_at).getTime(),
  }));
}

export async function listPublicRooms(): Promise<MultiplayerPublicRoom[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("multiplayer_rooms").select("*").eq("visibility", "public").in("status", ["waiting", "countdown"]).order("division").order("question_count");
  if (error) throw new Error("Unable to load public rooms right now.");
  const rooms = (data ?? []) as RoomRow[];
  if (rooms.length === 0) return [];

  const roomIds = rooms.map((room) => room.id);
  const { data: playerData, error: playerError } = await admin
    .from("multiplayer_players")
    .select("id, room_id, user_id, guest_nickname")
    .in("room_id", roomIds)
    .eq("connected", true)
    .is("left_at", null)
    // Lobby heartbeats refresh updated_at every five seconds. A missed leave
    // notification must not keep an abandoned seat visible indefinitely.
    .gte("updated_at", lobbyPresenceCutoff())
    .order("joined_at", { ascending: true });
  if (playerError) throw new Error("Unable to load players in public rooms.");

  const playerRows = (playerData ?? []) as Array<{
    id: string;
    room_id: string;
    user_id: string | null;
    guest_nickname: string | null;
  }>;
  const userIds = [...new Set(playerRows.flatMap((player) => player.user_id ? [player.user_id] : []))];
  const [namesResponse, ratingsResponse] = userIds.length > 0
    ? await Promise.all([
        admin.from("profiles").select("id, username").in("id", userIds),
        admin.from("multiplayer_profiles").select("user_id, rp").in("user_id", userIds),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];
  if (namesResponse.error || ratingsResponse.error) throw new Error("Unable to load public room player profiles.");

  const names = new Map((namesResponse.data ?? []).map((profile) => [profile.id, profile.username]));
  const ratings = new Map((ratingsResponse.data ?? []).map((profile) => [profile.user_id, profile.rp]));

  return rooms.map((room) => {
    const players = playerRows
      .filter((player) => player.room_id === room.id)
      .map((player) => {
        const displayName = player.user_id
          ? names.get(player.user_id) ?? "Player"
          : player.guest_nickname ?? "Guest";
        const rp = player.user_id ? ratings.get(player.user_id) ?? 0 : null;
        return {
          playerId: player.id,
          displayName,
          rankTier: rp === null ? null : tierForRp(rp),
        };
      });
    return { ...mapRoom(room, players.length), players };
  });
}

function multiplayerRoomHasNotExpired(room: RoomRow): boolean {
  if (!room.started_at) return true;
  const expectedDurationMs = room.question_count * (room.seconds_per_question + 10) * 1000;
  const reconnectWindowMs = 2 * 60 * 1000;
  return Date.now() <= new Date(room.started_at).getTime() + expectedDurationMs + reconnectWindowMs;
}

export async function listOngoingPublicMatches(): Promise<MultiplayerRoom[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("multiplayer_rooms").select("*").eq("visibility", "public").eq("status", "in-progress").order("started_at", { ascending: false }).limit(20);
  if (error) throw new Error("Unable to load ongoing public matches right now.");
  const rooms = await Promise.all(((data ?? []) as RoomRow[]).map(async (room) => {
    if (!multiplayerRoomHasNotExpired(room)) {
      await admin.from("multiplayer_rooms").update({ status: "cancelled" }).eq("id", room.id).eq("status", "in-progress");
      return null;
    }
    const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).is("left_at", null);
    return (count ?? 0) > 0 ? mapRoom(room, count ?? 0) : null;
  }));
  return rooms.filter((room): room is MultiplayerRoom => room !== null);
}
export async function listMyActiveMultiplayerRooms(): Promise<MultiplayerActiveRoom[]> {
  const user = await currentUser();
  if (!user) return [];
  const admin = createAdminClient();
  const { data: memberships, error: membershipError } = await admin.from("multiplayer_players").select("room_id, is_host, connected, updated_at").eq("user_id", user.id).is("left_at", null);
  if (membershipError) throw new Error(`Unable to load active games: ${membershipError.message}`);
  const roomIds = [...new Set((memberships ?? []).map((membership) => membership.room_id))];
  if (roomIds.length === 0) return [];

  const { data, error } = await admin.from("multiplayer_rooms").select("*").in("id", roomIds).in("status", ["waiting", "countdown", "in-progress"]).order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load active games right now.");
  const rooms = await Promise.all(((data ?? []) as RoomRow[]).map(async (room) => {
    if (room.status === "in-progress" && !multiplayerRoomHasNotExpired(room)) return null;
    const membership = memberships?.find((entry) => entry.room_id === room.id);
    if (room.status !== "in-progress" && room.visibility !== "private") {
      if (!membership?.connected || new Date(membership.updated_at).getTime() < Date.now() - LOBBY_PRESENCE_TIMEOUT_MS) return null;
    }
    const { count } = await admin.from("multiplayer_players").select("id", { count: "exact", head: true }).eq("room_id", room.id).is("left_at", null);
    return { ...mapRoom(room, count ?? 0), isHost: membership?.is_host === true };
  }));
  return rooms.filter((room): room is MultiplayerActiveRoom => room !== null);
}

export async function closeOwnedPrivateLobby(roomId: string): Promise<"closed" | "started"> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roomId)) {
    throw new RequestBodyError("Invalid room.", 400);
  }
  const user = await currentUser();
  if (!user) throw new RequestBodyError("Sign in to close your room.", 401);
  const { data, error } = await createAdminClient().rpc("close_owned_private_multiplayer_lobby", {
    p_room_id: roomId, p_user_id: user.id,
  });
  if (error?.code === "P0001") throw new RequestBodyError(error.message, 403);
  if (error || (data !== "closed" && data !== "started")) {
    throw new Error("Closing the room was not confirmed. Please retry.");
  }
  return data;
}
export async function joinPublicRoom(roomId: string): Promise<MultiplayerRoom> {
  const user = await currentUser();
  if (!user) throw new Error("Sign in or create an account to join public rooms.");
  const { data, error } = await createAdminClient().rpc("join_public_multiplayer_lobby", {
    p_room_id: roomId, p_user_id: user.id,
  });
  if (error?.code === "P0001") throw new Error(error.message);
  if (error || !data) throw new Error("Unable to join that public room. Please try again.");
  return mapRoom(data as RoomRow, data.player_count);
}

export async function leaveMultiplayerRoom(roomId: string, connectionId: string): Promise<void> {
  const status = await confirmMultiplayerLeave(roomId, connectionId);
  if (status === "started") throw new Error("The game already started before your leave was accepted. Use Rejoin Game to return.");
  if (status === "conflict") throw new Error("Your room connection changed. Reload before leaving.");
}
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
  const [snapshot, spectators] = await Promise.all([
    admin.rpc("read_multiplayer_scoreboard", { p_room_id: roomId }), listActiveSpectators(roomId),
  ]);
  if (snapshot.error || !snapshot.data) throw new Error("Unable to read multiplayer state.");
  const data = snapshot.data;
  if (data.status !== "in-progress") throw new Error("That public match is no longer in progress.");
  const matchQuestion = data.question as MatchQuestionRow | null;
  const question = matchQuestion ? questionById.get(matchQuestion.question_id) : null;
  if (!matchQuestion || !question) throw new Error("The current question is unavailable.");
  return { roomId, stateVersion: data.stateVersion, roundClosed: data.roundClosed === true,
    questionNumber: matchQuestion.question_number, totalQuestions: data.totalQuestions,
    question: { questionId: question.id, number: matchQuestion.question_number, division: question.division,
      topic: question.topic, difficulty: matchQuestion.difficulty, question: question.question, choices: question.choices,
      illustration: question.illustration, source: question.source },
    questionDurationSeconds: data.questionDurationSeconds,
    questionStartedAt: matchQuestion.started_at ? new Date(matchQuestion.started_at).getTime() : 0,
    questionEndsAt: matchQuestion.ends_at ? new Date(matchQuestion.ends_at).getTime() : 0,
    intermissionEndsAt: matchQuestion.intermission_ends_at ? new Date(matchQuestion.intermission_ends_at).getTime() : null,
    players: mapScoreboardPlayers(data.players), spectators };
}

export async function leavePublicSpectator(roomId: string): Promise<void> {
  const user = await currentUser();
  if (user) await createAdminClient().from("multiplayer_spectators").delete().eq("room_id", roomId).eq("user_id", user.id);
}
export async function getMultiplayerProfile(): Promise<MultiplayerProfile | null> {
  const user = await currentUser();
  if (!user) return null;
  const admin = createAdminClient();
  await admin.from("multiplayer_profiles").upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
  const [profileResponse, nameResponse] = await Promise.all([
    admin.from("multiplayer_profiles").select("user_id, rp, ranked_matches_played, ranked_wins").eq("user_id", user.id).single(),
    admin.from("profiles").select("username").eq("id", user.id).single<{ username: string }>(),
  ]);
  if (profileResponse.error || nameResponse.error) throw new Error("Unable to load your multiplayer rating.");
  const profile = profileResponse.data;
  const { count } = await admin.from("multiplayer_profiles").select("user_id", { count: "exact", head: true }).gt("rp", profile.rp);
  return {
    userId: user.id, username: nameResponse.data.username, rp: profile.rp,
    rankTier: tierForRp(profile.rp)!, globalRank: (count ?? 0) + 1,
    rankedMatchesPlayed: profile.ranked_matches_played, rankedWins: profile.ranked_wins,
    provisionalMatchesPlayed: Math.min(profile.ranked_matches_played, 5),
  };
}

export async function getMultiplayerRatingLeaderboard(): Promise<MultiplayerRatingLeaderboardEntry[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("multiplayer_profiles").select("user_id, rp, ranked_matches_played, ranked_wins").order("rp", { ascending: false }).order("ranked_wins", { ascending: false }).limit(10);
  if (error) throw new Error("Unable to load the RP leaderboard right now.");
  const profiles = data ?? [];
  if (profiles.length === 0) return [];
  const { data: names } = await admin.from("profiles").select("id, username").in("id", profiles.map((profile) => profile.user_id));
  const nameById = new Map((names ?? []).map((profile) => [profile.id, profile.username]));
  return profiles.map((profile, index) => ({
    userId: profile.user_id, username: nameById.get(profile.user_id) ?? "Player",
    rp: profile.rp, rankTier: tierForRp(profile.rp)!, globalRank: index + 1,
    rankedWins: profile.ranked_wins,
    winRate: profile.ranked_matches_played > 0 ? Math.round(profile.ranked_wins / profile.ranked_matches_played * 100) : 0,
  }));
}
