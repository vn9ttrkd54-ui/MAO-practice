import { Crown, Flame, Gem, Hexagon, Medal, Shield, Sparkles, Sprout, Trophy, type LucideIcon } from "lucide-react";
import styles from "@/components/multiplayer/rankTheme.module.css";

const rankIcons: Record<string, LucideIcon> = {
  Novice: Sprout, Bronze: Shield, Silver: Medal, Gold: Trophy,
  Platinum: Hexagon, Diamond: Gem, Master: Crown,
  Grandmaster: Flame, Legend: Sparkles,
};

export function rankThemeClass(rank: string) {
  const key = rank.toLowerCase().replaceAll(" ", "-") as keyof typeof styles;
  return `${styles.surface} ${styles[key] ?? ""}`;
}

const pageThemes: Record<string, string> = {
  Novice: styles.pageNovice, Bronze: styles.pageBronze, Silver: styles.pageSilver,
  Gold: styles.pageGold, Platinum: styles.pagePlatinum, Diamond: styles.pageDiamond,
  Master: styles.pageMaster, Grandmaster: styles.pageGrandmaster, Legend: styles.pageLegend,
};

export function rankPageClass(rank: string) {
  return `${styles.page} ${pageThemes[rank] ?? styles.pageNovice}`;
}

export const rankSecondaryClass = styles.secondary;
export const rankIconClass = styles.icon;
export const rankChipClass = styles.chip;

export function RankIcon({ rank, size = 24 }: { rank: string; size?: number }) {
  const Icon = rankIcons[rank] ?? Sprout;
  return <Icon size={size} aria-hidden="true" />;
}

export function RankPill({ rank }: { rank: string | null }) {
  if (!rank) return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">Unranked</span>;
  return <span className={`${rankThemeClass(rank)} inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-semibold`}><RankIcon rank={rank} size={12} />{rank}</span>;
}
