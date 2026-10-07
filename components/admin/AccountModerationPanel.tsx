"use client";
import { useState, type FormEvent } from "react";
import { type ModerationAction, type ModerationAuditEntry, type ModerationState } from "@/lib/auth/moderation";

type Props = { targetId: string; targetRole: string; actorId: string; actorRole: "admin" | "owner"; googleOnly: boolean; state: ModerationState; audit: ModerationAuditEntry[] };
const labels: Record<ModerationAction, string> = {
  require_name_change: "Require a new username", suspend: "Suspend account", restore: "Restore account access", delete: "Permanently delete account",
};
export default function AccountModerationPanel({ targetId, targetRole, actorId, actorRole, googleOnly, state, audit }: Props) {
  const [action, setAction] = useState<ModerationAction>(state.suspended ? "restore" : state.requires_name_change ? "suspend" : "require_name_change");
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Keep the same identifier after an ambiguous network failure. A committed
  // action must never execute twice if the response was lost.
  const [requestId, setRequestId] = useState<string | null>(null);
  const protectedAccount = targetRole !== "user" || actorId === targetId;
  async function verifyGoogle() {
    setError(null); setBusy(true);
    try {
      const response = await fetch("/api/auth/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "verify-moderation", targetId }) });
      const body = await response.json();
      if (!response.ok || !body.url) throw new Error(body.error ?? "Unable to start verification.");
      window.location.assign(body.url);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Verification failed."); setBusy(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (protectedAccount || busy) return;
    setBusy(true); setError(null);
    const id = requestId ?? crypto.randomUUID();
    setRequestId(id);
    try {
      const response = await fetch(`/api/admin/users/${targetId}/moderation`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason, currentPassword: password, version: state.version, requestId: id }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "The action was not completed.");
      window.location.assign(action === "delete" ? "/admin/users?deleted=1" : `/admin/users/${targetId}?moderated=1`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to confirm the result. Refresh before retrying."); }
    finally { setPassword(""); setBusy(false); }
  }
  const inputClass = "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3";
  return <section className="mt-8 rounded-2xl border border-blue-200 bg-white p-6" aria-labelledby="moderation-heading">
    <h2 id="moderation-heading" className="text-2xl font-bold">Account moderation</h2>
    <p className="mt-3">Status: {state.suspended ? "Suspended" : "Active"}{state.requires_name_change ? " · New username required" : ""}</p>
    {state.previous_login_username ? <p className="mt-2 break-all text-sm text-slate-600">Previous login name (administrators only): {state.previous_login_username}</p> : null}
    {protectedAccount ? <p className="mt-4 text-slate-600">Admin, owner, and your own account are protected from these actions.</p> : <form onSubmit={submit} className="mt-6 space-y-5">
      <div><label htmlFor="moderation-action" className="block font-semibold">Action</label><select id="moderation-action" className={inputClass} disabled={busy} value={action} onChange={event => { setAction(event.target.value as ModerationAction); setRequestId(null); }}>
        {!state.requires_name_change ? <option value="require_name_change">{labels.require_name_change}</option> : null}
        <option value={state.suspended ? "restore" : "suspend"}>{state.suspended ? labels.restore : labels.suspend}</option>
        {actorRole === "owner" ? <option value="delete">{labels.delete}</option> : null}
      </select></div>
      <p className={`rounded-lg border p-4 ${action === "delete" ? "border-red-200 bg-red-50 text-red-800" : "border-blue-100 bg-blue-50 text-slate-700"}`}>
        {action === "require_name_change" ? "The public name becomes a neutral placeholder immediately. Their old login still works until they choose a new name. Progress and passwords are preserved. This can also be tested with an ordinary allowed username."
          : action === "delete" ? "Permanent and not reversible here. This deletes this user's account and its linked personal records. Other players' accounts and games are preserved. A private moderation audit is retained. Consider suspension first."
          : action === "suspend" ? "Stops this account from using signed-in features, including existing sessions. Progress is kept. You can restore access later."
          : "Restores access. If a new name is still required, they must choose it before playing."}
      </p>
      <label className="block font-semibold">Reason (private audit record)<textarea required minLength={5} maxLength={500} className={inputClass} disabled={busy} value={reason} onChange={event => { setReason(event.target.value); setRequestId(null); }} /></label>
      {googleOnly ? <div><button type="button" onClick={verifyGoogle} disabled={busy} className="rounded-lg border border-blue-300 px-4 py-3 font-semibold text-blue-700">Verify with Google</button><p className="mt-2 text-sm text-slate-600">Verification lasts five minutes and can be used once. Verify first, then fill out this form.</p></div>
        : <label className="block font-semibold">Your current password<input type="password" autoComplete="current-password" required maxLength={1024} className={inputClass} value={password} onChange={event => setPassword(event.target.value)} /></label>}
      {error ? <p role="alert" className="text-red-700">{error}</p> : null}
      <button disabled={busy || reason.trim().length < 5} className={`rounded-lg px-5 py-3 font-semibold text-white disabled:opacity-40 ${action === "delete" ? "bg-red-700" : "bg-blue-700"}`}>{busy ? "Checking…" : labels[action]}</button>
    </form>}
    <h3 className="mt-8 text-lg font-bold">Recent moderation history</h3>
    {audit.length ? <ol className="mt-3 space-y-3">{audit.map(entry => <li key={entry.request_id} className="rounded-lg bg-slate-50 p-3 text-sm"><p className="font-semibold">{entry.action.replaceAll("_", " ")} · {new Date(entry.created_at).toLocaleString()}</p><p className="mt-1 whitespace-pre-wrap break-words">{entry.reason}</p><p className="mt-1 break-all text-xs text-slate-500">Actor: {entry.actor_id}</p></li>)}</ol> : <p className="mt-3 text-sm text-slate-500">No moderation actions recorded.</p>}
  </section>;
}
