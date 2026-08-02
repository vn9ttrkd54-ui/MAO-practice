import { createClient } from "@/lib/supabase/client";
import { getMemoryBookmarkIds } from "@/lib/storage/bookmarks/memoryBookmarkStorage";
import { getMemoryProgressSnapshot } from "@/lib/storage/progress/memoryProgressStorage";
import type { QuestionStatus } from "@/types/progress";

interface ProgressRow {
  question_id: number;
  last_result: "correct" | "incorrect" | "give-up" | null;
}

interface BookmarkRow {
  question_id: number;
}

export interface QuestionBankUserData {
  statuses: Record<number, QuestionStatus>;
  bookmarkedQuestionIds: number[];
}

function resultToStatus(
  result: ProgressRow["last_result"]
): QuestionStatus {
  if (result === "correct") {
    return "solved";
  }

  if (result === "incorrect" || result === "give-up") {
    return "attempted";
  }

  return "new";
}

export async function getQuestionBankUserData(
  questionIds: number[]
): Promise<QuestionBankUserData> {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const statuses: Record<number, QuestionStatus> = {};

  for (const questionId of questionIds) {
    statuses[questionId] = "new";
  }

  if (!session?.user) {
    const progressSnapshot = getMemoryProgressSnapshot();

    for (const [questionId, progress] of progressSnapshot) {
      if (questionId in statuses) {
        statuses[questionId] = resultToStatus(progress.lastResult);
      }
    }

    return {
      statuses,
      bookmarkedQuestionIds: getMemoryBookmarkIds().filter(
        (questionId) => questionId in statuses
      ),
    };
  }

  const [progressResponse, bookmarkResponse] = await Promise.all([
    supabase
      .from("question_progress")
      .select("question_id, last_result")
      .eq("user_id", session.user.id),
    supabase
      .from("bookmarks")
      .select("question_id")
      .eq("user_id", session.user.id),
  ]);

  if (progressResponse.error) {
    throw new Error(progressResponse.error.message);
  }

  if (bookmarkResponse.error) {
    throw new Error(bookmarkResponse.error.message);
  }

  for (const row of (progressResponse.data ?? []) as ProgressRow[]) {
    if (row.question_id in statuses) {
      statuses[row.question_id] = resultToStatus(row.last_result);
    }
  }

  return {
    statuses,
    bookmarkedQuestionIds: ((bookmarkResponse.data ?? []) as BookmarkRow[])
      .map((row) => row.question_id)
      .filter((questionId) => questionId in statuses),
  };
}
