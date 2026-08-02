import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const GENERIC_LOGIN_ERROR = "Incorrect username or password.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const username = body.username?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!USERNAME_PATTERN.test(username) || !password) {
      return NextResponse.json(
        { error: GENERIC_LOGIN_ERROR },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: GENERIC_LOGIN_ERROR },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } =
      await admin.auth.admin.getUserById(profile.id);

    const email = userData.user?.email;

    if (userError || !email) {
      return NextResponse.json(
        { error: GENERIC_LOGIN_ERROR },
        { status: 401 }
      );
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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to log in right now. Please try again." },
      { status: 500 }
    );
  }
}
