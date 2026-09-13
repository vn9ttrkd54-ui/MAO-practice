"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MIN_PASSWORD_LENGTH, getPasswordValidationError } from "@/lib/auth/passwordPolicy";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to reset the password.");
        return;
      }
      router.replace("/login?passwordReset=success");
      router.refresh();
    } catch {
      setError("Unable to reset the password right now.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div>
        <label htmlFor="new-password" className="text-sm font-semibold">New password</label>
        <input id="new-password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" />
      </div>
      <div>
        <label htmlFor="confirm-password" className="text-sm font-semibold">Confirm new password</label>
        <input id="confirm-password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" />
      </div>
      <button disabled={saving} className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Updating…" : "Set new password"}</button>
    </form>
  );
}
