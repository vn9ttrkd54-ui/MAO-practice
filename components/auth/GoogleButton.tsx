"use client";

import { useState } from "react";
import Image from "next/image";

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
      <button type="button" onClick={start} disabled={disabled || busy} aria-busy={busy} className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-[#747775] bg-white px-3 py-3 text-sm leading-5 font-medium text-[#1f1f1f] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
        <Image src="/google-g.png" alt="" aria-hidden="true" width={20} height={20} unoptimized loading="eager" className="h-5 w-5 shrink-0 object-contain" />
        <span>{busy ? "Opening Google..." : label}</span>
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
