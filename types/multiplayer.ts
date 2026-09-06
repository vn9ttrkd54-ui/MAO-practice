import type { AnswerChoice, Division } from "@/types/question";

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
export type MultiplayerQuestionTime = 30 | 60 | 90 | 120;
export type PublicMatchQuestionCount = 5 | 15 | 30;

export interface MultiplayerRoomSettings {
  division: Division;
  questionCount: number;
  secondsPerQuestion: MultiplayerQuestionTime;
  mode: MultiplayerRoomMode;
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

export interface MultiplayerPlayer extends MultiplayerPlayerIdentity {
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
  currentQuestionNumber: number;
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
  questionId: number;
  number: number;
  division: Division;
  topic: string;
  difficulty: number;
  question: string;
  choices: string[];
}

export interface MultiplayerRoundState {
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
  selectedAnswer: AnswerChoice;
}

export interface MultiplayerRoundResult {
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
  guestNickname?: string;
}

export interface JoinPrivateRoomInput {
  code: string;
  guestNickname?: string;
}

export interface MultiplayerRoomAccess {
  room: MultiplayerRoom;
  currentPlayer: MultiplayerPlayer;
}

export interface MultiplayerLobbyState extends MultiplayerRoomAccess {
  players: MultiplayerPlayer[];
}
