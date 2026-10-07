import styles from "./challenge.module.css";
import { Trophy } from "lucide-react";
import type { ChallengeLeaderboardEntry } from "@/types/challenge";

export default function ChallengeLeaderboard({
  entries,
}: {
  entries: ChallengeLeaderboardEntry[];
}) {
  return (
    <section className={`${styles.panel} ${styles.leaderboard}`}>
      <div className="flex items-end justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <p className={styles.eyebrow}>
            Community
          </p>
          <h2 className={styles.leaderTitle}>Top Challenge Streaks</h2>
        </div>
        <Trophy size={20} className={styles.trophy} aria-hidden="true" />
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
