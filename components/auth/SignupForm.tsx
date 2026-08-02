"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      setErrorMessage(
        "Username must be 3–20 characters and use only lowercase letters, numbers, or underscores."
      );
      return;
    }

    if (!normalizedEmail) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            username: normalizedUsername,
          },
        },
      });

      if (error) {
        const message = error.message.toLowerCase();

        if (message.includes("database error")) {
          setErrorMessage(
            "That username may already be taken. Try a different username."
          );
        } else if (message.includes("already registered")) {
          setErrorMessage("An account already exists with that email.");
        } else {
          setErrorMessage(error.message);
        }

        return;
      }

      if (!data.session) {
        setErrorMessage(
          "Account created, but immediate sign-in is disabled. Check the Supabase email confirmation setting."
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-gray-900"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value.toLowerCase())}
          minLength={3}
          maxLength={20}
          required
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="math_student"
        />
        <p className="mt-2 text-xs text-gray-500">
          Use 3–20 lowercase letters, numbers, or underscores.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-900"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="student@example.com"
        />
        <p className="mt-2 text-xs text-gray-500">
          You can use the account immediately and verify this email later.
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-900"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={MIN_PASSWORD_LENGTH}
          required
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-gray-900"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={MIN_PASSWORD_LENGTH}
          required
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="Re-enter your password"
        />
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-gray-950 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
