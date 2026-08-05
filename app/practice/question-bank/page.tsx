import Link from "next/link";

import { questions } from "@/data/questions";
import type { Division } from "@/types/question";

const divisions: Array<{ name: Division; slug: string; accent: string }> = [
  { name: "Mu", slug: "mu", accent: "linear-gradient(135deg, #2563eb, #4338ca)" },
  { name: "Alpha", slug: "alpha", accent: "linear-gradient(135deg, #7c3aed, #7e22ce)" },
  { name: "Theta", slug: "theta", accent: "linear-gradient(135deg, #059669, #0f766e)" },
];

export default function QuestionBankPage() {
  return (
    <main className="min-h-full bg-gradient-to-b from-slate-50 to-white px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl"><p className="font-bold uppercase tracking-[0.22em] text-blue-600">Practice library</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Choose your division</h1></div>

      <div
        className="mt-12 grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}
      >
        {divisions.map((division) => {
          const count = questions.filter((question) => question.division === division.name).length;
          return (
            <Link key={division.name} href={`/practice/question-bank/${division.slug}`} className="group flex min-h-64 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="h-2" style={{ background: division.accent }} />
              <div className="flex flex-1 flex-col" style={{ padding: "28px" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-h-14 items-center justify-center rounded-2xl px-5 text-xl font-black text-white shadow-lg" style={{ background: division.accent }}>{division.name}</div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{count} questions</span>
                </div>
                <span className="mt-auto flex w-full items-center justify-center rounded-xl px-5 py-3.5 font-bold text-white shadow-md transition group-hover:-translate-y-0.5 group-hover:shadow-lg" style={{ background: division.accent }}>Explore {division.name}<span className="ml-2 transition group-hover:translate-x-1">→</span></span>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </main>
  );
}
