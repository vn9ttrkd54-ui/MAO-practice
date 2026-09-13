import type { PracticeTiming, QuestionProgress } from "@/types/progress";

export const PRACTICE_TIMING_LIMIT = 100;

export function isPracticeTiming(value: unknown): value is PracticeTiming {
  if (!value || typeof value !== "object") return false;
  const stats = value as Partial<PracticeTiming>;
  if (!Number.isSafeInteger(stats.count) || !Number.isSafeInteger(stats.totalSeconds)
    || stats.count! < 0 || stats.totalSeconds! < 0 || stats.totalSeconds! > stats.count! * 86_400) return false;
  return stats.count === 0
    ? stats.totalSeconds === 0 && stats.bestSeconds === null
    : Number.isSafeInteger(stats.bestSeconds) && stats.bestSeconds! >= 0
      && stats.bestSeconds! <= 86_400 && stats.totalSeconds! >= stats.count! * stats.bestSeconds!;
}

// Compatibility for old in-memory guest state. Never spread a potentially large
// array into Math.min; each stored second value contributes to the lifetime mean.
export function getPracticeTiming(progress: Pick<QuestionProgress, "times" | "timing">): PracticeTiming {
  if (progress.timing !== undefined) {
    if (!isPracticeTiming(progress.timing) || progress.timing.count < progress.times.length) throw new Error("Invalid practice timing statistics.");
    return { ...progress.timing };
  }
  let totalSeconds = 0;
  let bestSeconds: number | null = null;
  for (const seconds of progress.times) {
    totalSeconds += seconds;
    bestSeconds = bestSeconds === null ? seconds : Math.min(bestSeconds, seconds);
  }
  return { count: progress.times.length, totalSeconds, bestSeconds };
}

export function appendPracticeTime(progress: Pick<QuestionProgress, "times" | "timing">, seconds: number) {
  if (!Number.isFinite(seconds)) throw new Error("Invalid practice time.");
  const value = Math.max(0, Math.min(86_400, Math.floor(seconds)));
  const current = getPracticeTiming(progress);
  const timing: PracticeTiming = {
    count: current.count + 1,
    totalSeconds: current.totalSeconds + value,
    bestSeconds: current.bestSeconds === null ? value : Math.min(current.bestSeconds, value),
  };
  if (!isPracticeTiming(timing)) throw new Error("Invalid practice timing statistics.");
  return { times: [...progress.times.slice(-(PRACTICE_TIMING_LIMIT - 1)), value], timing };
}
