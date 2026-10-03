"use client";

import { useState } from "react";

type Props = { mode?: "signin" | "link" | "verify-delete"; currentPassword?: string; disabled?: boolean };

export default function GoogleButton({ mode = "signin", currentPassword, disabled }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const label = mode === "link" ? "Connect Google" : mode === "verify-delete" ? "Verify with Google" : "Continue with Google";
  async function start() {
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/auth/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, currentPassword }) });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Unable to open Google sign-in.");
      window.location.assign(data.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to open Google sign-in.");
      setBusy(false);
    }
  }
  return (
    <div>
      <button type="button" onClick={start} disabled={disabled || busy} className="flex min-h-12 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? "Opening Google..." : label}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
