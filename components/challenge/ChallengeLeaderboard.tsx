import type { ChallengeLeaderboardEntry } from "@/types/challenge";

export default function ChallengeLeaderboard({
  entries,
}: {
  entries: ChallengeLeaderboardEntry[];
}) {
  return (
    <section className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-5 shadow-[0_12px_30px_rgba(17,24,39,0.16)]">
      <div className="flex items-end justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Community
          </p>
          <h2 className="mt-1 text-xl font-bold">Top Challenge Streaks</h2>
        </div>
        <span className="text-2xl" aria-hidden="true">
          🏆
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-600">
          No saved Challenge streaks yet. Be the first to begin one.
        </p>
      ) : (
        <ol className="max-h-72 divide-y divide-slate-300 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <li
              key={entry.userId}
              className="items-center py-3"
              style={{ display: "grid", gridTemplateColumns: "40px minmax(0, 1fr) auto", columnGap: "10px" }}
            >
              <span className="font-bold text-slate-500">#{entry.rank}</span>
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
