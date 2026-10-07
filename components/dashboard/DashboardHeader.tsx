import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { LevelProgress } from "@/types/level";
import styles from "./dashboard.module.css";

const POINTS_PER_LEVEL = 30;

export default function DashboardHeader({ username, level }: { username: string; level: LevelProgress }) {
  const progressPercent = Math.min(100, Math.round(level.progress / POINTS_PER_LEVEL * 100));
  const pointsRemaining = Math.max(0, POINTS_PER_LEVEL - level.progress);

  return <header>
    <div className={styles.greeting}>
      <div><p className={styles.eyebrow}>Your Dashboard</p><h1>Welcome back, {username}</h1></div>
      <div className={styles.actions}>
        <Link href="/practice/trainer" className={styles.primaryAction}>Start Training<ArrowRight size={16} aria-hidden="true" /></Link>
        <Link href="/practice/question-bank" className={styles.action}><BookOpen size={16} aria-hidden="true" />Open Question Bank</Link>
      </div>
    </div>
    <section className={styles.hero} aria-label="Trainer level progress">
      <div className={styles.levelRing} style={{ background: `conic-gradient(#f2b91c ${progressPercent}%, #ffffff35 0)` }} aria-hidden="true">
        <div><strong>{level.level}</strong><span>LEVEL</span></div>
      </div>
      <div className={styles.levelInfo}>
        <h2>Build toward your next level.</h2>
        <div className={styles.progressLabel}><span>Level {level.level} progress</span><span>{level.progress} / {POINTS_PER_LEVEL}</span></div>
        <div className={styles.levelTrack} role="progressbar" aria-label={`Level ${level.level} progress`} aria-valuemin={0} aria-valuemax={POINTS_PER_LEVEL} aria-valuenow={level.progress}>
          <div style={{ width: `${progressPercent}%` }} />
        </div>
        <p>{pointsRemaining === 0 ? "Your next correct answer will advance your level." : `${pointsRemaining} point${pointsRemaining === 1 ? "" : "s"} until Level ${level.level + 1}.`}</p>
      </div>
    </section>
  </header>;
}
