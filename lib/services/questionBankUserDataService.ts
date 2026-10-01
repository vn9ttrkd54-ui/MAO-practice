import { createClient } from "@/lib/supabase/client";
import { getMemoryBookmarkIds } from "@/lib/storage/bookmarks/memoryBookmarkStorage";
import { getMemoryProgressSnapshot } from "@/lib/storage/progress/memoryProgressStorage";
import type { QuestionStatus } from "@/types/progress";
import { withRequestTimeout } from "@/lib/requestTimeout";

interface ProgressRow {
  question_id: number;
  last_result: "correct" | "incorrect" | "give-up" | null;
}

interface BookmarkRow {
  question_id: number;
}

export interface QuestionBankUserData {
  userId: string | null;
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
  questionIds: number[],
  signal?: AbortSignal,
): Promise<QuestionBankUserData> {
  return withRequestTimeout(requestSignal => loadQuestionBankUserData(questionIds, requestSignal), {
    signal, message: "Loading saved progress took too long. Please retry.",
  });
}

async function loadQuestionBankUserData(questionIds: number[], requestSignal: AbortSignal): Promise<QuestionBankUserData> {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new QuestionBankAccountChangedError("Unable to verify your account. Refresh saved progress.");
  }
  requestSignal.throwIfAborted();
  const userId = session?.user.id ?? null;
  const checkOwner = async () => {
    const latest = await supabase.auth.getSession();
    requestSignal.throwIfAborted();
    if (latest.error) throw new QuestionBankAccountChangedError("Unable to verify your account. Refresh saved progress.");
    if ((latest.data.session?.user.id ?? null) !== userId) {
      throw new QuestionBankAccountChangedError();
    }
  };

  const statuses: Record<number, QuestionStatus> = {};

  for (const questionId of questionIds) {
    statuses[questionId] = "new";
  }

  if (!userId) {
    const progressSnapshot = getMemoryProgressSnapshot();

    for (const [questionId, progress] of progressSnapshot) {
      if (questionId in statuses) {
        statuses[questionId] = resultToStatus(progress.lastResult);
      }
    }

    await checkOwner();
    return {
      userId,
      statuses,
      bookmarkedQuestionIds: getMemoryBookmarkIds().filter(
        (questionId) => questionId in statuses
      ),
    };
  }

  const ids = questionIds.filter(id => Number.isSafeInteger(id) && id > 0);
  // Scope reads by the indexed user/question range, without a huge IN-list URL.
  // Explicit pages prevent Supabase's response cap from silently hiding progress.
  const min = ids.reduce((value, id) => Math.min(value, id), Infinity);
  const max = ids.reduce((value, id) => Math.max(value, id), -Infinity);
  const reads = new AbortController();
  const cancelReads = () => reads.abort(requestSignal.reason);
  requestSignal.throwIfAborted();
  requestSignal.addEventListener("abort", cancelReads, { once: true });
  async function readPages(table: "question_progress" | "bookmarks") {
    const rows: Array<ProgressRow | BookmarkRow> = [];
    if (!ids.length) return rows;
    for (let offset = 0; ; offset += 500) {
      reads.signal.throwIfAborted();
      const response = await supabase.from(table)
        .select(table === "question_progress" ? "question_id, last_result" : "question_id")
        .eq("user_id", userId).gte("question_id", min).lte("question_id", max)
        .order("question_id", { ascending: true }).range(offset, offset + 499).abortSignal(reads.signal);
      if (response.error) throw new Error("Unable to load your saved progress. Please retry.");
      const page = (response.data ?? []) as unknown as Array<ProgressRow | BookmarkRow>;
      rows.push(...page);
      if (page.length < 500) return rows;
    }
  }
  let progressRows: Array<ProgressRow | BookmarkRow>, bookmarkRows: Array<ProgressRow | BookmarkRow>;
  try {
    [progressRows, bookmarkRows] = await Promise.all([readPages("question_progress"), readPages("bookmarks")]);
  } finally {
    // If either read fails, cancel its sibling before a later retry starts.
    reads.abort();
    requestSignal.removeEventListener("abort", cancelReads);
  }
  await checkOwner();

  for (const row of progressRows as ProgressRow[]) {
    if (row.question_id in statuses) {
      statuses[row.question_id] = resultToStatus(row.last_result);
    }
  }

  return {
    userId,
    statuses,
    bookmarkedQuestionIds: bookmarkRows
      .map((row) => row.question_id)
      .filter((questionId) => questionId in statuses),
  };
}

export class QuestionBankAccountChangedError extends Error {
  constructor(message = "Your account changed. Refresh your saved progress.") { super(message); }
}
