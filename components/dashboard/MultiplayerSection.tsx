import Link from "next/link";
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

              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Live
              </span>
            </div>

            <p className="mt-1 text-gray-600">
              Your ranked multiplayer performance.
            </p>
          </div>
        </div>
        <Link href="/multiplayer" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Play Multiplayer</Link>
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
