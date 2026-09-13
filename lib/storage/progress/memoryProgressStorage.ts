import type { ProgressStorage } from "@/lib/storage/progress/progressStorage";
import { createEmptyProgress } from "@/lib/storage/progress/progressStorage";
import type { QuestionProgress } from "@/types/progress";
import { getPracticeTiming, PRACTICE_TIMING_LIMIT } from "@/lib/practiceTiming";

const progressByQuestion = new Map<number, QuestionProgress>();

function cloneProgress(progress: QuestionProgress): QuestionProgress {
  return {
    ...progress,
    timing: getPracticeTiming(progress),
    times: progress.times.slice(-PRACTICE_TIMING_LIMIT),
  };
}

export function getMemoryProgressSnapshot(): Map<number, QuestionProgress> {
  return new Map(
    Array.from(progressByQuestion.entries()).map(
      ([questionId, progress]) => [questionId, cloneProgress(progress)]
    )
  );
}

export const memoryProgressStorage: ProgressStorage = {
  async getQuestionProgress(questionId) {
    const progress = progressByQuestion.get(questionId);

    return progress
      ? cloneProgress(progress)
      : createEmptyProgress();
  },

  async saveQuestionProgress(questionId, progress) {
    const storedProgress = cloneProgress(progress);
    progressByQuestion.set(questionId, storedProgress);

    return cloneProgress(storedProgress);
  },
};
