"use client";

import { useState } from "react";

export default function AdminAccountRecovery() {
  const [username, setUsername] = useState("");
  const [identityVerified, setIdentityVerified] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateLink() {
    setWorking(true); setError(null); setResetUrl(""); setCopied(false);
    try {
      const response = await fetch("/api/admin/account-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, identityVerified }),
      });
      const data = (await response.json()) as { error?: string; resetUrl?: string };
      if (!response.ok || !data.resetUrl) { setError(data.error ?? "Unable to generate a recovery link."); return; }
      setResetUrl(data.resetUrl);
    } finally { setWorking(false); }
  }

  return (
    <section className="mt-7 rounded-2xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-700">Assisted recovery</p>
      <h2 className="mt-2 text-2xl font-bold">Help an email-less user reset their password</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Only use this after verifying the person&apos;s identity outside the website. The generated link is temporary and lets the user choose their own password; you never see it.</p>
      <label className="mt-5 block text-sm font-semibold">Username</label>
      <input value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} className="mt-2 w-full rounded-xl border bg-white p-3" placeholder="username" />
      <label className="mt-4 flex items-start gap-3 rounded-xl border border-violet-200 bg-white p-4 text-sm font-semibold"><input type="checkbox" checked={identityVerified} onChange={(event) => setIdentityVerified(event.target.checked)} className="mt-1" /><span>I verified this person&apos;s identity in real life and confirmed this is their account.</span></label>
      <button disabled={working || !identityVerified || !username} onClick={generateLink} className="mt-4 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white disabled:opacity-40">Generate one-time reset link</button>
      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {resetUrl ? <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4"><p className="text-sm font-semibold text-green-800">Give this link only to the verified account holder.</p><div className="mt-3 flex flex-col gap-2 sm:flex-row"><input readOnly value={resetUrl} className="min-w-0 flex-1 rounded-lg border bg-white p-3 text-sm" /><button onClick={async () => { await navigator.clipboard.writeText(resetUrl); setCopied(true); }} className="rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white">{copied ? "Copied" : "Copy link"}</button></div></div> : null}
    </section>
  );
}
