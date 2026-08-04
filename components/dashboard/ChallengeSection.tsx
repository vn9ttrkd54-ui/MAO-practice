import Link from "next/link";
import { ArrowRight, Flame, Trophy } from "lucide-react";

export default function ChallengeSection({
  currentStreak,
  longestStreak,
}: {
  currentStreak: number;
  longestStreak: number;
}) {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Daily Challenge
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
            Challenge Streaks
          </h2>
        </div>

        <Link
          href="/challenge"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:gap-2 hover:text-orange-700"
        >
          View today&apos;s Challenge
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                {currentStreak} {currentStreak === 1 ? "day" : "days"}
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-3 text-orange-700">
              <Flame size={22} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Longest Streak</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                {longestStreak} {longestStreak === 1 ? "day" : "days"}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
              <Trophy size={22} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
