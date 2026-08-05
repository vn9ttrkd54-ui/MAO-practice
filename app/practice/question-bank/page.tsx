import Link from "next/link";

import { questions } from "@/data/questions";
import type { Division } from "@/types/question";

const divisions: Array<{ name: Division; slug: string; description: string; accent: string; glow: string }> = [
  { name: "Mu", slug: "mu", description: "Calculus, advanced algebra, probability, and higher-level topics.", accent: "from-blue-600 to-indigo-700", glow: "group-hover:shadow-blue-200" },
  { name: "Alpha", slug: "alpha", description: "Algebra II, precalculus, sequences, functions, and related topics.", accent: "from-violet-600 to-purple-700", glow: "group-hover:shadow-violet-200" },
  { name: "Theta", slug: "theta", description: "Geometry, algebra, counting, number theory, and foundational topics.", accent: "from-emerald-600 to-teal-700", glow: "group-hover:shadow-emerald-200" },
];

export default function QuestionBankPage() {
  return (
    <main className="min-h-full bg-gradient-to-b from-slate-50 to-white px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl"><p className="font-bold uppercase tracking-[0.22em] text-blue-600">Practice library</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Choose your division</h1><p className="mt-4 text-lg leading-8 text-slate-600">Each question bank has its own topics, methods, progress tracking, and saved filters.</p></div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {divisions.map((division) => {
          const count = questions.filter((question) => question.division === division.name).length;
          return (
            <Link key={division.name} href={`/practice/question-bank/${division.slug}`} className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${division.glow}`}>
              <div className={`h-2 bg-gradient-to-r ${division.accent}`} />
              <div className="p-7"><div className="flex items-start justify-between gap-4"><div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${division.accent} text-2xl font-black text-white shadow-lg`}>{division.name[0]}</div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{count} questions</span></div>
              <h2 className="mt-7 text-3xl font-bold">{division.name}</h2>
              <p className="mt-3 min-h-24 leading-7 text-slate-600">{division.description}</p>
              <span className="mt-7 inline-flex items-center font-bold text-blue-600 transition group-hover:translate-x-1">Explore {division.name} <span className="ml-2">→</span></span></div>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm"><span className="font-bold text-slate-900">Your progress follows you.</span> Solved, attempted, and bookmarked questions stay connected to your account across every division.</div>
      </div>
    </main>
  );
}
