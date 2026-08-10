"use client";

import Link from "next/link";
import { useState } from "react";

import type { FeedbackKind } from "@/types/feedback";
import type { Division } from "@/types/question";

type FeedbackFormProps = {
  kind: FeedbackKind;
  questionId?: number;
  division?: Division;
  onSubmitted?: () => void;
};

export default function FeedbackForm({
  kind,
  questionId,
  division,
  onSubmitted,
}: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, questionId, division, message }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to submit feedback.");
        return;
      }

      setSubmitted(true);
      setMessage("");
      onSubmitted?.();
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
        <p className="font-bold">Thank you—your feedback was submitted.</p>
        <p className="mt-1 text-sm">An administrator can now review it.</p>
      </div>
    );
  }

  return (
    <div>
      {kind === "question_report" && questionId ? (
        <p className="mb-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
          Linked to {division} question ID {questionId}
        </p>
      ) : null}

      <label htmlFor="feedback-message" className="font-semibold">
        {kind === "question_report"
          ? "Explain what is wrong or what should change"
          : "What would you like to suggest?"}
      </label>
      <textarea
        id="feedback-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={2000}
        rows={7}
        placeholder={
          kind === "question_report"
            ? "Describe the typo, unclear wording, incorrect answer, solution issue, or suggested improvement..."
            : "Share an idea or report an issue with accounts, practice, challenges, multiplayer, or anything else..."
        }
        className="mt-2 w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Minimum 10 characters</span>
        <span>{message.length}/2000</span>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error} {error.includes("sign in") ? <Link href="/login" className="font-bold underline">Log in</Link> : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={saving || message.trim().length < 10}
        className="mt-5 rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
