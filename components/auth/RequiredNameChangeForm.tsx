"use client";
import { useState, type FormEvent } from "react";
import { getUsernameValidationError } from "@/lib/auth/publicNames";

export default function RequiredNameChangeForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<{ username: string; signInAgain: boolean } | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = username.trim().toLowerCase();
    const invalid = getUsernameValidationError(normalized);
    if (invalid) { setError(invalid); return; }
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/account/moderation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: normalized }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to save the name.");
      setSaved(body);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setBusy(false); }
  }
  if (saved) return <div role="status" className="mt-6 space-y-4"><p>Your new username is <strong>{saved.username}</strong>. Use this name next time you log in. Your password and progress have not changed.</p><a className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white" href={saved.signInAgain ? "/login" : "/dashboard"}>{saved.signInAgain ? "Sign in again" : "Continue"}</a></div>;
  return <form onSubmit={submit} className="mt-6 space-y-4">
    <label className="block font-semibold">New username<input name="username" autoComplete="username" minLength={3} maxLength={20} required value={username} onChange={event => setUsername(event.target.value.toLowerCase())} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3" /></label>
    <p className="text-sm text-slate-600">Use 3–20 lowercase letters, numbers, or underscores. Choose a different, appropriate name.</p>
    {error ? <p role="alert" className="text-red-700">{error}</p> : null}
    <button disabled={busy} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save new username"}</button>
  </form>;
}
