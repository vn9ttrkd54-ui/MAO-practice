"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { signUp } from "@/lib/auth/authService";
import { MIN_PASSWORD_LENGTH, getPasswordValidationError } from "@/lib/auth/passwordPolicy";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const normalizedUsername = username.trim().toLowerCase();

    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      setErrorMessage(
        "Username must be 3–20 characters and use only lowercase letters, numbers, or underscores."
      );
      return;
    }

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!acceptedLegal) {
      setErrorMessage("Confirm that you are at least 13 and agree to the Privacy Policy and Terms.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp({
        username: normalizedUsername,
        password,
        acceptedLegal,
      });

      if (!result.success) {
        setErrorMessage(result.error ?? "Unable to create the account.");
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
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
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

      <label className="flex items-start gap-3 text-sm leading-6 text-gray-700">
        <input
          type="checkbox"
          checked={acceptedLegal}
          onChange={(event) => setAcceptedLegal(event.target.checked)}
          required
          className="mt-1 h-4 w-4 shrink-0 accent-slate-950"
        />
        <span>
          I confirm that I am at least 13 years old and agree to the{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-slate-950 underline">Terms of Service</Link>
          {" "}and acknowledge the{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-slate-950 underline">Privacy Policy</Link>.
        </span>
      </label>

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
