"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || cooldown) return;
    setBusy(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), signal: AbortSignal.timeout(12_000),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Unable to request recovery. Please try again later.");
        if (response.status === 429) setCooldown(60);
      } else {
        setMessage(body.message); setCooldown(60);
      }
    } catch {
      setError("The request could not be confirmed. Check your inbox before trying again.");
      setCooldown(60);
    } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="mt-7 space-y-5">
    <div>
      <label htmlFor="recovery-email" className="block text-sm font-semibold text-slate-900">Recovery email</label>
      <input id="recovery-email" name="email" type="email" autoComplete="email" required maxLength={254}
        value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com"
        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
    </div>
    {message && <p role="status" className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">{message}</p>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <button type="submit" aria-busy={busy} disabled={busy || cooldown > 0} className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:opacity-50">
      {busy ? "Requesting link…" : cooldown ? `Try again in ${cooldown}s` : "Send reset link"}
    </button>
  </form>;
}
