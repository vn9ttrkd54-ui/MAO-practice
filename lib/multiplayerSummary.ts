perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
	LC_ALL = "C.UTF-8",
	LC_CTYPE = "C.UTF-8",
	LANG = "C.UTF-8"
    are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
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
