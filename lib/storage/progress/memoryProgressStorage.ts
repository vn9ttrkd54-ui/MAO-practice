import type { ProgressStorage } from "@/lib/storage/progress/progressStorage";
import { createEmptyProgress } from "@/lib/storage/progress/progressStorage";
import type { QuestionProgress } from "@/types/progress";

const progressByQuestion = new Map<number, QuestionProgress>();

function cloneProgress(progress: QuestionProgress): QuestionProgress {
  return {
    ...progress,
    times: [...progress.times],
  };
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
