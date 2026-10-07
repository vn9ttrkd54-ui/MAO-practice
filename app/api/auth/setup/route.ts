import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { getUsernameValidationError, PUBLIC_NAME_ERROR } from "@/lib/auth/publicNames";
import { LEGAL_VERSION } from "@/lib/legal";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  let body: { username?: unknown; acceptedLegal?: unknown };
  try { body = await readJsonBody<typeof body>(request, 4096); }
  catch (error) { return NextResponse.json({ error: "Invalid request." }, { status: error instanceof RequestBodyError ? error.status : 400 }); }
  const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const nameError = getUsernameValidationError(username);
  if (nameError) return NextResponse.json({ error: nameError }, { status: 400 });
  if (body.acceptedLegal !== true) return NextResponse.json({ error: "Confirm that you are at least 13 and agree to the Terms and Privacy Policy." }, { status: 400 });
  const supabase = await createClient(undefined, { allowRestricted: true });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (user.app_metadata.account_suspended === true) return NextResponse.json({ error: "Account suspended." }, { status: 403 });
  if (user.app_metadata.needs_username !== true) return NextResponse.json({ error: "Your account is already set up." }, { status: 409 });
  const { error } = await createAdminClient().rpc("set_account_username", { p_user_id: user.id, p_username: username, p_complete_setup: true, p_legal_version: LEGAL_VERSION });
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That username is already taken." : error.code === "23514" ? PUBLIC_NAME_ERROR : "Unable to finish setup. Please try again." }, { status: error.code === "23505" ? 409 : 400 });
  const refreshed = await supabase.auth.refreshSession();
  if (refreshed.error) return NextResponse.json({ error: "Your username was saved. Sign in again to continue." }, { status: 503 });
  return NextResponse.json({ success: true });
}
