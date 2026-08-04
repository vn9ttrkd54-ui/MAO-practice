import Link from "next/link";
import { RankIcon, rankThemeClass } from "@/components/multiplayer/RankTheme";

import StatCard from "@/components/dashboard/StatCard";

interface MultiplayerSectionProps {
  multiplayer: {
    rank: string;
    rating: number | null;
    matchesPlayed: number;
    wins: number;
    averagePlacement: number | null;
    currentStreak: number;
  };
}

export default function MultiplayerSection({
  multiplayer,
}: MultiplayerSectionProps) {
  return (
    <section className={`mt-10 overflow-hidden rounded-2xl border p-6 ${rankThemeClass(multiplayer.rank)}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rank-icon rounded-xl p-3 shadow-sm">
            <RankIcon rank={multiplayer.rank} size={24} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">
                Multiplayer
              </h2>

              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Live
              </span>
            </div>

            <p className="rank-secondary mt-1">
              Your ranked multiplayer performance.
            </p>
          </div>
        </div>
        <Link href="/multiplayer" className="rank-chip rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm">Play Multiplayer</Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Rank"
          value={multiplayer.rank}
        />

        <StatCard
          label="Rating"
          value={multiplayer.rating ?? "—"}
        />

        <StatCard
          label="Matches Played"
          value={multiplayer.matchesPlayed}
        />

        <StatCard
          label="Wins"
          value={multiplayer.wins}
        />

        <StatCard
          label="Average Placement"
          value={multiplayer.averagePlacement ?? "—"}
        />

        <StatCard
          label="Current Streak"
          value={multiplayer.currentStreak}
        />
      </div>
    </section>
  );
}
