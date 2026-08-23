import type { SupabaseClient } from "@supabase/supabase-js";

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

    async saveSession(session) {
      const { error: sessionError } = await supabase
        .from("trainer_sessions")
        .insert({
          id: session.id,
          user_id: userId,
          division: session.division,
          started_at: new Date(
            session.startedAt
          ).toISOString(),
          ended_at: new Date(
            session.endedAt
          ).toISOString(),
          starting_level:
            session.startingLevel.level,
          starting_progress:
            session.startingLevel.progress,
          ending_level: session.endingLevel.level,
          ending_progress:
            session.endingLevel.progress,
        });

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (session.results.length > 0) {
        const { error: resultsError } = await supabase
          .from("trainer_results")
          .insert(
            session.results.map((result) => ({
              session_id: session.id,
              user_id: userId,
              question_id: result.questionId,
              question_number:
                result.questionNumber,
              selected_answer:
                result.selectedAnswer,
              correct_answer:
                result.correctAnswer,
              result: result.result,
            }))
          );

        if (resultsError) {
          await supabase
            .from("trainer_sessions")
            .delete()
            .eq("id", session.id)
            .eq("user_id", userId);

          throw new Error(resultsError.message);
        }
      }

      return this.getHistory();
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
