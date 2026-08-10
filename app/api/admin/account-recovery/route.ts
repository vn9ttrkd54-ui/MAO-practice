import { NextResponse } from "next/server";

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
  if (ownProfile?.role !== "admin") return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const body = (await request.json()) as { username?: string; identityVerified?: boolean };
  const username = body.username?.trim().toLowerCase() ?? "";
  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: "Enter a valid username." }, { status: 400 });
  }
  if (body.identityVerified !== true) {
    return NextResponse.json({ error: "Confirm that you verified the account holder's identity in person." }, { status: 400 });
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

  const recoveryUrl = new URL("/auth/confirm", request.url);
  recoveryUrl.searchParams.set("token_hash", data.properties.hashed_token);
  recoveryUrl.searchParams.set("type", "recovery");

  return NextResponse.json(
    { resetUrl: recoveryUrl.toString() },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
