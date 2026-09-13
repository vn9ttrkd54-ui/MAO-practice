import type { SupabaseClient } from "@supabase/supabase-js";
import { isPracticeTiming, PRACTICE_TIMING_LIMIT } from "@/lib/practiceTiming";

import type { ProgressStorage } from "@/lib/storage/progress/progressStorage";
import { createEmptyProgress } from "@/lib/storage/progress/progressStorage";
import type {
  AttemptResult,
  QuestionProgress,
} from "@/types/progress";

interface QuestionProgressRow {
  attempts: number;
  correct: number;
  correct_times_ms: Array<number | null> | null;
  timing_count: number;
  timing_total_seconds: number;
  timing_best_seconds: number | null;
  last_result: AttemptResult | null;
  last_correct_at: string | null;
}

function rowToProgress(
  row: QuestionProgressRow
): QuestionProgress {
  const timing = { count: row.timing_count, totalSeconds: row.timing_total_seconds, bestSeconds: row.timing_best_seconds };
  if (!isPracticeTiming(timing) || (row.correct_times_ms?.length ?? 0) > PRACTICE_TIMING_LIMIT
    || timing.count < (row.correct_times_ms?.length ?? 0)) {
    throw new Error("Unable to read practice timing statistics.");
  }
  return {
    timing,
    attempts: row.attempts,
    correct: row.correct,
    times: (row.correct_times_ms ?? []).map(
      (timeInMilliseconds) =>
        Math.floor((timeInMilliseconds ?? 0) / 1000)
    ),
    lastResult: row.last_result,
    lastCorrectAt: row.last_correct_at
      ? new Date(row.last_correct_at).getTime()
      : null,
  };
}

export function createSupabaseProgressStorage(
  supabase: SupabaseClient,
  userId: string
): ProgressStorage {
  return {
    async getQuestionProgress(questionId) {
      const { data, error } = await supabase
        .from("question_progress")
        .select(
          "attempts, correct, correct_times_ms, timing_count, timing_total_seconds, timing_best_seconds, last_result, last_correct_at"
        )
        .eq("user_id", userId)
        .eq("question_id", questionId)
        .maybeSingle<QuestionProgressRow>();

      if (error) {
        throw new Error(error.message);
      }

      return data
        ? rowToProgress(data)
        : createEmptyProgress();
    },

    async saveQuestionProgress() {
      // Signed-in progress is written only by the verified attempt RPC.
      throw new Error("Use a verified practice attempt to save progress.");
    },
  };
}
