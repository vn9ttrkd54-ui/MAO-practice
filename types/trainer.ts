import type {
  AnswerChoice,
  Division,
  Question,
} from "@/types/question";

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
}

export interface TrainerSession {
  division: Division;
  currentQuestion: Question | null;
  completedQuestionIds: number[];
  results: TrainerQuestionResult[];
  startedAt: number;
  endedAt: number | null;
}

export interface TrainerSessionStats {
  questionsAnswered: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  accuracy: number;
}