import { createClient } from "@/lib/supabase/client";

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface SignUpInput {
  username: string;
  email?: string;
  password: string;
}

interface LoginInput {
  username: string;
  password: string;
}

export async function signUp({
  username,
  email,
  password,
}: SignUpInput): Promise<AuthResult> {
  const supabase = createClient();
  const authenticationEmail =
    email?.trim().toLowerCase() ||
    `${username}@users.mao-practice.local`;

  const { data: isAvailable, error: availabilityError } =
    await supabase.rpc("is_username_available", {
      candidate_username: username,
    });

  if (availabilityError) {
    return {
      success: false,
      error: "Unable to check that username right now. Please try again.",
    };
  }

  if (!isAvailable) {
    return {
      success: false,
      error: "That username is already taken. Try a different username.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: authenticationEmail,
    password,
    options: {
      data: {
        username,
        email_provided: Boolean(email?.trim()),
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("already registered") ||
      message.includes("already exists")
    ) {
      return {
        success: false,
        error: "An account already exists with that email.",
      };
    }

    if (
      message.includes("database error") ||
      message === "{}" ||
      message.includes("username")
    ) {
      return {
        success: false,
        error: "That username may already be taken. Try a different username.",
      };
    }

    return {
      success: false,
      error: error.message || "Unable to create the account.",
    };
  }

  if (!data.session) {
    return {
      success: false,
      error:
        "Account created, but immediate sign-in is disabled. Check the Supabase email confirmation setting.",
    };
  }

  return { success: true };
}

export async function signInWithUsername({
  username,
  password,
}: LoginInput): Promise<AuthResult> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = (await response.json()) as {
    success?: boolean;
    error?: string;
  };

  if (!response.ok || !data.success) {
    return {
      success: false,
      error: data.error ?? "Unable to log in. Please try again.",
    };
  }

  return { success: true };
}

export async function signOut(): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: "Unable to log out. Please try again.",
    };
  }

  return { success: true };
}
