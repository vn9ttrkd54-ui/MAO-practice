import { questions } from "@/data/questions";
import {
  calculateQuestionBankSummary,
  calculateTrainerHistorySummary,
} from "@/lib/dashboard";
import { getLevelProgress } from "@/lib/services/levelService";
import { getTrainerHistory } from "@/lib/services/trainerHistoryService";
import { getMultiplayerSummary } from "@/lib/multiplayer";
import { createClient } from "@/lib/supabase/client";

import type { AttemptResult } from "@/types/progress";

export interface DashboardData {
  multiplayer: ReturnType<typeof getMultiplayerSummary>;
  trainer: ReturnType<typeof calculateTrainerHistorySummary>;
  questionBank: ReturnType<typeof calculateQuestionBankSummary>;
  level: Awaited<ReturnType<typeof getLevelProgress>>;
  recentTrainerSessions: Awaited<
    ReturnType<typeof getTrainerHistory>
  >;
}

interface ProgressRow {
  question_id: number;
  last_result: AttemptResult | null;
}

interface BookmarkRow {
  question_id: number;
}

export async function getDashboardData():
  Promise<DashboardData> {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session?.user) {
    throw new Error("A signed-in user is required.");
  }

  const userId = session.user.id;

  const [
    level,
    trainerHistory,
    progressResponse,
    bookmarksResponse,
  ] = await Promise.all([
    getLevelProgress(),
    getTrainerHistory(),
    supabase
      .from("question_progress")
      .select("question_id, last_result")
      .eq("user_id", userId),
    supabase
      .from("bookmarks")
      .select("question_id")
      .eq("user_id", userId),
  ]);

  if (progressResponse.error) {
    throw new Error(progressResponse.error.message);
  }

  if (bookmarksResponse.error) {
    throw new Error(bookmarksResponse.error.message);
  }

  const progressByQuestionId = new Map<
    number,
    AttemptResult | null
  >(
    ((progressResponse.data ?? []) as ProgressRow[]).map(
      (row) => [row.question_id, row.last_result]
    )
  );

  const bookmarkedQuestionIds = (
    (bookmarksResponse.data ?? []) as BookmarkRow[]
  ).map((row) => row.question_id);

  return {
    multiplayer: getMultiplayerSummary(),
    trainer:
      calculateTrainerHistorySummary(trainerHistory),
    questionBank: calculateQuestionBankSummary(
      questions,
      progressByQuestionId,
      bookmarkedQuestionIds
    ),
    level,
    recentTrainerSessions: trainerHistory.slice(0, 5),
  };
}
