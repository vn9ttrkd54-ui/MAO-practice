"use client";

import { UserRound, Mail, LockKeyhole, Settings2 } from "lucide-react";
import styles from "@/components/settings/settings.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MIN_PASSWORD_LENGTH, getPasswordValidationError } from "@/lib/auth/passwordPolicy";
import GoogleButton from "@/components/auth/GoogleButton";
import { getUsernameValidationError } from "@/lib/auth/publicNames";

type AccountSettingsProps = {
  initialUsername: string;
  initialEmail: string;
  emailVerified: boolean;
  hasGoogle: boolean;
  passwordEnabled: boolean;
  googleDeleteVerified: boolean;
  googleStatus?: string;
  deletionProtected?: boolean;
};

export default function AccountSettings({ initialUsername, initialEmail, emailVerified, hasGoogle, passwordEnabled, googleDeleteVerified, googleStatus, deletionProtected = false }: AccountSettingsProps) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [message, setMessage] = useState<string | null>(googleStatus === "linked" ? "Google is connected to your existing account." : googleDeleteVerified ? "Google account verified. You can confirm deletion within five minutes." : null);
  const [error, setError] = useState<string | null>(googleStatus === "error" ? "Google verification could not finish. Please try again." : null);
  const [saving, setSaving] = useState(false);

  const request = async (method: "PATCH" | "DELETE", body: object) => {
    setSaving(true); setError(null); setMessage(null);
    try {
      const response = await fetch("/api/account", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await response.json()) as { error?: string; pendingEmail?: string | null };
      if (!response.ok) { setError(data.error ?? "Unable to update your account."); return false; }
      return true;
    } catch { setError("Unable to reach the server. Please try again."); return false; }
    finally { setSaving(false); }
  };

  return (
    <main className={`${styles.page} mx-auto max-w-3xl px-6 py-10 sm:px-8`}>
      <Link href="/dashboard" className="text-sm font-semibold text-blue-600">← Dashboard</Link>
      <div className={`${styles.hero} mt-5`}><div className={styles.icon}><Settings2 size={25} aria-hidden="true" /></div><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Account</p><h1 className="mt-2 text-4xl font-bold">Account settings</h1><p className="mt-3 text-sm leading-6 text-slate-500">Manage your profile, recovery options, and account security.</p></div>

      {message ? <p className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">{message}</p> : null}
      {error ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}

      <section className={`${styles.card} mt-7 rounded-2xl border bg-white p-6 shadow-sm`}><h2 className="text-xl font-bold"><UserRound size={20} aria-hidden="true" />Username</h2><p className="mt-1 text-sm text-slate-500">Lowercase letters, numbers, and underscores only.</p><input aria-label="Username" maxLength={20} value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="mt-4 w-full rounded-xl border p-3" /><button disabled={saving || username === initialUsername} onClick={async () => { const nameError = getUsernameValidationError(username.trim().toLowerCase()); if (nameError) { setError(nameError); return; } if (await request("PATCH", { action: "username", username })) { setMessage("Username changed successfully. It will update across the site shortly."); router.refresh(); } }} className={`${styles.primary} mt-4 rounded-xl px-5 py-3 font-semibold text-white disabled:opacity-40`}>Change username</button></section>

      <section className={`${styles.card} mt-5 rounded-2xl border bg-white p-6`}>
        <h2 className="text-xl font-bold"><LockKeyhole size={20} aria-hidden="true" />Google sign-in</h2>
        {hasGoogle ? <p className="mt-3 text-sm text-slate-600">Google is connected. You can use it to sign in to this account.</p> : <div className="mt-4 space-y-3">
          <label htmlFor="link-password" className="block text-sm font-semibold">Current password</label>
          <input id="link-password" type="password" autoComplete="current-password" value={linkPassword} onChange={(event) => setLinkPassword(event.target.value)} className="w-full rounded-lg border p-3" />
          <GoogleButton mode="link" currentPassword={linkPassword} disabled={saving || !linkPassword} />
        </div>}
        {!passwordEnabled && <><p className="mt-3 text-sm text-slate-600">Sign-in email: <span className="break-all">{initialEmail}</span></p><p className="mt-2 text-sm text-slate-600">Password and email security are managed in your Google account.</p></>}
      </section>

      {passwordEnabled && <section className={`${styles.card} mt-5 rounded-2xl border bg-white p-6 shadow-sm`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-bold"><Mail size={20} aria-hidden="true" />Recovery email</h2><p className="mt-1 text-sm text-slate-500">Add an email so you can recover your account without administrator help.</p></div>
          {initialEmail ? <span className={`rounded-full px-3 py-1 text-xs font-bold ${emailVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>{emailVerified ? "Verified" : "Confirmation pending"}</span> : null}
        </div>
        <label className="mt-4 block text-sm font-semibold">Email address</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 w-full rounded-xl border p-3" placeholder="you@example.com" />
        <label className="mt-4 block text-sm font-semibold">Current password</label>
        <input type="password" value={emailPassword} onChange={(event) => setEmailPassword(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border p-3" placeholder="Confirm your password" />
        <button disabled={saving || !emailPassword || !email.includes("@") || email === initialEmail} onClick={async () => { if (await request("PATCH", { action: "email", email, currentPassword: emailPassword })) { setEmailPassword(""); setMessage("Email submitted. Check that inbox and confirm the address to finish linking it."); router.refresh(); } }} className={`${styles.primary} mt-4 rounded-xl px-5 py-3 font-semibold text-white disabled:opacity-40`}>{initialEmail ? "Change recovery email" : "Add recovery email"}</button>
      </section>}

      {passwordEnabled && <section className={`${styles.card} mt-5 rounded-2xl border bg-white p-6 shadow-sm`}><h2 className="text-xl font-bold"><LockKeyhole size={20} aria-hidden="true" />Password</h2><p className="mt-1 text-sm text-slate-500">Confirm your current password, then use at least {MIN_PASSWORD_LENGTH} characters for the new one.</p><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" className="mt-4 w-full rounded-xl border p-3" placeholder="Current password" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="mt-3 w-full rounded-xl border p-3" placeholder="New password" /><button disabled={saving || !currentPassword || Boolean(getPasswordValidationError(password))} onClick={async () => { if (await request("PATCH", { action: "password", password, currentPassword })) { setPassword(""); setCurrentPassword(""); setMessage("Password changed successfully."); } }} className={`${styles.primary} mt-4 rounded-xl px-5 py-3 font-semibold text-white disabled:opacity-40`}>Change password</button></section>}

      {deletionProtected ? <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Protected account</h2><p className="mt-2 text-sm text-slate-600">Admin and owner accounts cannot be deleted. Contact the owner to arrange a role change first.</p></section> : <section className={`${styles.danger} mt-8 rounded-2xl border border-red-200 bg-red-50 p-6`}><h2 className="text-xl font-bold text-red-800">Delete account</h2><p className="mt-2 text-sm text-red-700">This permanently deletes your account, progress, bookmarks, trainer history, challenge history, multiplayer profile, and feedback. This cannot be undone.</p>
        {passwordEnabled ? <><label htmlFor="delete-password" className="mt-4 block text-sm font-semibold text-red-900">Current password</label><input id="delete-password" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-red-300 bg-white p-3" /></> : <div className="mt-4"><GoogleButton mode="verify-delete" disabled={saving} /></div>}
        <label htmlFor="delete-confirmation" className="mt-4 block text-sm font-semibold text-red-900">Type DELETE to confirm</label><input id="delete-confirmation" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} className="mt-2 w-full rounded-xl border border-red-300 bg-white p-3" />
        <button disabled={saving || (passwordEnabled ? !deletePassword : !googleDeleteVerified) || confirmation !== "DELETE"} onClick={async () => { if (await request("DELETE", { confirmation, currentPassword: deletePassword })) { router.replace("/"); router.refresh(); } }} className="mt-4 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white disabled:opacity-40">Permanently delete account</button>
      </section>}
    </main>
  );
}
