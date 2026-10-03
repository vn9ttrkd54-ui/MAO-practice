import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { createGoogleIntent, GOOGLE_INTENT_COOKIE, GOOGLE_DELETE_COOKIE, GOOGLE_FLOW_SECONDS, googleCookieOptions, type GoogleMode } from "@/lib/auth/googleFlow";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  let body: { mode?: unknown; currentPassword?: unknown };
  try { body = await readJsonBody<typeof body>(request, 4096); }
  catch (error) { return NextResponse.json({ error: "Invalid request." }, { status: error instanceof RequestBodyError ? error.status : 400 }); }
  if (typeof body.mode !== "string" || !["signin", "link", "verify-delete"].includes(body.mode)) return NextResponse.json({ error: "Invalid Google action." }, { status: 400 });
  const mode = body.mode as GoogleMode;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (mode !== "signin" && !user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (mode === "signin" && user) return NextResponse.json({ error: "Use Connect Google in account settings." }, { status: 400 });
  if (mode === "link") {
    if (user?.app_metadata.password_login_enabled === false || !user?.email || typeof body.currentPassword !== "string" || !body.currentPassword) {
      return NextResponse.json({ error: "Enter your current password to connect Google." }, { status: 400 });
    }
    const verified = await supabase.auth.signInWithPassword({ email: user.email, password: body.currentPassword });
    if (verified.error) return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }
  if (mode === "verify-delete" && !user?.identities?.some((identity) => identity.provider === "google")) {
    return NextResponse.json({ error: "Google is not connected to this account." }, { status: 400 });
  }
  const cookieStore = await cookies();
  cookieStore.delete(GOOGLE_DELETE_COOKIE);
  const options = { redirectTo: `${new URL(request.url).origin}/auth/callback`, skipBrowserRedirect: true, queryParams: { prompt: "select_account" } };
  const result = mode === "link"
    ? await supabase.auth.linkIdentity({ provider: "google", options })
    : await supabase.auth.signInWithOAuth({ provider: "google", options });
  if (result.error || !result.data.url) {
    return NextResponse.json({ error: mode === "link" ? "Unable to connect Google. Please try again later." : "Google sign-in is not available right now. Please try again later." }, { status: 503 });
  }
  cookieStore.set(GOOGLE_INTENT_COOKIE, createGoogleIntent(mode, user?.id ?? null), { ...googleCookieOptions, maxAge: GOOGLE_FLOW_SECONDS });
  return NextResponse.json({ url: result.data.url });
}
