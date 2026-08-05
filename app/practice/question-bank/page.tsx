import Link from "next/link";

import { questions } from "@/data/questions";
import type { Division } from "@/types/question";

const divisions: Array<{ name: Division; slug: string; description: string; accent: string }> = [
  { name: "Mu", slug: "mu", description: "Calculus, advanced algebra, probability, and higher-level topics.", accent: "linear-gradient(135deg, #2563eb, #4338ca)" },
  { name: "Alpha", slug: "alpha", description: "Algebra II, precalculus, sequences, functions, and related topics.", accent: "linear-gradient(135deg, #7c3aed, #7e22ce)" },
  { name: "Theta", slug: "theta", description: "Geometry, algebra, counting, number theory, and foundational topics.", accent: "linear-gradient(135deg, #059669, #0f766e)" },
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
            <Link key={division.name} href={`/practice/question-bank/${division.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="h-2" style={{ background: division.accent }} />
              <div className="p-7"><div className="flex items-start justify-between gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg" style={{ background: division.accent }}>{division.name[0]}</div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{count} questions</span></div>
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
