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
    <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your Challenge Record
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {position ? `#${position.rank} · ${position.username}` : "Not ranked yet"}
          </h2>
        </div>
        {!position && (
          <p className="text-sm text-gray-500">
            Complete a Challenge while signed in to enter the rankings.
          </p>
        )}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {label}
            </dt>
            <dd className="mt-2 text-xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
