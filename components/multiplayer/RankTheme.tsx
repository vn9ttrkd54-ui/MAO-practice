import { Crown, Flame, Gem, Hexagon, Medal, Shield, Sparkles, Sprout, Trophy, type LucideIcon } from "lucide-react";

const rankIcons: Record<string, LucideIcon> = {
  Novice: Sprout, Bronze: Shield, Silver: Medal, Gold: Trophy,
  Platinum: Hexagon, Diamond: Gem, Master: Crown,
  Grandmaster: Flame, Legend: Sparkles,
};

export function rankThemeClass(rank: string) {
  return `rank-surface rank-${rank.toLowerCase().replaceAll(" ", "-")}`;
}

export function RankIcon({ rank, size = 24 }: { rank: string; size?: number }) {
  const Icon = rankIcons[rank] ?? Sprout;
  return <Icon size={size} aria-hidden="true" />;
}
