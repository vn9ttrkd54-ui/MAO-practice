"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithUsername } from "@/lib/auth/authService";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const normalizedUsername = username.trim().toLowerCase();

    if (!USERNAME_PATTERN.test(normalizedUsername) || !password) {
      setErrorMessage("Incorrect username or password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signInWithUsername({
        username: normalizedUsername,
        password,
      });

      if (!result.success) {
        setErrorMessage(result.error ?? "Unable to log in.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Unable to log in right now. Please try again.");
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
          required
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="math_student"
        />
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="Enter your password"
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
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Need an account?{" "}
        <Link href="/signup" className="font-semibold text-gray-950 hover:underline">
          Create one now
        </Link>
      </p>
    </form>
  );
}
