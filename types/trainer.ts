import type {
  AnswerChoice,
  Division,
  Question,
} from "@/types/question";
import type { QuestionProgress } from "@/types/progress";

export type TrainerQuestionItem = Pick<Question, "id" | "number" | "division" | "topic" | "difficulty">;
export type TrainerSelectionProgress = Pick<QuestionProgress, "attempts" | "correct" | "lastResult" | "lastCorrectAt">;

import type {
  LevelProgress,
} from "@/types/level";

export type TrainerResult =
  | "correct"
  | "incorrect"
  | "give-up";

export interface TrainerQuestionResult {
  questionId: number;
  questionNumber: number;
  selectedAnswer: AnswerChoice | null;
  correctAnswer: AnswerChoice;
  result: TrainerResult;
  elapsedSeconds: number;
}

export interface TrainerSessionStats {
  questionsAnswered: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  accuracy: number;
}

export interface TrainerSessionRecord {
  id: string;
  division: Division;
  startedAt: number;
  endedAt: number;
  startingLevel: LevelProgress;
  endingLevel: LevelProgress;
  results: TrainerQuestionResult[];
}

export interface TrainerHistoryPoint {
  id: string;
  endedAt: number;
  questionsAnswered: number;
  accuracy: number;
}

export interface TrainerSessionReceipt {
  status: "saved";
  sessionId: string;
  userId: string | null;
  recentSessions: TrainerHistoryPoint[];
}
