import type { AnswerChoice, Division, QuestionIllustration, QuestionSource } from "@/types/question";

export type MultiplayerScoringVersion = 1 | 2 | 3;

export type MultiplayerRoomVisibility = "public" | "private";
export type MultiplayerRoomMode = "ranked" | "unranked";
export type MultiplayerRoomStatus =
  | "waiting"
  | "countdown"
  | "in-progress"
  | "completed"
  | "cancelled";
export type MultiplayerRankTier =
  | "Novice"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Master"
  | "Grandmaster"
  | "Legend";
export type MultiplayerQuestionTime = 30 | 60 | 90 | 120 | 150 | 180;
export type MultiplayerDifficultyBand = "1-3" | "2-4" | "3-5";
export type PublicMatchQuestionCount = 5 | 15 | 30;

export interface MultiplayerRoomSettings {
  division: Division;
  questionCount: number;
  secondsPerQuestion: MultiplayerQuestionTime;
  mode: MultiplayerRoomMode;
  // Null preserves the unrestricted selection of rooms created before Stage 1.
  difficultyBand: MultiplayerDifficultyBand | null;
}

export interface MultiplayerPlayerIdentity {
  playerId: string;
  userId: string | null;
  displayName: string;
  isGuest: boolean;
  rankTier: MultiplayerRankTier | null;
  rp: number | null;
  globalRank: number | null;
}

export interface MultiplayerRoundFeedback {
  questionNumber: number;
  outcome: "correct" | "incorrect" | "give-up" | "blank";
  pointsEarned: number;
  answerTimeMs: number | null;
}

export interface MultiplayerPlayer extends MultiplayerPlayerIdentity {
  roundResult?: MultiplayerRoundFeedback | null;
  isHost: boolean;
  connected: boolean;
  score: number;
  placement: number | null;
  hasSubmittedCurrentQuestion: boolean;
}

export interface MultiplayerSpectator extends MultiplayerPlayerIdentity {
  joinedAt: number;
}

export interface MultiplayerRoom {
  scoringVersion?: MultiplayerScoringVersion;
  id: string;
  code: string | null;
  visibility: MultiplayerRoomVisibility;
  status: MultiplayerRoomStatus;
  settings: MultiplayerRoomSettings;
  playerCount: number;
  spectatorCount: number;
  capacity: number;
  hostPlayerId: string | null;
  countdownEndsAt: number | null;
  createdAt: number;
  startedAt: number | null;
  stateVersion: number;
  settingsVersion: number;
  currentQuestionNumber: number;
}

export interface MultiplayerActiveRoom extends MultiplayerRoom {
  isHost: boolean;
}

export interface MultiplayerPublicRoomPlayer {
  playerId: string;
  displayName: string;
  rankTier: MultiplayerRankTier | null;
}

export interface MultiplayerPublicRoom extends MultiplayerRoom {
  players: MultiplayerPublicRoomPlayer[];
}

export interface MultiplayerQuestion {
  source?: QuestionSource;
  illustration?: QuestionIllustration;
  questionId: number;
  number: number;
  division: Division;
  topic: string;
  difficulty: number;
  question: string;
  choices: string[];
}

export interface MultiplayerRoundState {
  roundClosed?: boolean;
  scoringVersion?: MultiplayerScoringVersion;
  preparing?: boolean;
  stateVersion: number;
  roomId: string;
  currentPlayerId: string;
  questionNumber: number;
  totalQuestions: number;
  question: MultiplayerQuestion;
  questionDurationSeconds: number;
  questionStartedAt: number;
  questionEndsAt: number;
  intermissionEndsAt: number | null;
  players: MultiplayerPlayer[];
  spectators: MultiplayerSpectator[];
  upcomingQuestion: {
    preparing?: boolean;
    questionNumber: number;
    question: MultiplayerQuestion;
    questionStartedAt: number;
    questionEndsAt: number;
  } | null;
}

export interface MultiplayerSpectatorState {
  roundClosed?: boolean;
  stateVersion?: number;
  roomId: string;
  questionNumber: number;
  totalQuestions: number;
  question: MultiplayerQuestion;
  questionDurationSeconds: number;
  questionStartedAt: number;
  questionEndsAt: number;
  intermissionEndsAt: number | null;
  players: MultiplayerPlayer[];
  spectators: MultiplayerSpectator[];
}

export interface MultiplayerDeliveryReceipt {
  questionNumber: number;
  deliveredAt: number;
  personalEndsAt: number;
  hardEndsAt: number;
}

export interface MultiplayerAnswerSubmission {
  roomId: string;
  questionId: number;
  // Explicit null is an irreversible Give up; omission is never accepted.
  selectedAnswer: AnswerChoice | null;
}

export interface MultiplayerRoundResult {
  source?: QuestionSource;
  illustration?: QuestionIllustration;
  questionId: number;
  questionNumber: number;
  question: string;
  choices: string[];
  selectedAnswer: AnswerChoice | null;
  correctAnswer: AnswerChoice;
  correct: boolean;
  answerTimeMs: number | null;
  pointsEarned: number;
  solution: string;
}

export interface MultiplayerRatingChange {
  previousRp: number;
  change: number;
  newRp: number;
  previousTier: MultiplayerRankTier;
  newTier: MultiplayerRankTier;
  opponentAdjustment: number;
  performanceIndex: number;
  completionFactor: number;
}

export interface MultiplayerMatchResult {
  roomId: string;
  viewerMode: "player" | "spectator";
  placement: number | null;
  score: number | null;
  ranked: boolean;
  ratingChange: MultiplayerRatingChange | null;
  rounds: MultiplayerRoundResult[];
  finalLeaderboard: MultiplayerPlayer[];
}

export interface MultiplayerMatchHistoryEntry {
  roomId: string;
  division: Division;
  questionCount: number;
  placement: number;
  score: number;
  ranked: boolean;
  rpChange: number | null;
  completedAt: number;
}

export interface MultiplayerProfile {
  userId: string;
  username: string;
  rp: number;
  rankTier: MultiplayerRankTier;
  globalRank: number | null;
  rankedMatchesPlayed: number;
  rankedWins: number;
  provisionalMatchesPlayed: number;
}

export interface MultiplayerRatingLeaderboardEntry {
  userId: string;
  username: string;
  rp: number;
  rankTier: MultiplayerRankTier;
  globalRank: number;
  rankedWins: number;
  winRate: number;
}

export interface CreatePrivateRoomInput {
  settings: MultiplayerRoomSettings;
}

export interface JoinPrivateRoomInput {
  code: string;
  guestNickname?: string;
}

export interface MultiplayerRoomAccess {
  room: MultiplayerRoom;
  currentPlayer: MultiplayerPlayer;
}

export interface MultiplayerLobbyPlayer extends MultiplayerPlayer {
  lobbyReady: boolean;
}

export interface MultiplayerLobbyState extends MultiplayerRoomAccess {
  currentPlayer: MultiplayerLobbyPlayer;
  players: MultiplayerLobbyPlayer[];
}
