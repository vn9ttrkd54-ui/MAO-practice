import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RankIcon, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import DashboardSection from "./DashboardSection";
import StatCard from "./StatCard";
import styles from "./dashboard.module.css";

interface MultiplayerSectionProps {
  multiplayer: { rank: string; rating: number | null; matchesPlayed: number; wins: number; averagePlacement: number | null; currentStreak: number };
}

export default function MultiplayerSection({ multiplayer }: MultiplayerSectionProps) {
  return <DashboardSection title="Multiplayer" label="Ranked Competition" theme="multiplayer"
    action={<Link href="/multiplayer" className={styles.action}>Play Multiplayer<ArrowRight size={16} aria-hidden="true" /></Link>}>
    <div className={styles.multiplayerLayout}>
      <div aria-label="Your multiplayer rank" className={`${styles.rankSurface} ${rankThemeClass(multiplayer.rank)}`}>
        <p className={`${rankSecondaryClass} ${styles.statLabel}`}>Rank</p>
        <p className={styles.rankName}><RankIcon rank={multiplayer.rank} size={24} />{multiplayer.rank}</p>
        <p className={styles.rankRating}>{multiplayer.rating ?? "—"} RP</p>
      </div>
      <div className={styles.matchMetrics}>
        <StatCard label="Rating" value={multiplayer.rating ?? "—"} />
        <StatCard label="Matches Played" value={multiplayer.matchesPlayed} />
        <StatCard label="Wins" value={multiplayer.wins} />
        <StatCard label="Average Placement" value={multiplayer.averagePlacement ?? "—"} />
        <StatCard label="Current Streak" value={multiplayer.currentStreak} />
      </div>
    </div>
  </DashboardSection>;
}
