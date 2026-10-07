import { Clock3 } from "lucide-react";
import styles from "./trainer-session.module.css";

type TrainerStatsSidebarProps = {
  difficulty: number;
  questionSeconds: number;
  sessionSeconds: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  onEndSession: () => void;
};

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TrainerStatsSidebar({ difficulty, questionSeconds, sessionSeconds, correct, incorrect, giveUps, onEndSession }: TrainerStatsSidebarProps) {
  return (
    <section className={styles.stats}>
      <p className={styles.statsHeading}>Current question</p>
      <div className={styles.difficulty}>
        <p>Difficulty</p>
        <p aria-label={`Difficulty ${difficulty} out of 5`}>
          {"★".repeat(difficulty)}{"☆".repeat(Math.max(0, 5 - difficulty))}
        </p>
      </div>

      <div className={styles.times}>
        <TimeStat label="Question" seconds={questionSeconds} />
        <TimeStat label="Session" seconds={sessionSeconds} />
      </div>

      <p className={styles.statsHeading}>This session</p>
      <div>
        <StatRow label="Correct" value={correct} className={styles.correct} />
        <StatRow label="Incorrect" value={incorrect} className={styles.incorrect} />
        <StatRow label="Gave Up" value={giveUps} className={styles.gaveUp} />
      </div>

      <button type="button" onClick={onEndSession} className={styles.end}>End Session</button>
    </section>
  );
}

function TimeStat({ label, seconds }: { label: string; seconds: number }) {
  return (
    <div>
      <div className={styles.timeLabel}>
        <Clock3 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <p className={styles.time} aria-label={`${label} time ${formatTime(seconds)}`}>
        {formatTime(seconds)}
      </p>
    </div>
  );
}

function StatRow({ label, value, className }: { label: string; value: number; className: string }) {
  return <div className={`${styles.row} ${className}`}><span>{label}</span><span>{value}</span></div>;
}
