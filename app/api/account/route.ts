import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { getPasswordValidationError } from "@/lib/auth/passwordPolicy";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
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

  let body: { action?: unknown; username?: unknown; email?: unknown; password?: unknown; currentPassword?: unknown };
  try {
    body = await readJsonBody<typeof body>(request, MAX_REQUEST_BYTES);
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status });
  }

  if (body.action === "email") {
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
    if (!USERNAME_PATTERN.test(username)) {
      return NextResponse.json({ error: "Use 3–20 lowercase letters, numbers, or underscores." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: existing } = await admin.from("profiles").select("id").eq("username", username).neq("id", user.id).maybeSingle();
    if (existing) return NextResponse.json({ error: "That username is already taken." }, { status: 409 });

    const { error } = await admin.from("profiles").update({ username }).eq("id", user.id);
    if (error) return NextResponse.json({ error: "Unable to change the username." }, { status: 500 });
    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        username,
        display_name: username,
        full_name: username,
      },
    });
    return NextResponse.json({ success: true, username });
  }

  if (body.action === "password") {
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
  if (typeof body.currentPassword !== "string" || !body.currentPassword) {
    return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
  }
  if (!(await verifyCurrentPassword(supabase, user.email, body.currentPassword))) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Unable to delete the account." }, { status: 500 });
  return NextResponse.json({ success: true });
}
