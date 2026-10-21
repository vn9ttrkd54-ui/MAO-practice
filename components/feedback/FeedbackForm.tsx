"use client";

import Link from "next/link";
import { useId, useState } from "react";

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
  const messageId = useId();
  const divisionId = useId();
  const isQuestionSubmission = kind === "question_submission";
  const [submissionDivision, setSubmissionDivision] = useState<Division | "">("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (saving) return;
    if (isQuestionSubmission && !submissionDivision) {
      setError("Choose a division for your problem.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, questionId, division: isQuestionSubmission ? submissionDivision : division, message }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to submit feedback.");
        return;
      }

      setSubmitted(true);
      setMessage("");
      onSubmitted?.();
    } catch {
      setError("Unable to submit feedback. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
        <p className="font-bold">{isQuestionSubmission ? "Thank you, your problem was submitted." : "Thank you—your feedback was submitted."}</p>
        <p className="mt-1 text-sm">An administrator can now review it.</p>
      </div>
    );
  }

  return (
    <div>
      {isQuestionSubmission ? (
        <div className="mb-6">
          <label htmlFor={divisionId} className="font-semibold">Division</label>
          <select
            id={divisionId}
            name="division"
            required
            value={submissionDivision}
            disabled={saving}
            onChange={(event) => setSubmissionDivision(event.target.value as Division | "")}
            className="mt-2 block min-h-11 w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <option value="" disabled>Select a division</option>
            <option value="Mu">Mu - Calculus</option>
            <option value="Alpha">Alpha - Precalculus</option>
            <option value="Theta">Theta - Algebra 2</option>
          </select>
        </div>
      ) : null}
      <label htmlFor={messageId} className="font-semibold">
        {isQuestionSubmission ? "Problem, answer, and solution" : kind === "question_report"
          ? "Explain what is wrong or what should change"
          : "What would you like to suggest?"}
      </label>
      <textarea
        id={messageId}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={2000}
        disabled={saving}
        rows={7}
        placeholder={
          isQuestionSubmission
            ? "Problem:\n\nAnswer:\n\nDetailed solution:\n\nSource or author credit:"
            : kind === "question_report"
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
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error} {error.includes("sign in") ? <Link href="/login" className="font-bold underline">Log in</Link> : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={saving || message.trim().length < 10 || (isQuestionSubmission && !submissionDivision)}
        className="mt-5 rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "Submitting..." : isQuestionSubmission ? "Submit Question" : "Submit"}
      </button>
    </div>
  );
}
