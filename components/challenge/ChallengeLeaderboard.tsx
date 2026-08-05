import type { ChallengeLeaderboardEntry } from "@/types/challenge";

export default function ChallengeLeaderboard({
  entries,
}: {
  entries: ChallengeLeaderboardEntry[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Community
          </p>
          <h2 className="mt-1 text-xl font-bold">Top Challenge Streaks</h2>
        </div>
        <span className="text-2xl" aria-hidden="true">
          🏆
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600">
          No saved Challenge streaks yet. Be the first to begin one.
        </p>
      ) : (
        <ol className="max-h-72 divide-y overflow-y-auto pr-1">
          {entries.map((entry) => (
            <li
              key={entry.userId}
              className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 py-3"
            >
              <span className="font-bold text-gray-500">#{entry.rank}</span>
              <span className="truncate font-semibold">{entry.username}</span>
              <span className="text-right font-bold">
                {entry.currentStreak} 🔥
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
