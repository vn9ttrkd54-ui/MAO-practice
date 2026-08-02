import { createClient } from "@/lib/supabase/client";
import { memoryProgressStorage } from "@/lib/storage/progress/memoryProgressStorage";
import type { ProgressStorage } from "@/lib/storage/progress/progressStorage";
import { createSupabaseProgressStorage } from "@/lib/storage/progress/supabaseProgressStorage";
import type { QuestionProgress } from "@/types/progress";

async function getProgressStorage(): Promise<ProgressStorage> {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Unable to read authentication session: ${error.message}`);
  }

  if (!session?.user) {
    return memoryProgressStorage;
  }

  return createSupabaseProgressStorage(
    supabase,
    session.user.id
  );
}

export async function getQuestionProgress(
  questionId: number
): Promise<QuestionProgress> {
  const storage = await getProgressStorage();
  return storage.getQuestionProgress(questionId);
}

export async function saveQuestionAttempt(
  questionId: number,
  isCorrect: boolean,
  timeInSeconds: number
): Promise<QuestionProgress> {
  const storage = await getProgressStorage();
  const current = await storage.getQuestionProgress(
    questionId
  );

  const updated: QuestionProgress = {
    attempts: current.attempts + 1,
    correct:
      current.correct + (isCorrect ? 1 : 0),
    times: isCorrect
      ? [...current.times, timeInSeconds]
      : current.times,
    lastResult: isCorrect
      ? "correct"
      : "incorrect",
    lastCorrectAt: isCorrect
      ? Date.now()
      : current.lastCorrectAt,
  };

  return storage.saveQuestionProgress(
    questionId,
    updated
  );
}

export async function saveQuestionGiveUp(
  questionId: number
): Promise<QuestionProgress> {
  const storage = await getProgressStorage();
  const current = await storage.getQuestionProgress(
    questionId
  );

  const updated: QuestionProgress = {
    attempts: current.attempts + 1,
    correct: current.correct,
    times: current.times,
    lastResult: "give-up",
    lastCorrectAt: current.lastCorrectAt,
  };

  return storage.saveQuestionProgress(
    questionId,
    updated
  );
}
