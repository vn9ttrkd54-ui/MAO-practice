import { isPracticeTiming } from "@/lib/practiceTiming";
import type { QuestionProgress } from "@/types/progress";

export type QuestionState = { userId: string | null; questionId: number; progress: QuestionProgress; bookmarked: boolean };
const count = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
export function parseQuestionState(value: unknown, questionId: number, userId: string): QuestionState {
  const data = value as Partial<QuestionState> | null;
  const p = data?.progress;
  if (!data || data.userId !== userId || data.questionId !== questionId || typeof data.bookmarked !== "boolean"
    || !p || !count(p.attempts) || !count(p.correct) || p.correct > p.attempts
    || ![null,"correct","incorrect","give-up"].includes(p.lastResult)
    || (p.lastCorrectAt !== null && (typeof p.lastCorrectAt !== "number" || !Number.isFinite(p.lastCorrectAt) || p.lastCorrectAt < 0))
    || !isPracticeTiming(p.timing) || p.timing.count > p.correct) {
    throw new Error("Unable to confirm question statistics. Please retry. Reference: QB-DETAIL-INVALID.");
  }
  // The UI needs lifetime aggregates, not historical timing samples.
  return { userId, questionId, bookmarked: data.bookmarked, progress: {
    attempts: p.attempts, correct: p.correct, lastResult: p.lastResult, lastCorrectAt: p.lastCorrectAt,
    times: [], timing: { ...p.timing },
  } };
}
