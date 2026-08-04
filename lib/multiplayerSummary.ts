export interface MultiplayerSummary {
  status: "active";
  rank: string;
  rating: number | null;
  matchesPlayed: number;
  wins: number;
  averagePlacement: number | null;
  currentStreak: number;
}

interface MultiplayerSummaryInput {
  rp?: number;
  rankedMatchesPlayed?: number;
  rankedWins?: number;
  placements?: number[];
}

function rankForRp(rp: number) {
  if (rp >= 2200) return "Legend";
  if (rp >= 1750) return "Grandmaster";
  if (rp >= 1350) return "Master";
  if (rp >= 1000) return "Diamond";
  if (rp >= 700) return "Platinum";
  if (rp >= 450) return "Gold";
  if (rp >= 250) return "Silver";
  if (rp >= 100) return "Bronze";
  return "Novice";
}

export function getMultiplayerSummary(input: MultiplayerSummaryInput = {}): MultiplayerSummary {
  const rating = input.rp ?? 0;
  const placements = input.placements ?? [];
  let currentStreak = 0;
  for (const placement of placements) {
    if (placement !== 1) break;
    currentStreak += 1;
  }
  return {
    status: "active",
    rank: rankForRp(rating),
    rating,
    matchesPlayed: input.rankedMatchesPlayed ?? 0,
    wins: input.rankedWins ?? 0,
    averagePlacement: placements.length ? Number((placements.reduce((sum, placement) => sum + placement, 0) / placements.length).toFixed(1)) : null,
    currentStreak,
  };
}
