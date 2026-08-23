import type {
  AnswerChoice,
  Division,
} from "@/types/question";

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
