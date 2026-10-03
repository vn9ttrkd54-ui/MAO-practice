"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { getUsernameValidationError } from "@/lib/auth/publicNames";

export default function GoogleSetupForm() {
  const [username, setUsername] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = username.trim().toLowerCase();
    const nameError = getUsernameValidationError(normalized);
    if (nameError) { setError(nameError); return; }
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/auth/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: normalized, acceptedLegal }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to finish setup.");
      // Load with the updated auth cookies, discarding prefetched setup redirects.
      window.location.replace("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to finish setup.");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-semibold">Public username</label>
        <input id="username" name="username" autoComplete="username" minLength={3} maxLength={20} required value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} placeholder="math_student" className="mt-2 w-full rounded-lg border px-4 py-3" />
        <p className="mt-2 text-xs text-gray-600">3-20 lowercase letters, numbers, or underscores. Your Google name and email are not your public username.</p>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input type="checkbox" checked={acceptedLegal} onChange={(event) => setAcceptedLegal(event.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-blue-600" />
        <span>I confirm that I am at least 13 years old and agree to the <Link href="/terms" target="_blank" className="underline">Terms of Service</Link> and acknowledge the <Link href="/privacy" target="_blank" className="underline">Privacy Policy</Link>.</span>
      </label>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-lg px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Saving..." : "Finish setup"}</button>
    </form>
  );
}
