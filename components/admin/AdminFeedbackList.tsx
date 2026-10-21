"use client";

import styles from "@/components/settings/settings.module.css";
import { useState } from "react";
import type { FeedbackKind } from "@/types/feedback";

type AdminRequest = {
  id: string;
  kind: FeedbackKind;
  username: string;
  questionId: number | null;
  division: string | null;
  questionLabel: string | null;
  message: string;
  createdAt: string;
};

export default function AdminFeedbackList({ initialRequests }: { initialRequests: AdminRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [resolving, setResolving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (id: string) => {
    setResolving(id); setError(null);
    try {
      const response = await fetch("/api/admin/feedback", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) { setError(data.error ?? "Unable to resolve this request."); return; }
      setRequests((current) => current.filter((request) => request.id !== id));
    } finally { setResolving(null); }
  };

  if (!requests.length) return <div className="mt-8 rounded-2xl border border-dashed bg-slate-50 p-10 text-center text-slate-500">No open feedback requests.</div>;

  return (
    <div className="mt-8 space-y-4">
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}
      {requests.map((request) => (
        <article key={request.id} className={`${styles.card} rounded-2xl border bg-white p-6 shadow-sm`}>
          <div className="flex flex-wrap items-start justify-between gap-4"><div><span className={`rounded-full px-3 py-1 text-xs font-bold ${request.kind === "question_report" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}>{request.kind === "question_report" ? "Question report" : request.kind === "question_submission" ? "Question submission" : "General suggestion"}</span><p className="mt-3 font-bold">{request.username}</p><p className="text-sm text-slate-500">{new Date(request.createdAt).toLocaleString()}</p></div><button disabled={resolving === request.id} onClick={() => void resolve(request.id)} className={`${styles.primary} rounded-xl px-5 py-2.5 font-semibold text-white disabled:opacity-50`}>{resolving === request.id ? "Resolving..." : "Resolve"}</button></div>
          {request.kind === "question_submission" ? <p className="mt-4 text-sm font-semibold text-blue-700">Daily Challenge submission - {request.division}</p> : null}
          {request.questionLabel ? <div className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-900">{request.questionLabel}<span className="ml-2 font-normal text-orange-700">ID {request.questionId}</span></div> : null}
          <p className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-slate-50/80 p-4 leading-7 text-slate-700">{request.message}</p>
        </article>
      ))}
    </div>
  );
}
