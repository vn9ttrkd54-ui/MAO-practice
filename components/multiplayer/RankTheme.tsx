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

export const rankSecondaryClass = styles.secondary;
export const rankIconClass = styles.icon;
export const rankChipClass = styles.chip;

export function RankIcon({ rank, size = 24 }: { rank: string; size?: number }) {
  const Icon = rankIcons[rank] ?? Sprout;
  return <Icon size={size} aria-hidden="true" />;
}
