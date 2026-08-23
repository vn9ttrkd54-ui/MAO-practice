import { NextResponse } from "next/server";

import { hasOwnerAccess } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const MAX_REQUEST_BYTES = 8_192;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const admin = createAdminClient();
  const { data: ownProfile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string }>();
  if (!hasOwnerAccess(ownProfile?.role)) return NextResponse.json({ error: "Owner access required." }, { status: 403 });

  let body: { username?: string; identityVerified?: boolean; currentPassword?: string };
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const username = body.username?.trim().toLowerCase() ?? "";
  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: "Enter a valid username." }, { status: 400 });
  }
  if (body.identityVerified !== true) {
    return NextResponse.json({ error: "Confirm that you verified the account holder's identity in person." }, { status: 400 });
  }
  if (!body.currentPassword || !user.email) {
    return NextResponse.json({ error: "Enter your owner password." }, { status: 400 });
  }

  const { error: passwordError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: body.currentPassword,
  });
  if (passwordError) {
    return NextResponse.json({ error: "Owner password is incorrect." }, { status: 401 });
  }

  const { data: profile } = await admin.from("profiles").select("id").eq("username", username).maybeSingle<{ id: string }>();
  if (!profile) return NextResponse.json({ error: "No account was found with that username." }, { status: 404 });

  const { data: authData, error: userError } = await admin.auth.admin.getUserById(profile.id);
  const email = authData.user?.email;
  if (userError || !email) return NextResponse.json({ error: "Unable to prepare account recovery." }, { status: 400 });

  const { data, error } = await admin.auth.admin.generateLink({ type: "recovery", email });
  if (error || !data.properties.hashed_token) {
    return NextResponse.json({ error: "Unable to generate a recovery link." }, { status: 400 });
  }

  const recoveryPath = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    type: "recovery",
  });

  return NextResponse.json(
    { resetPath: `/auth/confirm?${recoveryPath.toString()}` },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
