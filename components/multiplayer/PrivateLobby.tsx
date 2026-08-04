"use client";

import { useEffect, useState } from "react";

import { startPrivateRoomAction } from "@/app/multiplayer/actions";
import type { MultiplayerLobbyState } from "@/types/multiplayer";

interface PrivateLobbyProps {
  initialLobby: MultiplayerLobbyState;
  error?: string;
}

export default function PrivateLobby({ initialLobby, error }: PrivateLobbyProps) {
  const [lobby, setLobby] = useState(initialLobby);

  useEffect(() => {
    if (lobby.room.status !== "waiting") return;
    const endpoint = `/api/multiplayer/rooms/${lobby.room.id}/lobby`;
    const timer = window.setInterval(async () => {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (response.ok) setLobby(await response.json() as MultiplayerLobbyState);
    }, 2000);

    function disconnect() {
      void fetch(endpoint, { method: "DELETE", keepalive: true });
    }

    window.addEventListener("pagehide", disconnect);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pagehide", disconnect);
    };
  }, [lobby.room.id, lobby.room.status]);

  const isHost = lobby.currentPlayer.isHost;
  const started = lobby.room.status !== "waiting";

  return (
    <>
      {error ? <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-7 grid gap-5 md:grid-cols-[1fr_0.75fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Players</h2>
            <span className="text-sm text-gray-500">{lobby.players.length}/{lobby.room.capacity}</span>
          </div>
          <ul className="mt-3 divide-y rounded-2xl border bg-white">
            {lobby.players.map((player) => (
              <li key={player.playerId} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-semibold">{player.displayName}{player.isHost ? <span className="ml-2 text-xs text-blue-600">HOST</span> : null}</p>
                  <p className="text-xs text-gray-500">{player.isGuest ? "Guest · Unranked" : `${player.rankTier} · ${player.rp} RP`}</p>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" aria-label="Connected" />
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl bg-gray-50 p-5">
          <h2 className="font-bold">Ready to play?</h2>
          <p className="mt-2 text-sm text-gray-600">{isHost ? "Start whenever everyone has joined." : "Waiting for the host to start the game."}</p>
          {isHost && !started ? (
            <form action={startPrivateRoomAction} className="mt-5">
              <input type="hidden" name="roomId" value={lobby.room.id} />
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Start Game</button>
            </form>
          ) : null}
          {isHost && lobby.players.length === 1 && !started ? <p className="mt-3 text-xs text-gray-500">Solo games automatically become unranked.</p> : null}
          {started ? <div className="mt-5 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-800">Game started</div> : null}
        </aside>
      </div>
    </>
  );
}
