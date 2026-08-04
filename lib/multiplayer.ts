export interface MultiplayerSummary {
  status: "coming-soon";
  rank: string;
  rating: number | null;
  matchesPlayed: number;
  wins: number;
  averagePlacement: number | null;
  currentStreak: number;
}

export function getMultiplayerSummary():
  MultiplayerSummary {
  return {
    status: "coming-soon",
    rank: "Unranked",
    rating: null,
    matchesPlayed: 0,
    wins: 0,
    averagePlacement: null,
    currentStreak: 0,
  };
}

export {
  createPrivateRoom,
  getMultiplayerMatchResult,
  getMultiplayerProfile,
  getMultiplayerRatingLeaderboard,
  getMultiplayerRoom,
  getMultiplayerRoundState,
  joinPrivateRoom,
  joinPublicRoom,
  leaveMultiplayerRoom,
  listOngoingPublicMatches,
  listPublicRooms,
  spectatePublicMatch,
  startPrivateMatch,
  submitMultiplayerAnswer,
} from "@/lib/services/multiplayerService";

export type {
  CreatePrivateRoomInput,
  JoinPrivateRoomInput,
  MultiplayerAnswerSubmission,
  MultiplayerMatchResult,
  MultiplayerPlayer,
  MultiplayerPlayerIdentity,
  MultiplayerProfile,
  MultiplayerQuestion,
  MultiplayerRankTier,
  MultiplayerRatingChange,
  MultiplayerRatingLeaderboardEntry,
  MultiplayerRoom,
  MultiplayerRoomMode,
  MultiplayerRoomSettings,
  MultiplayerRoomStatus,
  MultiplayerRoomVisibility,
  MultiplayerRoundResult,
  MultiplayerRoundState,
  MultiplayerSpectator,
  MultiplayerQuestionTime,
  PublicMatchQuestionCount,
} from "@/types/multiplayer";
