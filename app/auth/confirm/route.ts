import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createRecoveryToken } from "@/lib/auth/recoveryToken";

const RECOVERY_COOKIE = "mathematics_daily_password_recovery";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const destination = new URL("/reset-password", request.url);

  if (!tokenHash || type !== "recovery") {
    destination.searchParams.set("error", "invalid");
    return NextResponse.redirect(destination);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });

  if (error) {
    destination.searchParams.set("error", "expired");
    return NextResponse.redirect(destination);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    destination.searchParams.set("error", "invalid");
    return NextResponse.redirect(destination);
  }

  const response = NextResponse.redirect(destination);
  response.cookies.set(RECOVERY_COOKIE, createRecoveryToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
