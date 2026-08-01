import { Trophy } from "lucide-react";

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
    <section className="mt-10 rounded-2xl border bg-gray-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-3 text-gray-600 shadow-sm">
            <Trophy size={24} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">
                Multiplayer
              </h2>

              <span className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                Coming Soon
              </span>
            </div>

            <p className="mt-1 text-gray-600">
              Compete against multiple players and
              earn a rank.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Rank"
          value={multiplayer.rank}
          muted
        />

        <StatCard
          label="Rating"
          value={multiplayer.rating ?? "—"}
          muted
        />

        <StatCard
          label="Matches Played"
          value={multiplayer.matchesPlayed}
          muted
        />

        <StatCard
          label="Wins"
          value={multiplayer.wins}
          muted
        />

        <StatCard
          label="Average Placement"
          value={multiplayer.averagePlacement ?? "—"}
          muted
        />

        <StatCard
          label="Current Streak"
          value={multiplayer.currentStreak}
          muted
        />
      </div>
    </section>
  );
}
