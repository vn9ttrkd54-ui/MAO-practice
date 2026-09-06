"use client";

import { useEffect, useState } from "react";

import { rankThemeClass } from "@/components/multiplayer/RankTheme";
import type { MultiplayerPublicRoom } from "@/types/multiplayer";

function playerInitial(displayName: string) {
  return Array.from(displayName.trim())[0]?.toLocaleUpperCase() ?? "?";
}

function RoomCountdown({ endsAt }: { endsAt: number }) {
  const [seconds, setSeconds] = useState(() => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));

  useEffect(() => {
    const update = () => setSeconds(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return <span className="font-semibold tabular-nums text-amber-700">Starts in {seconds}s</span>;
}

export function PublicRoomPresence({ room }: { room: MultiplayerPublicRoom }) {
  const occupied = room.players.length > 0;
  const visiblePlayers = room.players.slice(0, 3);
  const remainingPlayers = room.players.length - visiblePlayers.length;

  return (
    <div className="mt-3 flex min-h-8 flex-wrap items-center justify-between gap-3">
      <p className="flex items-center gap-2 text-xs text-gray-500">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${occupied ? "bg-blue-500 ring-4 ring-blue-50" : "bg-slate-300"}`} aria-hidden="true" />
        {room.status === "countdown" && room.countdownEndsAt
          ? <RoomCountdown endsAt={room.countdownEndsAt} />
          : occupied ? "Players waiting" : "Empty room"}
      </p>

      {occupied ? (
        <div className="flex -space-x-2" aria-label={`${room.players.length} ${room.players.length === 1 ? "player" : "players"} waiting`}>
          {visiblePlayers.map((player) => (
            <span
              key={player.playerId}
              title={`${player.displayName}${player.rankTier ? ` · ${player.rankTier}` : " · Unranked"}`}
              className={`${player.rankTier ? rankThemeClass(player.rankTier) : "border-gray-300 bg-gray-100 text-gray-800"} flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm`}
            >
              {playerInitial(player.displayName)}
            </span>
          ))}
          {remainingPlayers > 0 ? (
            <span className="flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-white bg-gray-800 px-1 text-[10px] font-bold text-white shadow-sm">
              +{remainingPlayers}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
