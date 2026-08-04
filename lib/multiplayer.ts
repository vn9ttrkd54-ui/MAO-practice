perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
	LC_ALL = "C.UTF-8",
	LC_CTYPE = "C.UTF-8",
	LANG = "C.UTF-8"
    are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
export {
  getMultiplayerSummary,
  type MultiplayerSummary,
} from "@/lib/multiplayerSummary";

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
