import { createClient } from "@/lib/supabase/client";
import { withRequestTimeout } from "@/lib/requestTimeout";
import type { QuestionProgress } from "@/types/progress";
import type { LevelChangeResult } from "@/types/level";

export type SavedPracticeResult = {
  progress: QuestionProgress;
  levelChange: LevelChangeResult | null;
  tutorRevealToken: string | null;
  isCorrect: boolean;
};

// Create once per displayed question, not per save. Retain in a ref for retries.
export function createPracticeAttempt(questionId: number, trainer: boolean) {
  const requestId = crypto.randomUUID();
  let owner: string | null | undefined;
  let attemptId: string | null | undefined;
  let preparing: Promise<void> | undefined;
  let saving: Promise<SavedPracticeResult> | undefined;
  let saved: SavedPracticeResult | undefined;
  let terminalError: Error | undefined;
  let first: { selectedAnswer: string | null; elapsedSeconds: number } | undefined;

  async function checkOwner() {
    const { data: { session }, error } = await withRequestTimeout(
      () => createClient().auth.getSession(),
      { message: "Unable to check your account. Please try again." },
    );
    if (error) throw new Error("Unable to check your account. Please try again.");
    const current = session?.user?.id ?? null;
    if (owner === undefined) owner = current;
    if (owner !== current) throw new Error("Your account changed. Please reload to start a new attempt.");
  }

  async function prepare() {
    await checkOwner();
    if (terminalError) throw terminalError;
    if (attemptId !== undefined) return;
    if (!preparing) {
      preparing = (async () => {
        if (owner === null) { attemptId = null; return; }
        const { response, payload } = await withRequestTimeout(async (signal) => {
          const response = await fetch("/api/practice/attempt", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId, trainer, requestId }),
            signal,
          });
          return { response, payload: await response.json() };
        }, { message: "Starting this attempt took too long. Please try again." });
        if (!response.ok) {
          const error = new Error(payload.error ?? "Unable to start this attempt. Please try again.");
          if ([400, 409, 410].includes(response.status)) terminalError = error;
          throw error;
        }
        await checkOwner();
        if (typeof payload.attemptId !== "string") throw new Error("Unable to start this attempt. Please try again.");
        attemptId = payload.attemptId;
      })().finally(() => { preparing = undefined; });
    }
    await preparing;
  }

  async function submit(selectedAnswer: string | null, elapsedSeconds: number, saveGuest: () => Promise<SavedPracticeResult>): Promise<SavedPracticeResult> {
    await checkOwner();
    if (terminalError) throw terminalError;
    if (first && (first.selectedAnswer !== selectedAnswer || first.elapsedSeconds !== elapsedSeconds)) {
      throw new Error("Retry the original answer before starting another attempt.");
    }
    first ??= { selectedAnswer, elapsedSeconds };
    if (saved) return saved;
    if (!saving) {
      saving = (async () => {
        await prepare();
        await checkOwner();
        if (owner === null) return saveGuest();
        const { response, payload } = await withRequestTimeout(async (signal) => {
          const response = await fetch("/api/practice/result", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId, trainer, attemptId, ...first }),
            signal,
          });
          return { response, payload: await response.json() };
        }, { message: "We could not confirm your save in time. Retry save to check the same answer safely." });
        if (!response.ok) {
          const error = new Error(payload.error ?? "Unable to save this result. Please retry.");
          if ([400, 409, 410].includes(response.status)) terminalError = error;
          throw error;
        }
        await checkOwner();
        if (!payload.progress || typeof payload.isCorrect !== "boolean" || (trainer && !payload.levelChange)) {
          throw new Error("Unable to confirm this result. Please retry.");
        }
        return payload as SavedPracticeResult;
      })().then((result) => { saved = result; return result; }).finally(() => { saving = undefined; });
    }
    return saving;
  }

  return { questionId, trainer, prepare, submit };
}

export type PracticeAttempt = ReturnType<typeof createPracticeAttempt>;
