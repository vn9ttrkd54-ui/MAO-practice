import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { getPasswordValidationError } from "@/lib/auth/passwordPolicy";
import { getUsernameValidationError, PUBLIC_NAME_ERROR } from "@/lib/auth/publicNames";
import { GOOGLE_DELETE_COOKIE } from "@/lib/auth/googleFlow";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERNAL_EMAIL_DOMAIN = "@users.mao-practice.local";
const MAX_REQUEST_BYTES = 8_192;

async function verifyCurrentPassword(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string | undefined,
  currentPassword: string | undefined
) {
  if (!email || !currentPassword) return false;
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  return !error;
}

export async function PATCH(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (user.app_metadata?.needs_username === true) return NextResponse.json({ error: "Complete account setup first." }, { status: 403 });

  let body: { action?: unknown; username?: unknown; email?: unknown; password?: unknown; currentPassword?: unknown };
  try {
    body = await readJsonBody<typeof body>(request, MAX_REQUEST_BYTES);
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status });
  }

  if (body.action === "email") {
    if (user.app_metadata?.password_login_enabled === false) return NextResponse.json({ error: "Your sign-in email is managed by Google." }, { status: 400 });
    if (typeof body.email !== "string") {
      return NextResponse.json({ error: "Enter a valid personal email address." }, { status: 400 });
    }
    const email = body.email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email) || email.endsWith(INTERNAL_EMAIL_DOMAIN)) {
      return NextResponse.json({ error: "Enter a valid personal email address." }, { status: 400 });
    }
    if (typeof body.currentPassword !== "string" || !body.currentPassword) {
      return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
    }
    if (!(await verifyCurrentPassword(supabase, user.email, body.currentPassword))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const { data, error } = await supabase.auth.updateUser({ email });
    if (error) {
      return NextResponse.json({ error: "Unable to add that email. It may already be in use." }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      email: data.user.email ?? email,
      pendingEmail: data.user.new_email ?? null,
    });
  }

  if (body.action === "username") {
    if (typeof body.username !== "string") {
      return NextResponse.json({ error: "Use 3–20 lowercase letters, numbers, or underscores." }, { status: 400 });
    }
    const username = body.username.trim().toLowerCase();
    const nameError = getUsernameValidationError(username);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin.rpc("set_account_username", { p_user_id: user.id, p_username: username });
    if (error) return NextResponse.json({ error: error.code === "23505" ? "That username is already taken." : error.code === "23514" ? PUBLIC_NAME_ERROR : "Unable to change the username." }, { status: error.code === "23505" ? 409 : 400 });
    return NextResponse.json({ success: true, username });
  }

  if (body.action === "password") {
    if (user.app_metadata?.password_login_enabled === false) return NextResponse.json({ error: "This account signs in with Google, not a site password." }, { status: 400 });
    const password = body.password;
    const passwordError = getPasswordValidationError(password);
    if (typeof password !== "string" || passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });
    if (typeof body.currentPassword !== "string" || !body.currentPassword) {
      return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
    }
    if (!(await verifyCurrentPassword(supabase, user.email, body.currentPassword))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    // Keep the fresh sign-in above for secure-password-change compatibility,
    // and also satisfy the provider's separate current-password requirement.
    const { error } = await supabase.auth.updateUser({ password, current_password: body.currentPassword });
    if (error) return NextResponse.json({ error: error.code === "weak_password"
      ? "Choose a stronger, unique password. This password was rejected by the security policy."
      : "Unable to change the password. Check your current password and try again." }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid account action." }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  let body: { confirmation?: unknown; currentPassword?: unknown };
  try {
    body = await readJsonBody<typeof body>(request, MAX_REQUEST_BYTES);
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status });
  }
  if (body.confirmation !== "DELETE") {
    return NextResponse.json({ error: "Type DELETE to confirm." }, { status: 400 });
  }
  const admin = createAdminClient();
  if (user.app_metadata?.password_login_enabled === false) {
    const cookieStore = await cookies();
    const token = cookieStore.get(GOOGLE_DELETE_COOKIE)?.value;
    const { data: claims } = await supabase.auth.getClaims();
    const sessionId = claims?.claims.session_id;
    if (!token || !/^[0-9a-f]{64}$/.test(token) || typeof sessionId !== "string") return NextResponse.json({ error: "Verify with Google before deleting your account." }, { status: 401 });
    const proof = await admin.rpc("consume_google_delete_verification", {
      p_user_id: user.id, p_session_id: sessionId, p_token_hash: createHash("sha256").update(token).digest("hex"),
    });
    cookieStore.delete(GOOGLE_DELETE_COOKIE);
    if (proof.error || proof.data !== true) return NextResponse.json({ error: "Google verification expired. Verify again to continue." }, { status: 401 });
  } else {
    if (typeof body.currentPassword !== "string" || !body.currentPassword) return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
    if (!(await verifyCurrentPassword(supabase, user.email, body.currentPassword))) return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Unable to delete the account." }, { status: 500 });
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
