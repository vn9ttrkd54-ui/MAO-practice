import type { TrainerHistorySummary, QuestionBankSummary } from "@/lib/dashboard";
import type { MultiplayerSummary } from "@/lib/multiplayerSummary";
import type { LevelProgress } from "@/types/level";
import type { AttemptResult } from "@/types/progress";
import type { Division } from "@/types/question";
import type { TrainerSessionStats } from "@/types/trainer";

export type DashboardActivity =
  | { id: string; type: "question"; occurredAt: number; questionId: number; questionNumber: number; result: AttemptResult }
  | { id: string; type: "bookmark"; occurredAt: number; questionId: number; questionNumber: number }
  | { id: string; type: "trainer-session"; occurredAt: number; division: Division; questionsAnswered: number; accuracy: number };

export interface DashboardSession {
  id: string;
  division: Division;
  endedAt: number;
  startingLevel: LevelProgress;
  endingLevel: LevelProgress;
  stats: TrainerSessionStats;
}

export interface DashboardData {
  version: 1;
  userId: string;
  username: string;
  isAdmin: boolean;
  multiplayer: MultiplayerSummary;
  trainer: TrainerHistorySummary;
  questionBank: QuestionBankSummary;
  challenge: { currentStreak: number; longestStreak: number };
  level: LevelProgress;
  recentTrainerSessions: DashboardSession[];
  recentActivity: DashboardActivity[];
}
