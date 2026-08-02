import type { QuestionProgress } from "@/types/progress";

export interface ProgressStorage {
  getQuestionProgress(questionId: number): Promise<QuestionProgress>;
  saveQuestionProgress(
    questionId: number,
    progress: QuestionProgress
  ): Promise<QuestionProgress>;
}

export function createEmptyProgress(): QuestionProgress {
  return {
    attempts: 0,
    correct: 0,
    times: [],
    lastResult: null,
    lastCorrectAt: null,
  };
}
