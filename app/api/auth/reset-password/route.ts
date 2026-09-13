import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRecoveryToken } from "@/lib/auth/recoveryToken";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { getPasswordValidationError } from "@/lib/auth/passwordPolicy";

const RECOVERY_COOKIE = "mathematics_daily_password_recovery";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  const cookieStore = await cookies();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const recoveryToken = cookieStore.get(RECOVERY_COOKIE)?.value;
  if (!user || !recoveryToken || !verifyRecoveryToken(recoveryToken, user.id)) {
    cookieStore.delete(RECOVERY_COOKIE);
    return NextResponse.json({ error: "This recovery link is invalid or expired." }, { status: 403 });
  }

  let password: unknown;
  try {
    const body = await readJsonBody<{ password?: unknown }>(request, 8_192);
    password = body.password;
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status });
  }

  const passwordError = getPasswordValidationError(password);
  if (typeof password !== "string" || passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  // Commit consumption before the external mutation. Never refund on an
  // uncertain provider outcome, since the password might already have changed.
  try {
    const { data, error } = await createAdminClient().rpc("consume_recovery_token", {
      p_user_id: user.id,
      p_token_hash: createHash("sha256").update(recoveryToken).digest("hex"),
    });
    if (error || data !== true) {
      cookieStore.delete(RECOVERY_COOKIE);
      return NextResponse.json({ error: "This recovery link is unavailable or already used. Request a new link." }, { status: 403 });
    }
  } catch {
    cookieStore.delete(RECOVERY_COOKIE);
    return NextResponse.json({ error: "Unable to verify recovery. Request a new link." }, { status: 503 });
  }
  cookieStore.delete(RECOVERY_COOKIE);
  let error;
  try {
    ({ error } = await supabase.auth.updateUser({ password }));
  } catch {
    return NextResponse.json({ error: "The reset outcome could not be confirmed. Try signing in or request a new link." }, { status: 503 });
  }
  if (error) {
    return NextResponse.json({ error: error.code === "weak_password"
      ? "This password was rejected by the security policy. Request a new recovery link and choose a stronger, unique password."
      : "Unable to reset the password. Request a new recovery link." }, { status: 400 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
