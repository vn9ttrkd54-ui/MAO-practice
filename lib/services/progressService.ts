import { createClient } from "@/lib/supabase/client";
import { memoryProgressStorage } from "@/lib/storage/progress/memoryProgressStorage";
import type { ProgressStorage } from "@/lib/storage/progress/progressStorage";
import { createSupabaseProgressStorage } from "@/lib/storage/progress/supabaseProgressStorage";
import type { QuestionProgress } from "@/types/progress";
import { applyTrainerResult } from "@/lib/services/levelService";

type QuestionSaveResult = {
  progress: QuestionProgress;
  tutorRevealToken: string | null;
};

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
): Promise<QuestionSaveResult> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const question = (await import("@/data/questions")).questions.find(
      (item) => item.id === questionId
    );
    if (!question) throw new Error("Question not found.");
    const response = await fetch("/api/practice/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        selectedAnswer: isCorrect
          ? question.answer
          : ({ A: "B", B: "A", C: "A", D: "A", E: "A" } as const)[question.answer],
        elapsedSeconds: timeInSeconds,
        trainer: false,
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Unable to save result.");
    return {
      progress: payload.progress as QuestionProgress,
      tutorRevealToken: typeof payload.tutorRevealToken === "string" ? payload.tutorRevealToken : null,
    };
  }

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

  const progress = await storage.saveQuestionProgress(
    questionId,
    updated
  );
  return { progress, tutorRevealToken: null };
}

export async function saveVerifiedTrainerResult(
  questionId: number,
  selectedAnswer: string | null,
  timeInSeconds: number
) {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Unable to read authentication session: ${error.message}`);
  }

  if (!session?.user) {
    const question = (await import("@/data/questions")).questions.find(
      (item) => item.id === questionId
    );

    if (!question) {
      throw new Error("Question not found.");
    }

    const isCorrect = selectedAnswer === question.answer;
    const [savedResult, levelChange] = await Promise.all([
      selectedAnswer === null
        ? saveQuestionGiveUp(questionId)
        : saveQuestionAttempt(questionId, isCorrect, timeInSeconds),
      applyTrainerResult(isCorrect),
    ]);

    return { progress: savedResult.progress, levelChange };
  }

  const response = await fetch("/api/practice/result", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId,
      selectedAnswer,
      elapsedSeconds: timeInSeconds,
      trainer: true,
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "Unable to save result.");
  return payload;
}

export async function saveQuestionGiveUp(
  questionId: number
): Promise<QuestionSaveResult> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const response = await fetch("/api/practice/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        selectedAnswer: null,
        elapsedSeconds: 0,
        trainer: false,
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Unable to save result.");
    return {
      progress: payload.progress as QuestionProgress,
      tutorRevealToken: typeof payload.tutorRevealToken === "string" ? payload.tutorRevealToken : null,
    };
  }

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

  const progress = await storage.saveQuestionProgress(
    questionId,
    updated
  );
  return { progress, tutorRevealToken: null };
}
