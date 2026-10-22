import styles from "./challenge.module.css";
import { Flame } from "lucide-react";
import { getChallengeWeekDates } from "@/lib/challengeWeek";
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
  const weekDates = getChallengeWeekDates(statistics.asOfDate);
  const completedDates = new Set(statistics.completedDates);
  const metrics = [
    ["Longest Streak", statistics.longestStreak.toString()],
    ["Completed", statistics.totalChallenges.toString()],
    ["Correct", statistics.correctChallenges.toString()],
    ["Accuracy", `${statistics.accuracy.toFixed(1)}%`],
  ];

  return (
    <section className={`${styles.panel} ${styles.record}`} aria-label="Your challenge record">
      <div className={styles.identity}>
        <div>
          <p className={styles.eyebrow}>
            Your Challenge Record
          </p>
          <h2 className={styles.username}>
            {position ? `#${position.rank} · ${position.username}` : "Not ranked yet"}
          </h2>
        </div>
        {!position && (
          <p className={styles.unranked}>
            Complete a Challenge while signed in to enter the rankings.
          </p>
        )}
      </div>

      <div className={styles.streak}><Flame size={22} aria-hidden="true" /><div><strong>{statistics.currentStreak}</strong><span>Current streak</span></div></div>
      <div className={styles.week} aria-label="Current New York week">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
          const today = weekDates[index] === statistics.asOfDate;
          const completed = completedDates.has(weekDates[index]);
          return <span key={day}
            className={[today && styles.today, completed && styles.completed].filter(Boolean).join(" ")}
            aria-current={today ? "date" : undefined}
            aria-label={`${day}${today ? ", today (New York)" : ""}, ${completed ? "completed" : "not completed"}`}
          >{day[0]}</span>;
        })}
      </div>
      <dl className={styles.metrics}>
        {metrics.map(([label, value]) => (
          <div key={label}>
            <dt>
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
