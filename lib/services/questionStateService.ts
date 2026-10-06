import { createClient } from "@/lib/supabase/client";
import { memoryProgressStorage } from "@/lib/storage/progress/memoryProgressStorage";
import { memoryBookmarkStorage, setMemoryQuestionBookmark } from "@/lib/storage/bookmarks/memoryBookmarkStorage";
import { parseQuestionState, type QuestionState } from "@/lib/questionState";
import { QuestionBankReadAccountError, questionBankOwner, readQuestionBankState } from "@/lib/services/questionBankReadTransport";
import { withRequestTimeout } from "@/lib/requestTimeout";

export class QuestionStateAccountError extends Error {
  constructor() { super("Your account could not be confirmed. Reload the question before continuing."); }
}
function checkId(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) throw new Error("Invalid question.");
}
async function readOwner(client: ReturnType<typeof createClient>, signal: AbortSignal) {
  try {
    const { data: { session }, error } = await client.auth.getSession();
    signal.throwIfAborted();
    if (error) throw new QuestionStateAccountError();
    return session?.user.id ?? null;
  } catch {
    signal.throwIfAborted();
    throw new QuestionStateAccountError();
  }
}
export async function getQuestionState(questionId: number, signal?: AbortSignal): Promise<QuestionState> {
  checkId(questionId);
  return withRequestTimeout(async requestSignal => {
    try {
      const userId = questionBankOwner();
      if (userId === null) {
        const state = { userId, questionId, progress: await memoryProgressStorage.getQuestionProgress(questionId),
          bookmarked: await memoryBookmarkStorage.isBookmarked(questionId) };
        requestSignal.throwIfAborted();
        if (questionBankOwner() !== userId) throw new QuestionStateAccountError();
        return state;
      }
      const data = await readQuestionBankState(new URLSearchParams({ questionId: String(questionId) }), userId, requestSignal);
      return parseQuestionState(data, questionId, userId);
    } catch (error) {
      if (error instanceof QuestionBankReadAccountError) throw new QuestionStateAccountError();
      throw error;
    }
  }, { signal, message: "Loading question statistics took too long. Please retry. Reference: QB-DETAIL-TIMEOUT." });
}

/** Set the user's chosen state, never toggle based on a potentially stale read. */
export async function setQuestionBookmark(questionId: number, desired: boolean, expectedUserId: string | null, signal?: AbortSignal) {
  checkId(questionId);
  if (typeof desired !== "boolean") throw new Error("Invalid bookmark state.");
  return withRequestTimeout(async requestSignal => {
    const client = createClient();
    if (await readOwner(client, requestSignal) !== expectedUserId) throw new QuestionStateAccountError();
    if (expectedUserId === null) setMemoryQuestionBookmark(questionId, desired);
    else {
      const query = desired
        ? client.from("bookmarks").upsert({ user_id: expectedUserId, question_id: questionId }, { onConflict: "user_id,question_id", ignoreDuplicates: true })
        : client.from("bookmarks").delete().eq("user_id", expectedUserId).eq("question_id", questionId);
      const { error } = await query.abortSignal(requestSignal).then(response => response, () => {
        requestSignal.throwIfAborted();
        throw new Error("Unable to confirm your bookmark. Retry the same bookmark change.");
      });
      requestSignal.throwIfAborted();
      if (error) throw new Error("Unable to confirm your bookmark. Retry the same bookmark change.");
    }
    if (await readOwner(client, requestSignal) !== expectedUserId) throw new QuestionStateAccountError();
    return desired;
  }, { signal, message: "We could not confirm your bookmark in time. Retry the same bookmark change." });
}
