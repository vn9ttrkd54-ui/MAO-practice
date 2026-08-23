import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { verifyRecoveryToken } from "@/lib/auth/recoveryToken";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";

const RECOVERY_COOKIE = "mathematics_daily_password_recovery";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  const cookieStore = await cookies();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const recoveryToken = cookieStore.get(RECOVERY_COOKIE)?.value;
  if (!user || !verifyRecoveryToken(recoveryToken, user.id)) {
    cookieStore.delete(RECOVERY_COOKIE);
    return NextResponse.json({ error: "This recovery link is invalid or expired." }, { status: 403 });
  }

  let password = "";
  try {
    const body = await readJsonBody<{ password?: string }>(request, 8_192);
    password = body.password ?? "";
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return NextResponse.json({ error: "Unable to reset the password." }, { status: 400 });
  }

  cookieStore.delete(RECOVERY_COOKIE);
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
