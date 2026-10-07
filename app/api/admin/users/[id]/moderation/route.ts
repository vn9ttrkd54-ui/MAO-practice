import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { createClient as createVerifier } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { moderationActor } from "@/lib/services/accountModerationService";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { MODERATION_ACTIONS, UUID_PATTERN, moderationConfirmation, type ModerationAction } from "@/lib/auth/moderation";
import { GOOGLE_MODERATION_COOKIE } from "@/lib/auth/googleFlow";

const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTrustedMutationRequest(request)) return reply({ error: "Invalid request origin." }, 403);
  try {
    const { id } = await params;
    const body = await readJsonBody<{ action?: unknown; reason?: unknown; confirmation?: unknown; currentPassword?: unknown; version?: unknown; requestId?: unknown }>(request, 8192);
    if (!UUID_PATTERN.test(id) || typeof body.action !== "string" || !MODERATION_ACTIONS.includes(body.action as ModerationAction)
      || typeof body.reason !== "string" || body.reason.trim().length < 5 || body.reason.trim().length > 500
      || !Number.isSafeInteger(body.version) || (body.version as number) < 0
      || typeof body.requestId !== "string" || !UUID_PATTERN.test(body.requestId)) return reply({ error: "Check the action, reason, and account version." }, 400);
    const action = body.action as ModerationAction;
    if (body.confirmation !== moderationConfirmation(action, id)) return reply({ error: "Type the full confirmation shown on this account." }, 400);
    const actor = await moderationActor();
    if (!actor) return reply({ error: "Administrator access required." }, 403);
    if (actor.user.id === id || (action === "delete" && actor.role !== "owner")) return reply({ error: "This action is not permitted." }, 403);
    const { data: target, error: targetError } = await actor.admin.from("profiles").select("role").eq("id", id).maybeSingle();
    if (targetError) return reply({ error: "Unable to verify the account. Try again later." }, 503);
    if (!target || target.role !== "user") return reply({ error: "Only ordinary user accounts can be moderated." }, 403);
    // Actor-scoped, not client-IP scoped: rotating addresses cannot bypass this.
    const key = createHash("sha256").update(`moderation:${actor.user.id}`).digest("hex");
    const limit = await actor.admin.rpc("consume_login_attempt", { attempt_identifier: key, max_attempts: 8, window_seconds: 900, block_seconds: 900 });
    if (limit.error) return reply({ error: "Verification is unavailable. Please retry later." }, 503);
    if (limit.data !== true) return reply({ error: "Too many verification attempts. Try again in 15 minutes." }, 429);

    if (actor.user.app_metadata.password_login_enabled === false) {
      const store = await cookies();
      const token = store.get(GOOGLE_MODERATION_COOKIE)?.value;
      const { data: claims } = await actor.client.auth.getClaims();
      const sessionId = claims?.claims.session_id;
      if (!token || !/^[0-9a-f]{64}$/.test(token) || typeof sessionId !== "string") return reply({ error: "Verify with Google first." }, 401);
      const proof = await actor.admin.rpc("consume_moderation_verification", {
        p_user_id: actor.user.id, p_session_id: sessionId, p_token_hash: createHash("sha256").update(token).digest("hex"),
      });
      store.delete(GOOGLE_MODERATION_COOKIE);
      if (proof.error || proof.data !== true) return reply({ error: "Google verification expired or was used. Verify again." }, 401);
    } else {
      if (!actor.user.email || typeof body.currentPassword !== "string" || !body.currentPassword || body.currentPassword.length > 1024) return reply({ error: "Enter your current password." }, 400);
      // A separate, nonpersistent client: never replace the administrator's
      // existing session or emit the new session/token into the response.
      const verifier = createVerifier(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
        global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }) },
      });
      const verified = await verifier.auth.signInWithPassword({ email: actor.user.email, password: body.currentPassword });
      const valid = !verified.error && verified.data.user?.id === actor.user.id;
      if (verified.data.session) await verifier.auth.signOut({ scope: "local" });
      if (!valid) return reply({ error: "Current password is incorrect." }, 401);
    }
    const result = await actor.admin.rpc("moderate_account", {
      p_actor_id: actor.user.id, p_target_id: id, p_action: action, p_reason: body.reason.trim(),
      p_expected_version: body.version, p_request_id: body.requestId,
    });
    if (result.error) {
      const code = result.error.code;
      return reply({ error: code === "40001" ? "This account changed. Refresh the page and review it again."
        : code === "42501" ? "This action is no longer permitted."
        : code === "P0001" ? "Too many moderation actions. Wait a minute and try again."
        : "The action was not completed. Refresh and try again; contact the owner if it persists." }, code === "40001" ? 409 : code === "42501" ? 403 : code === "P0001" ? 429 : 503);
    }
    await actor.admin.rpc("clear_login_attempts", { attempt_identifier: key });
    return reply({ success: true });
  } catch (error) {
    return reply({ error: "Unable to complete this request. No success has been confirmed." }, error instanceof RequestBodyError ? error.status : 503);
  }
}
