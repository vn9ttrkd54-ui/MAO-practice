import { createClient } from "@/lib/supabase/server";
import { withRequestTimeout } from "@/lib/requestTimeout";
import { observeApi } from "@/lib/serverPerformance";
import { QuestionBankDatabaseError, readQuestionBankListing } from "@/lib/questionBankServer";
import { parseQuestionState } from "@/lib/questionState";

const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function id(value: string | null) {
  if (!value || !/^[1-9]\d{0,9}$/.test(value)) return null;
  const result = Number(value);
  return result <= 2147483647 ? result : null;
}

export async function GET(request: Request) {
  return observeApi("question-bank.read", async measure => {
    const params = new URL(request.url).searchParams;
    const owner = params.get("owner"), questionId = id(params.get("questionId"));
    const min = id(params.get("min")), max = id(params.get("max"));
    if (!owner || !uuid.test(owner) || (params.has("questionId")
      ? !questionId || params.has("min") || params.has("max")
      : !min || !max || max < min || max - min > 5000)) {
      return Response.json({ error: "Invalid saved-state request." }, { status: 400, headers });
    }
    try {
      return await withRequestTimeout(async signal => {
        // Request-scoped auth, including its network fetch, has the same deadline
        // as the reads. This route authenticates itself, not in the root proxy.
        const client = await createClient(signal);
        const { data: { user }, error } = await measure("auth", () => client.auth.getUser());
        signal.throwIfAborted();
        // A provider/network outage is retryable, not evidence of sign-out.
        if (error && ![400, 401, 403].includes(error.status ?? 0)) throw new Error("Auth temporarily unavailable");
        if (error || !user) return Response.json({ error: "Sign in again." }, { status: 401, headers });
        if (user.id !== owner) return Response.json({ error: "Account changed." }, { status: 409, headers });
        if (user.app_metadata?.needs_username === true ||
          (user.app_metadata?.provider === "google" && user.app_metadata.needs_username !== false)) {
          return Response.json({ error: "Complete account setup first." }, { status: 403, headers });
        }
        const data = await measure("data", async () => {
          if (!questionId) return readQuestionBankListing(client, user.id, min!, max!, signal);
          const { data, error } = await client.rpc("get_question_state", { p_question_id: questionId }).abortSignal(signal);
          if (error) throw new QuestionBankDatabaseError(error);
          return parseQuestionState(data, questionId, user.id);
        });
        signal.throwIfAborted();
        return Response.json(data, { headers });
      }, { signal: request.signal, timeoutMs: 8000 });
    } catch (error) {
      const code = error instanceof QuestionBankDatabaseError &&
        ["42501", "42703", "42P01", "PGRST202", "PGRST301", "PGRST303"].includes(error.code ?? "") ? error.code : undefined;
      return Response.json({ error: "Unable to load saved state. Please retry.", code }, { status: 503, headers });
    }
  });
}
