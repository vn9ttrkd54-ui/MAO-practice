import type { ChallengeLeaderboardEntry } from "@/types/challenge";

export default function ChallengeLeaderboard({
  entries,
}: {
  entries: ChallengeLeaderboardEntry[];
}) {
  return (
    <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-end justify-between gap-4 border-b pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Community
          </p>
          <h2 className="mt-1 text-2xl font-bold">Top 20 Challenge Streaks</h2>
        </div>
        <span className="text-2xl" aria-hidden="true">
          🏆
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="py-8 text-center text-gray-600">
          No saved Challenge streaks yet. Be the first to begin one.
        </p>
      ) : (
        <ol className="divide-y">
          {entries.map((entry) => (
            <li
              key={entry.userId}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 py-4"
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
