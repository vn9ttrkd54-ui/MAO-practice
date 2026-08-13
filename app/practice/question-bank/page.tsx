import Link from "next/link";

import { questions } from "@/data/questions";
import type { Division } from "@/types/question";

const divisions: Array<{ name: Division; slug: string; accent: string; surface: string; border: string }> = [
  {
    name: "Mu",
    slug: "mu",
    accent: "linear-gradient(135deg, #2563eb, #4338ca)",
    surface: "linear-gradient(145deg, #eff6ff 0%, #ffffff 55%, #eef2ff 100%)",
    border: "#bfdbfe",
  },
  {
    name: "Alpha",
    slug: "alpha",
    accent: "linear-gradient(135deg, #7c3aed, #7e22ce)",
    surface: "linear-gradient(145deg, #faf5ff 0%, #ffffff 55%, #f3e8ff 100%)",
    border: "#ddd6fe",
  },
  {
    name: "Theta",
    slug: "theta",
    accent: "linear-gradient(135deg, #059669, #0f766e)",
    surface: "linear-gradient(145deg, #ecfdf5 0%, #ffffff 55%, #ccfbf1 100%)",
    border: "#a7f3d0",
  },
];

export default function QuestionBankPage() {
  return (
    <main className="min-h-screen bg-[#e5e7eb] px-5 py-10 pb-16 sm:px-8 sm:py-16 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="font-bold uppercase tracking-[0.22em] text-blue-600">Practice library</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Choose your division</h1>
        </div>

        <div
          className="mt-12 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}
        >
          {divisions.map((division) => {
            const count = questions.filter((question) => question.division === division.name).length;
            return (
              <Link
                key={division.name}
                href={`/practice/question-bank/${division.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border-2 shadow-xl shadow-slate-900/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                style={{ minHeight: "330px", background: division.surface, borderColor: division.border }}
              >
                <div className="h-2" style={{ background: division.accent }} />
                <div className="flex flex-1 flex-col" style={{ padding: "34px" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-h-14 items-center justify-center rounded-2xl px-5 text-xl font-black text-white shadow-lg" style={{ background: division.accent }}>{division.name}</div>
                    <span className="shrink-0 rounded-full border border-white/80 bg-white/75 px-3 py-1 text-sm font-bold text-slate-600 shadow-sm backdrop-blur">{count} questions</span>
                  </div>
                  <span className="mt-auto flex w-full items-center justify-center rounded-xl px-5 py-3.5 font-bold text-white shadow-md transition group-hover:-translate-y-0.5 group-hover:shadow-lg" style={{ background: division.accent, marginTop: "72px" }}>
                    Explore {division.name}<span className="ml-2 transition group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
