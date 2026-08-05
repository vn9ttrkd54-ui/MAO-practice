import Link from "next/link";

import { questions } from "@/data/questions";
import type { Division } from "@/types/question";

const divisions: Array<{ name: Division; slug: string; description: string }> = [
  { name: "Mu", slug: "mu", description: "Calculus, advanced algebra, probability, and higher-level topics." },
  { name: "Alpha", slug: "alpha", description: "Algebra II, precalculus, sequences, functions, and related topics." },
  { name: "Theta", slug: "theta", description: "Geometry, algebra, counting, number theory, and foundational topics." },
];

export default function QuestionBankPage() {
  return (
    <main className="mx-auto max-w-7xl p-8">
      <p className="font-semibold uppercase tracking-[0.2em] text-blue-600">Practice</p>
      <h1 className="mt-2 text-4xl font-bold">Question Bank</h1>
      <p className="mt-3 text-gray-600">Choose a division to browse its questions and division-specific filters.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {divisions.map((division) => {
          const count = questions.filter((question) => question.division === division.name).length;
          return (
            <Link key={division.name} href={`/practice/question-bank/${division.slug}`} className="group rounded-2xl border-2 border-gray-900 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-600 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-3xl font-bold">{division.name}</h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{count} questions</span>
              </div>
              <p className="mt-4 min-h-20 leading-7 text-gray-600">{division.description}</p>
              <span className="mt-7 inline-flex font-semibold text-blue-600 group-hover:underline">Open {division.name} questions →</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
