"use client";

import { Flag, X } from "lucide-react";
import { useState } from "react";

import FeedbackForm from "@/components/feedback/FeedbackForm";
import type { Division } from "@/types/question";
import styles from "@/components/practice/question-detail.module.css";

export default function QuestionReportButton({
  questionId,
  division,
  compact = false,
}: {
  questionId: number;
  division: Division;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={compact ? styles.iconButton : "inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"}
        aria-label="Report typo / suggest change"
      >
        <Flag size={16} aria-hidden="true" />
        <span className={compact ? styles.tooltip : undefined}>Report typo / suggest change</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <section className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Question feedback</p>
                <h2 className="mt-1 text-2xl font-bold">Report this question</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="mt-6">
              <FeedbackForm kind="question_report" questionId={questionId} division={division} />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
