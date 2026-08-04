import type {
  CreatePrivateRoomInput,
  JoinPrivateRoomInput,
  MultiplayerAnswerSubmission,
  MultiplayerMatchResult,
  MultiplayerProfile,
  MultiplayerRatingLeaderboardEntry,
  MultiplayerRoom,
  MultiplayerRoundState,
} from "@/types/multiplayer";

function notImplemented(): never {
  throw new Error("Multiplayer service is not implemented yet.");
}

export async function listPublicRooms(): Promise<MultiplayerRoom[]> {
  return notImplemented();
}

export async function listOngoingPublicMatches(): Promise<MultiplayerRoom[]> {
  return notImplemented();
}

export async function getMultiplayerRoom(
  _roomId: string
): Promise<MultiplayerRoom | null> {
  void _roomId;
  return notImplemented();
}

export async function createPrivateRoom(
  _input: CreatePrivateRoomInput
): Promise<MultiplayerRoom> {
  void _input;
  return notImplemented();
}

export async function joinPrivateRoom(
  _input: JoinPrivateRoomInput
): Promise<MultiplayerRoom> {
  void _input;
  return notImplemented();
}

export async function joinPublicRoom(
  _roomId: string
): Promise<MultiplayerRoom> {
  void _roomId;
  return notImplemented();
}

export async function startPrivateMatch(
  _roomId: string
): Promise<MultiplayerRoundState> {
  void _roomId;
  return notImplemented();
}

export async function getMultiplayerRoundState(
  _roomId: string
): Promise<MultiplayerRoundState | null> {
  void _roomId;
  return notImplemented();
}

export async function submitMultiplayerAnswer(
  _input: MultiplayerAnswerSubmission
): Promise<MultiplayerRoundState> {
  void _input;
  return notImplemented();
}

export async function leaveMultiplayerRoom(_roomId: string): Promise<void> {
  void _roomId;
  return notImplemented();
}

export async function spectatePublicMatch(
  _roomId: string
): Promise<MultiplayerRoundState> {
  void _roomId;
  return notImplemented();
}

export async function getMultiplayerMatchResult(
  _roomId: string
): Promise<MultiplayerMatchResult | null> {
  void _roomId;
  return notImplemented();
}

export async function getMultiplayerProfile(): Promise<
  MultiplayerProfile | null
> {
  return notImplemented();
}

export async function getMultiplayerRatingLeaderboard(): Promise<
  MultiplayerRatingLeaderboardEntry[]
> {
  return notImplemented();
}
