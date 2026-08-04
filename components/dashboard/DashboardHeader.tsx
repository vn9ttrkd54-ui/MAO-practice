import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

import type { LevelProgress } from "@/types/level";

const POINTS_PER_LEVEL = 30;

export default function DashboardHeader({
  username,
  level,
}: {
  username: string;
  level: LevelProgress;
}) {
  const progressPercent = Math.min(
    100,
    Math.round(
      (level.progress / POINTS_PER_LEVEL) * 100
    )
  );

  const pointsRemaining = Math.max(
    0,
    POINTS_PER_LEVEL - level.progress
  );

  return (
    <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-slate-200">
            <Sparkles size={15} aria-hidden="true" />
            Level {level.level}
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back, {username}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Continue training, review your progress,
            and build toward your next level.
          </p>

          <div className="mt-7 max-w-xl">
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-white">
                Level progress
              </span>

              <span className="text-slate-300">
                {level.progress} / {POINTS_PER_LEVEL}
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-label={`Level ${level.level} progress`}
              aria-valuemin={0}
              aria-valuemax={POINTS_PER_LEVEL}
              aria-valuenow={level.progress}
            >
              <div
                className="h-full rounded-full bg-white transition-[width] duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {pointsRemaining === 0
                ? "Your next correct answer will advance your level."
                : `${pointsRemaining} point${
                    pointsRemaining === 1 ? "" : "s"
                  } until Level ${level.level + 1}.`}
            </p>
          </div>
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
