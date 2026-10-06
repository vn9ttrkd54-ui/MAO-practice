import { browserOwnerHint } from "@/lib/supabase/browserOwnerHint";
import { questionReadError } from "@/lib/questionReadError";

export class QuestionBankReadAccountError extends Error {
  constructor() { super("Your account changed or could not be confirmed. Reload before continuing."); }
}

export function questionBankOwner() {
  try { return browserOwnerHint(); }
  catch { throw new QuestionBankReadAccountError(); }
}

/** Only authenticated same-origin reads; never falls back to guest/empty data. */
export async function readQuestionBankState(query: URLSearchParams, owner: string, signal: AbortSignal): Promise<unknown> {
  const scope = query.has("questionId") ? "DETAIL" : "PROGRESS";
  query.set("owner", owner);
  let result: { response: Response; payload: unknown };
  try {
    const response = await fetch(`/api/practice/question-bank/state?${query}`, {
      signal, credentials: "same-origin", cache: "no-store",
    });
    if (response.status === 401 || response.status === 409) throw new QuestionBankReadAccountError();
    result = { response, payload: await response.json() };
  } catch (error) {
    signal.throwIfAborted();
    if (error instanceof QuestionBankReadAccountError) throw error;
    throw questionReadError(scope, null);
  }
  signal.throwIfAborted();
  if (questionBankOwner() !== owner) throw new QuestionBankReadAccountError();
  // Only known codes are reflected into a safe reference, never server text.
  if (!result.response.ok) throw questionReadError(scope, result.payload);
  return result.payload;
}
