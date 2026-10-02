import { createClient } from "@/lib/supabase/client";
import { memoryProgressStorage } from "@/lib/storage/progress/memoryProgressStorage";
import { memoryLevelStorage } from "@/lib/storage/levels/memoryLevelStorage";
import type { ProgressStorage } from "@/lib/storage/progress/progressStorage";
import { createSupabaseProgressStorage } from "@/lib/storage/progress/supabaseProgressStorage";
import type { QuestionProgress } from "@/types/progress";
import type { PracticeAttempt, SavedPracticeResult } from "@/lib/services/practiceAttemptService";
import { appendPracticeTime } from "@/lib/practiceTiming";
import type { Question } from "@/types/question";

async function getProgressStorage(): Promise<ProgressStorage> {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new Error(`Unable to read authentication session: ${error.message}`);
  return session?.user ? createSupabaseProgressStorage(supabase, session.user.id) : memoryProgressStorage;
}

export async function getQuestionProgress(questionId: number): Promise<QuestionProgress> {
  return (await getProgressStorage()).getQuestionProgress(questionId);
}

async function saveResult(questionId: number, answer: string | null, time: number, trainer: boolean, attempt: PracticeAttempt, displayedQuestion?: Pick<Question, "id" | "answer">): Promise<SavedPracticeResult> {
  if (!attempt || attempt.questionId !== questionId || attempt.trainer !== trainer) {
    throw new Error("Please reload to start this practice attempt.");
  }
  return attempt.submit(answer, time, async () => {
    // Guest results stay local; never choose a signed-in writer during a save.
    // Trainer already has the public question: do not download every division
    // to check a guest answer. Signed-in results still use the verified API.
    const question = displayedQuestion ?? (await import("@/data/questions")).questions.find((item) => item.id === questionId);
    if (!question || question.id !== questionId) throw new Error("Question not found.");
    const isCorrect = answer === question.answer;
    const current = await memoryProgressStorage.getQuestionProgress(questionId);
    const progress = await memoryProgressStorage.saveQuestionProgress(questionId, {
      attempts: current.attempts + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
      ...(isCorrect ? appendPracticeTime(current, time) : { times: current.times, timing: current.timing }),
      lastResult: answer === null ? "give-up" : isCorrect ? "correct" : "incorrect",
      lastCorrectAt: isCorrect ? Date.now() : current.lastCorrectAt,
    });
    const levelChange = trainer ? await memoryLevelStorage.applyTrainerResult(isCorrect) : null;
    return { progress, levelChange, isCorrect, tutorRevealToken: null };
  });
}

export function saveQuestionAttempt(questionId: number, selectedAnswer: string, timeInSeconds: number, attempt: PracticeAttempt, displayedQuestion?: Pick<Question, "id" | "answer">) {
  return saveResult(questionId, selectedAnswer, timeInSeconds, false, attempt, displayedQuestion);
}

export function saveQuestionGiveUp(questionId: number, attempt: PracticeAttempt, displayedQuestion?: Pick<Question, "id" | "answer">) {
  return saveResult(questionId, null, 0, false, attempt, displayedQuestion);
}

export async function saveVerifiedTrainerResult(questionId: number, selectedAnswer: string | null, timeInSeconds: number, attempt: PracticeAttempt, displayedQuestion?: Pick<Question, "id" | "answer">) {
  const result = await saveResult(questionId, selectedAnswer, timeInSeconds, true, attempt, displayedQuestion);
  if (!result.levelChange) throw new Error("Unable to confirm Trainer progress. Please retry.");
  return { ...result, levelChange: result.levelChange };
}
