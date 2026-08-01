import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";

interface QuestionBankSectionProps {
  questionBank: {
    solved: number;
    attempted: number;
    newQuestions: number;
    bookmarked: number;
  };
}

export default function QuestionBankSection({
  questionBank,
}: QuestionBankSectionProps) {
  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
            <BookOpen size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Question Bank
            </h2>

            <p className="mt-1 text-gray-600">
              Track solved, attempted, new, and
              bookmarked questions.
            </p>
          </div>
        </div>

        <Link
          href="/practice/question-bank"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
        >
          Open Question Bank
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Solved"
          value={questionBank.solved}
        />

        <StatCard
          label="Attempted"
          value={questionBank.attempted}
        />

        <StatCard
          label="New"
          value={questionBank.newQuestions}
        />

        <StatCard
          label="Bookmarked"
          value={questionBank.bookmarked}
        />
      </div>
    </section>
  );
}
