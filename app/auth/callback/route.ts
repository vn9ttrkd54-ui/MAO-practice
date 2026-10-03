import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readGoogleIntent, GOOGLE_INTENT_COOKIE, GOOGLE_DELETE_COOKIE, GOOGLE_DELETE_SECONDS, googleCookieOptions } from "@/lib/auth/googleFlow";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const intent = readGoogleIntent(cookieStore.get(GOOGLE_INTENT_COOKIE)?.value);
  cookieStore.delete(GOOGLE_INTENT_COOKIE);
  cookieStore.delete(GOOGLE_DELETE_COOKIE);
  const fail = () => NextResponse.redirect(new URL(intent?.mode === "signin" || !intent ? "/login?google=error" : "/account?google=error", url.origin));
  const code = url.searchParams.get("code");
  if (!intent || !code || url.searchParams.has("error")) return fail();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) return fail();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.identities?.some((identity) => identity.provider === "google")) return fail();
  if (intent.userId && user.id !== intent.userId) {
    await supabase.auth.signOut({ scope: "local" });
    return NextResponse.redirect(new URL("/login?google=wrong-account", url.origin));
  }
  if (user.app_metadata.needs_username === true) {
    const refreshed = await supabase.auth.refreshSession();
    if (refreshed.error) { await supabase.auth.signOut({ scope: "local" }); return fail(); }
    return NextResponse.redirect(new URL("/auth/setup", url.origin));
  }
  if (intent.mode === "verify-delete") {
    if (!data.session.provider_token) return fail();
    const { data: claims } = await supabase.auth.getClaims();
    const sessionId = claims?.claims.session_id;
    if (typeof sessionId !== "string") return fail();
    const token = randomBytes(32).toString("hex");
    const { error: verificationError } = await createAdminClient().rpc("issue_google_delete_verification", {
      p_user_id: user.id, p_session_id: sessionId, p_token_hash: createHash("sha256").update(token).digest("hex"),
    });
    if (verificationError) return fail();
    cookieStore.set(GOOGLE_DELETE_COOKIE, token, { ...googleCookieOptions, maxAge: GOOGLE_DELETE_SECONDS });
    return NextResponse.redirect(new URL("/account?google=verified", url.origin));
  }
  return NextResponse.redirect(new URL(intent.mode === "link" ? "/account?google=linked" : "/dashboard", url.origin));
}
