import type { SupabaseClient } from "@supabase/supabase-js";

import type { ProgressStorage } from "@/lib/storage/progress/progressStorage";
import { createEmptyProgress } from "@/lib/storage/progress/progressStorage";
import type {
  AttemptResult,
  QuestionProgress,
} from "@/types/progress";

interface QuestionProgressRow {
  attempts: number;
  correct: number;
  correct_times_ms: number[] | null;
  last_result: AttemptResult | null;
  last_correct_at: string | null;
}

function rowToProgress(
  row: QuestionProgressRow
): QuestionProgress {
  return {
    attempts: row.attempts,
    correct: row.correct,
    times: (row.correct_times_ms ?? []).map(
      (timeInMilliseconds) =>
        Math.floor(timeInMilliseconds / 1000)
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
          "attempts, correct, correct_times_ms, last_result, last_correct_at"
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

    async saveQuestionProgress(questionId, progress) {
      const { data, error } = await supabase
        .from("question_progress")
        .upsert(
          {
            user_id: userId,
            question_id: questionId,
            attempts: progress.attempts,
            correct: progress.correct,
            correct_times_ms: progress.times.map(
              (timeInSeconds) => timeInSeconds * 1000
            ),
            last_result: progress.lastResult,
            last_attempted_at: new Date().toISOString(),
            last_correct_at: progress.lastCorrectAt
              ? new Date(progress.lastCorrectAt).toISOString()
              : null,
          },
          {
            onConflict: "user_id,question_id",
          }
        )
        .select(
          "attempts, correct, correct_times_ms, last_result, last_correct_at"
        )
        .single<QuestionProgressRow>();

      if (error) {
        throw new Error(error.message);
      }

      return rowToProgress(data);
    },
  };
}
