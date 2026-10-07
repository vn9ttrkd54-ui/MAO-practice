import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { accountRestriction } from "@/lib/auth/accountAccess";
import { getUsernameValidationError } from "@/lib/auth/publicNames";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";

const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", Vary: "Cookie" } });
export async function GET() {
  const client = await createClient(AbortSignal.timeout(8000), { allowRestricted: true });
  const { data: { user }, error } = await client.auth.getUser();
  if (error) return reply({ error: "Unable to verify your account." }, 401);
  return reply({ restriction: accountRestriction(user) });
}
export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) return reply({ error: "Invalid request origin." }, 403);
  try {
    const body = await readJsonBody<{ username?: unknown }>(request, 2048);
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const validation = getUsernameValidationError(username);
    if (validation) return reply({ error: validation }, 400);
    const client = await createClient(undefined, { allowRestricted: true });
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return reply({ error: "Sign in again to continue." }, 401);
    if (accountRestriction(user) !== "rename") return reply({ error: "A username change is not available for this account." }, 403);
    const admin = createAdminClient();
    const limit = await admin.rpc("consume_login_attempt", { attempt_identifier: `required-rename:${user.id}`, max_attempts: 15, window_seconds: 300, block_seconds: 300 });
    if (limit.error) return reply({ error: "Please try again later." }, 503);
    if (limit.data !== true) return reply({ error: "Too many attempts. Try again in five minutes." }, 429);
    const result = await admin.rpc("set_account_username", { p_user_id: user.id, p_username: username });
    if (result.error) return reply({ error: result.error.code === "23505" ? "That username is taken or reserved."
      : result.error.code === "23514" ? "Choose a different, appropriate username."
      : "Unable to change your username. Please retry." }, result.error.code === "23505" ? 409 : 400);
    // Saving is committed even if token refresh fails. The user must not repeat
    // a completed rename; tell them to sign in with the NEW name instead.
    const refreshed = await client.auth.refreshSession();
    return reply({ success: true, username, signInAgain: Boolean(refreshed.error) });
  } catch (error) {
    return reply({ error: "Unable to save the name right now. Please retry." }, error instanceof RequestBodyError ? error.status : 503);
  }
}
