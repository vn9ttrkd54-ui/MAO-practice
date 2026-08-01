import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function DashboardHeader() {
  return (
    <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Your MAO Progress
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Continue training, review your
            question-bank progress, and prepare for
            future competitive play.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/practice/trainer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Start Training
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/practice/question-bank"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Open Question Bank
            <BookOpen size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}