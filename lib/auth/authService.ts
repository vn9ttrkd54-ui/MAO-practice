import { createClient } from "@/lib/supabase/client";
import { LEGAL_VERSION } from "@/lib/legal";
import { getPasswordValidationError } from "@/lib/auth/passwordPolicy";
import { getUsernameValidationError, PUBLIC_NAME_ERROR } from "@/lib/auth/publicNames";

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface SignUpInput {
  username: string;
  password: string;
  acceptedLegal: boolean;
}

interface LoginInput {
  username: string;
  password: string;
}

export async function signUp({
  username,
  password,
  acceptedLegal,
}: SignUpInput): Promise<AuthResult> {
  username = username.trim().toLowerCase();
  const nameError = getUsernameValidationError(username);
  if (nameError) return { success: false, error: nameError };
  if (!acceptedLegal) {
    return { success: false, error: "You must confirm your age and agree to the legal terms." };
  }
  const passwordError = getPasswordValidationError(password);
  if (passwordError) return { success: false, error: passwordError };
  const supabase = createClient();
  const authenticationEmail = `${username}@users.mao-practice.local`;

  const nameCheck = await supabase.rpc("is_public_name_allowed", { p_value: username });
  if (nameCheck.error) return { success: false, error: "Unable to check that username right now. Please try again." };
  if (nameCheck.data !== true) return { success: false, error: PUBLIC_NAME_ERROR };

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
        display_name: username,
        full_name: username,
        age_13_or_older: true,
        terms_accepted_at: new Date().toISOString(),
        terms_version: LEGAL_VERSION,
        privacy_version: LEGAL_VERSION,
      },
    },
  });

  if (error) {
    if (error.code === "weak_password") {
      return { success: false, error: "Choose a stronger, unique password. This password was rejected by the security policy." };
    }
    const message = error.message.toLowerCase();

    if (
      message.includes("already registered") ||
      message.includes("already exists")
    ) {
      return {
        success: false,
        error: "That username is already registered.",
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
      error: "Unable to create the account right now. Please try again.",
    };
  }

  if (!data.session) {
    return {
      success: false,
      error:
        "Account created, but automatic sign-in is currently disabled.",
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
