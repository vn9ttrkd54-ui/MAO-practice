import type { SupabaseClient } from "@supabase/supabase-js";
import { parseTrainerSessionReceipt, trainerSessionArguments } from "@/lib/trainerSessionSave";

import type { TrainerHistoryStorage } from "@/lib/storage/trainerHistory/trainerHistoryStorage";
import type {
  TrainerQuestionResult,
  TrainerSessionRecord,
} from "@/types/trainer";

interface TrainerResultRow {
  question_id: number;
  question_number: number;
  selected_answer: string | null;
  correct_answer: string;
  result: TrainerQuestionResult["result"];
}

interface TrainerSessionRow {
  id: string;
  division: TrainerSessionRecord["division"];
  started_at: string;
  ended_at: string;
  starting_level: number;
  starting_progress: number;
  ending_level: number;
  ending_progress: number;
  trainer_results: TrainerResultRow[] | null;
}

function rowToSession(
  row: TrainerSessionRow
): TrainerSessionRecord {
  return {
    id: row.id,
    division: row.division,
    startedAt: new Date(row.started_at).getTime(),
    endedAt: new Date(row.ended_at).getTime(),
    startingLevel: {
      level: row.starting_level,
      progress: row.starting_progress,
    },
    endingLevel: {
      level: row.ending_level,
      progress: row.ending_progress,
    },
    results: (row.trainer_results ?? []).map(
      (result) => ({
        questionId: result.question_id,
        questionNumber: result.question_number,
        selectedAnswer:
          result.selected_answer as TrainerQuestionResult["selectedAnswer"],
        correctAnswer:
          result.correct_answer as TrainerQuestionResult["correctAnswer"],
        result: result.result,
        elapsedSeconds: 0,
      })
    ),
  };
}

export function createSupabaseTrainerHistoryStorage(
  supabase: SupabaseClient,
  userId: string
): TrainerHistoryStorage {
  return {
    async getHistory() {
      const { data, error } = await supabase
        .from("trainer_sessions")
        .select(
          `
            id,
            division,
            started_at,
            ended_at,
            starting_level,
            starting_progress,
            ending_level,
            ending_progress,
            trainer_results (
              question_id,
              question_number,
              selected_answer,
              correct_answer,
              result
            )
          `
        )
        .eq("user_id", userId)
        .order("ended_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(
        (row) => rowToSession(row as TrainerSessionRow)
      );
    },

    async saveSession(session, signal) {
      signal?.throwIfAborted();
      const args = trainerSessionArguments(session, userId);
      const query = supabase.rpc("save_trainer_session_v1", args);
      const { data, error } = await (signal ? query.abortSignal(signal) : query);
      signal?.throwIfAborted();
      if (error) throw new Error("Unable to confirm your session save. Keep this page open and retry session save.");
      if (data?.status === "busy") throw new Error("This session is still saving. Wait a moment, then retry session save.");
      if (data?.status === "conflict") throw new Error("This session ID already has different saved data. No existing history was overwritten.");
      return parseTrainerSessionReceipt(data, session, userId);
    },

    async clearHistory() {
      const { error } = await supabase
        .from("trainer_sessions")
        .delete()
        .eq("user_id", userId);

      if (error) {
        throw new Error(error.message);
      }
    },
  };
}
