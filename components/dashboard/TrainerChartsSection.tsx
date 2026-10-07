import type { TrainerHistorySummary } from "@/lib/dashboard";
import DashboardSection from "./DashboardSection";
import styles from "./dashboard.module.css";

function formatSessionDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(timestamp));
}
function formatSessionCount(count: number) { return `${count} ${count === 1 ? "session" : "sessions"}`; }

export default function TrainerChartsSection({ trainer }: { trainer: TrainerHistorySummary }) {
  return <DashboardSection title="Trainer Trends" label="Trends" theme="trends">
    <div className={styles.charts}>
      <div className={styles.accuracy}>
        <div className={styles.chartHeading}><h3>Recent Session Accuracy</h3><p>Last {formatSessionCount(trainer.recentSessionAccuracy.length)}</p></div>
        {trainer.recentSessionAccuracy.length > 0 ? <div className={styles.accuracyChart} role="img"
          aria-label={`Recent session accuracy: ${trainer.recentSessionAccuracy.map(session => `${formatSessionDate(session.endedAt)}: ${session.accuracy}%`).join(", ")}`}>
          {trainer.recentSessionAccuracy.map((session, index) => <div key={session.id} className={styles.chartColumn}>
            <span>{session.accuracy}%</span>
            <div className={styles.barSpace}><div className={session.accuracy === 0 ? styles.zeroBar : styles.accuracyBar}
              style={{ height: `${Math.min(100, session.accuracy)}%` }} title={`${session.accuracy}% accuracy across ${session.questionsAnswered} questions`} /></div>
            <span className={styles.chartDate}>{formatSessionDate(session.endedAt)}</span>
            <span className={styles.sessionLabel}>S{index + 1}</span>
          </div>)}
        </div> : <p className={styles.emptyChart}>Complete a Trainer session to start building your accuracy trend.</p>}
      </div>
      <div className={styles.distribution}>
        <div className={styles.chartHeading}><h3>Sessions by Division</h3><p>Practice Distribution</p></div>
        {trainer.sessionsByDivision.map(item => {
          const share = trainer.sessionsCompleted > 0 ? Math.round(item.sessions / trainer.sessionsCompleted * 100) : 0;
          return <div key={item.division} className={`${styles.divisionRow} ${styles[item.division.toLowerCase()]}`}>
            <div><span>{item.division.toUpperCase()}</span><span>{formatSessionCount(item.sessions)} · {share}%</span></div>
            <div className={styles.divisionTrack}><div style={{ width: `${Math.min(100, share)}%` }} /></div>
          </div>;
        })}
      </div>
    </div>
  </DashboardSection>;
}
