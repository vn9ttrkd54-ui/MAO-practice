perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
	LC_ALL = "C.UTF-8",
	LC_CTYPE = "C.UTF-8",
	LANG = "C.UTF-8"
    are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type {
  CreatePrivateRoomInput,
  JoinPrivateRoomInput,
  MultiplayerAnswerSubmission,
  MultiplayerMatchResult,
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
const GUEST_NICKNAME_PATTERN = /^[A-Za-z0-9_ ]{3,20}$/;
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
  if (!GUEST_NICKNAME_PATTERN.test(nickname)) {
    throw new Error("Guest nicknames must be 3–20 letters, numbers, spaces, or underscores.");
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
      path: `/multiplayer/room/${room.id}`,
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

export async function listPublicRooms(): Promise<MultiplayerRoom[]> { return notImplemented(); }
export async function listOngoingPublicMatches(): Promise<MultiplayerRoom[]> { return notImplemented(); }
export async function joinPublicRoom(_roomId: string): Promise<MultiplayerRoom> { void _roomId; return notImplemented(); }
export async function startPrivateMatch(_roomId: string): Promise<MultiplayerRoundState> { void _roomId; return notImplemented(); }
export async function getMultiplayerRoundState(_roomId: string): Promise<MultiplayerRoundState | null> { void _roomId; return notImplemented(); }
export async function submitMultiplayerAnswer(_input: MultiplayerAnswerSubmission): Promise<MultiplayerRoundState> { void _input; return notImplemented(); }
export async function leaveMultiplayerRoom(_roomId: string): Promise<void> { void _roomId; return notImplemented(); }
export async function spectatePublicMatch(_roomId: string): Promise<MultiplayerRoundState> { void _roomId; return notImplemented(); }
export async function getMultiplayerMatchResult(_roomId: string): Promise<MultiplayerMatchResult | null> { void _roomId; return notImplemented(); }
export async function getMultiplayerProfile(): Promise<MultiplayerProfile | null> { return notImplemented(); }
export async function getMultiplayerRatingLeaderboard(): Promise<MultiplayerRatingLeaderboardEntry[]> { return notImplemented(); }
