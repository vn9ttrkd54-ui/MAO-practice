"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import styles from "./trainer-session.module.css";

type TrainerTimerProps = {
  questionStartedAt: number;
  questionFinishedAt: number | null;
  sessionStartedAt: number;
};

type TrainerStatsSidebarProps = TrainerTimerProps & {
  difficulty: number;
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

export default function TrainerStatsSidebar({ difficulty, questionStartedAt, questionFinishedAt, sessionStartedAt, correct, incorrect, giveUps, onEndSession }: TrainerStatsSidebarProps) {
  return (
    <section className={styles.stats}>
      <p className={styles.statsHeading}>Current question</p>
      <div className={styles.difficulty}>
        <p>Difficulty</p>
        <p aria-label={`Difficulty ${difficulty} out of 5`}>
          {"★".repeat(difficulty)}{"☆".repeat(Math.max(0, 5 - difficulty))}
        </p>
      </div>

      <TrainerTimers
        key={questionStartedAt}
        questionStartedAt={questionStartedAt}
        questionFinishedAt={questionFinishedAt}
        sessionStartedAt={sessionStartedAt}
      />

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

// Keep clock ticks below the question so unchanged math and session results
// aren't re-rendered/recalculated every second. Timestamps still survive refresh.
function TrainerTimers({ questionStartedAt, questionFinishedAt, sessionStartedAt }: TrainerTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.times}>
      <TimeStat label="Question" seconds={Math.max(0, Math.floor(((questionFinishedAt ?? now) - questionStartedAt) / 1_000))} />
      <TimeStat label="Session" seconds={Math.max(0, Math.floor((now - sessionStartedAt) / 1_000))} />
    </div>
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
