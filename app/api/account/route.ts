import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const MAX_REQUEST_BYTES = 8_192;

function requestIsTooLarge(request: Request) {
  return Number(request.headers.get("content-length") ?? 0) > MAX_REQUEST_BYTES;
}

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
  if (requestIsTooLarge(request)) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = (await request.json()) as {
    action?: string;
    username?: string;
    password?: string;
    currentPassword?: string;
  };

  if (body.action === "username") {
    const username = body.username?.trim().toLowerCase() ?? "";
    if (!USERNAME_PATTERN.test(username)) {
      return NextResponse.json({ error: "Use 3–20 lowercase letters, numbers, or underscores." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: existing } = await admin.from("profiles").select("id").eq("username", username).neq("id", user.id).maybeSingle();
    if (existing) return NextResponse.json({ error: "That username is already taken." }, { status: 409 });

    const { error } = await admin.from("profiles").update({ username }).eq("id", user.id);
    if (error) return NextResponse.json({ error: "Unable to change the username." }, { status: 500 });
    await admin.auth.admin.updateUserById(user.id, { user_metadata: { ...user.user_metadata, username } });
    return NextResponse.json({ success: true, username });
  }

  if (body.action === "password") {
    const password = body.password ?? "";
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    if (!(await verifyCurrentPassword(supabase, user.email, body.currentPassword))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return NextResponse.json({ error: "Unable to change the password." }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid account action." }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (requestIsTooLarge(request)) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const body = (await request.json()) as { confirmation?: string; currentPassword?: string };
  if (body.confirmation !== "DELETE") {
    return NextResponse.json({ error: "Type DELETE to confirm." }, { status: 400 });
  }
  if (!(await verifyCurrentPassword(supabase, user.email, body.currentPassword))) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Unable to delete the account." }, { status: 500 });
  return NextResponse.json({ success: true });
}
