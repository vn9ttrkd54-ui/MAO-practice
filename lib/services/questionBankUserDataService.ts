import { getMemoryBookmarkIds } from "@/lib/storage/bookmarks/memoryBookmarkStorage";
import { getMemoryProgressSnapshot } from "@/lib/storage/progress/memoryProgressStorage";
import type { QuestionStatus } from "@/types/progress";
import { withRequestTimeout } from "@/lib/requestTimeout";
import { QuestionBankReadAccountError, questionBankOwner, readQuestionBankState } from "@/lib/services/questionBankReadTransport";

export { QuestionBankReadAccountError as QuestionBankAccountChangedError } from "@/lib/services/questionBankReadTransport";

export interface QuestionBankUserData {
  userId: string | null;
  statuses: Record<number, QuestionStatus>;
  bookmarkedQuestionIds: number[];
}

export async function getQuestionBankUserData(questionIds: number[], signal?: AbortSignal): Promise<QuestionBankUserData> {
  return withRequestTimeout(async requestSignal => {
    const userId = questionBankOwner();
    const ids = questionIds.filter(id => Number.isSafeInteger(id) && id > 0 && id <= 2147483647);
    const statuses: Record<number, QuestionStatus> = {};
    for (const id of ids) statuses[id] = "new";
    if (userId === null) {
      for (const [id, progress] of getMemoryProgressSnapshot()) {
        if (id in statuses) statuses[id] = progress.lastResult === "correct" ? "solved"
          : progress.lastResult === "incorrect" || progress.lastResult === "give-up" ? "attempted" : "new";
      }
      return { userId, statuses, bookmarkedQuestionIds: getMemoryBookmarkIds().filter(id => id in statuses) };
    }
    if (!ids.length) return { userId, statuses, bookmarkedQuestionIds: [] };
    const min = Math.min(...ids), max = Math.max(...ids);
    const value = await readQuestionBankState(new URLSearchParams({ min: String(min), max: String(max) }), userId, requestSignal);
    const data = value as Partial<QuestionBankUserData> | null;
    if (data?.userId !== userId) throw new QuestionBankReadAccountError();
    if (!data.statuses || typeof data.statuses !== "object" || Array.isArray(data.statuses)
      || !Array.isArray(data.bookmarkedQuestionIds)
      || !data.bookmarkedQuestionIds.every(id => Number.isSafeInteger(id) && id >= min && id <= max)
      || !Object.entries(data.statuses).every(([id, status]) => /^\d+$/.test(id) && Number(id) >= min && Number(id) <= max
        && ["new", "attempted", "solved"].includes(status))) {
      throw new Error("Unable to load saved progress. Please retry. Reference: QB-PROGRESS-INVALID.");
    }
    for (const id of ids) if (data.statuses[id]) statuses[id] = data.statuses[id];
    return { userId, statuses, bookmarkedQuestionIds: data.bookmarkedQuestionIds.filter(id => id in statuses) };
  }, { signal, message: "Loading saved progress took too long. Please retry. Reference: QB-PROGRESS-TIMEOUT." });
}
