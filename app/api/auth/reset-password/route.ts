import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { verifyRecoveryToken } from "@/lib/auth/recoveryToken";

const RECOVERY_COOKIE = "mathematics_daily_password_recovery";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 8_192) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

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
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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
