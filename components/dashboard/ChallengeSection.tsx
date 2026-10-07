import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import DashboardSection from "./DashboardSection";
import StatCard from "./StatCard";
import styles from "./dashboard.module.css";

export default function ChallengeSection({ currentStreak, longestStreak }: { currentStreak: number; longestStreak: number }) {
  return <DashboardSection title="Challenge Streaks" label="Daily Challenge" theme="challenge"
    action={<Link href="/challenge" className={styles.action}>View today&apos;s Challenge<ArrowRight size={16} aria-hidden="true" /></Link>}>
    <div className={styles.streaks}>
      <span className={styles.streakIcon}><Flame size={24} aria-hidden="true" /></span>
      <StatCard label="Current Streak" value={`${currentStreak} ${currentStreak === 1 ? "day" : "days"}`} />
      <StatCard label="Longest Streak" value={`${longestStreak} ${longestStreak === 1 ? "day" : "days"}`} />
    </div>
  </DashboardSection>;
}
