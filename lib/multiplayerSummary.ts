export interface MultiplayerSummary {
  status: "coming-soon";
  rank: string;
  rating: number | null;
  matchesPlayed: number;
  wins: number;
  averagePlacement: number | null;
  currentStreak: number;
}

export function getMultiplayerSummary(): MultiplayerSummary {
  return {
    status: "coming-soon",
    rank: "Unranked",
    rating: null,
    matchesPlayed: 0,
    wins: 0,
    averagePlacement: null,
    currentStreak: 0,
  };
}
