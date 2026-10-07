import Link from "next/link";
import StatCard from "./StatCard";
import { RankIcon, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import styles from "./dashboard.module.css";

interface OverviewSectionProps {
  level: { level: number; progress: number };
  questionBank: { solved: number; bookmarked: number; totalQuestions: number };
  multiplayer: { rank: string; rating: number | null };
}

export default function OverviewSection({ level, questionBank, multiplayer }: OverviewSectionProps) {
  const completion = questionBank.totalQuestions > 0 ? Math.min(100, Math.round(questionBank.solved / questionBank.totalQuestions * 100)) : 0;
  return <section className={styles.overview} aria-label="Overall Progress">
    <StatCard label="Trainer Level" value={`Level ${level.level}`} detail={`${level.progress} / 30 progress · ${Math.round(level.progress / 30 * 100)}%`} />
    <StatCard label="Questions Solved" value={questionBank.solved} detail={`${completion}% complete · ${Math.max(0, questionBank.totalQuestions - questionBank.solved)} questions remaining`} />
    <div><StatCard label="Bookmarked" value={questionBank.bookmarked} detail={`${questionBank.bookmarked} saved questions ready for review`} /><Link href="/practice/question-bank" className={styles.textLink}>Review questions</Link></div>
    <Link href="/multiplayer" className={`${styles.overviewRank} ${rankThemeClass(multiplayer.rank)}`}>
      <p className={`${rankSecondaryClass} ${styles.statLabel}`}>Multiplayer Rank</p>
      <p className={styles.statValue}><RankIcon rank={multiplayer.rank} size={20} />{multiplayer.rank}</p>
      <p className={`${rankSecondaryClass} ${styles.statDetail}`}>{multiplayer.rating ?? 0} RP</p>
    </Link>
  </section>;
}
