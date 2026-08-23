import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const GENERIC_LOGIN_ERROR = "Incorrect username or password.";

function getClientAddress(request: Request) {
  return request.headers.get("x-real-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
}

async function hashIdentifier(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    const body = await readJsonBody<{
      username?: string;
      password?: string;
    }>(request, 8_192);

    const username = body.username?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!USERNAME_PATTERN.test(username) || !password) {
      return NextResponse.json(
        { error: GENERIC_LOGIN_ERROR },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const rateLimitKey = await hashIdentifier(`${getClientAddress(request)}:${username}`);
    const { data: allowed, error: rateLimitError } = await admin.rpc(
      "consume_login_attempt",
      { attempt_identifier: rateLimitKey }
    );
    if (rateLimitError) throw rateLimitError;
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    // Usernames can change while the private authentication email remains stable,
    // so resolve the current username without ever exposing that email to clients.
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 401 });
    }

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
    const email = userData.user?.email;
    if (userError || !email) {
      return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 401 });
    }

    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: GENERIC_LOGIN_ERROR },
        { status: 401 }
      );
    }

    await admin.rpc("clear_login_attempts", { attempt_identifier: rateLimitKey });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: error.status });
    }
    return NextResponse.json(
      { error: "Unable to log in right now. Please try again." },
      { status: 500 }
    );
  }
}
