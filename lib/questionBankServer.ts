import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { QuestionStatus } from "@/types/progress";

export class QuestionBankDatabaseError extends Error {
  readonly code: string | undefined;
  constructor(error: { code?: string }) { super("Question Bank read failed"); this.code = error.code; }
}

/** Indexed, owner-scoped reads. Never select historical timing arrays or answers. */
export async function readQuestionBankListing(client: SupabaseClient, userId: string, min: number, max: number, signal: AbortSignal) {
  const reads = new AbortController();
  const cancel = () => reads.abort(signal.reason);
  signal.throwIfAborted();
  signal.addEventListener("abort", cancel, { once: true });
  type Row = { question_id: number; last_result?: string | null };
  async function pages(table: "question_progress" | "bookmarks") {
    const rows: Row[] = [];
    for (let offset = 0; ; offset += 500) {
      reads.signal.throwIfAborted();
      const { data, error } = await client.from(table)
        .select(table === "question_progress" ? "question_id, last_result" : "question_id")
        .eq("user_id", userId).gte("question_id", min).lte("question_id", max)
        .order("question_id", { ascending: true }).range(offset, offset + 499).abortSignal(reads.signal);
      if (error) throw new QuestionBankDatabaseError(error);
      if (!Array.isArray(data)) throw new QuestionBankDatabaseError({});
      rows.push(...data as unknown as Row[]);
      if (data.length < 500) return rows;
    }
  }
  try {
    const [progress, bookmarks] = await Promise.all([pages("question_progress"), pages("bookmarks")]);
    signal.throwIfAborted();
    const statuses: Record<number, QuestionStatus> = {};
    for (const row of progress) {
      statuses[row.question_id] = row.last_result === "correct" ? "solved"
        : row.last_result === "incorrect" || row.last_result === "give-up" ? "attempted" : "new";
    }
    return { userId, statuses, bookmarkedQuestionIds: bookmarks.map(row => row.question_id) };
  } finally {
    reads.abort();
    signal.removeEventListener("abort", cancel);
  }
}
