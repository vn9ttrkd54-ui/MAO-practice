import type {
  ChallengeLeaderboardEntry,
  ChallengeUserStatistics,
} from "@/types/challenge";

export default function ChallengePersonalStats({
  statistics,
  position,
}: {
  statistics: ChallengeUserStatistics;
  position: ChallengeLeaderboardEntry | null;
}) {
  const metrics = [
    ["Current Streak", `${statistics.currentStreak} 🔥`],
    ["Longest Streak", statistics.longestStreak.toString()],
    ["Completed", statistics.totalChallenges.toString()],
    ["Correct", statistics.correctChallenges.toString()],
    ["Accuracy", `${statistics.accuracy.toFixed(1)}%`],
  ];

  return (
    <section className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-5 shadow-[0_12px_30px_rgba(17,24,39,0.16)]">
      <div className="border-b border-slate-300 pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Your Challenge Record
          </p>
          <h2 className="mt-1 truncate text-xl font-bold">
            {position ? `#${position.rank} · ${position.username}` : "Not ranked yet"}
          </h2>
        </div>
        {!position && (
          <p className="mt-2 text-sm text-slate-600">
            Complete a Challenge while signed in to enter the rankings.
          </p>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-300 bg-white p-3 last:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </dt>
            <dd className="mt-1 text-lg font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
