"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { startPrivateRoomAction } from "@/app/multiplayer/actions";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import { RankIcon, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import { useLobbyConnection } from "@/components/multiplayer/useLobbyConnection";
import type { MultiplayerLobbyState } from "@/types/multiplayer";

interface PrivateLobbyProps {
  initialLobby: MultiplayerLobbyState;
  error?: string;
}

export default function PrivateLobby({ initialLobby, error }: PrivateLobbyProps) {
  const { lobby, warning, ready, leaving, leaveError, blocked, retry, leave } = useLobbyConnection(initialLobby);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  const isHost = lobby.currentPlayer.isHost;
  const started = lobby.room.status === "in-progress" || lobby.room.status === "completed";
  const publicRoom = lobby.room.visibility === "public";
  const countdown = now !== null && lobby.room.countdownEndsAt ? Math.max(0, Math.ceil((lobby.room.countdownEndsAt - now) / 1000)) : null;

  return (
    <>
      {warning && !leaving && !leaveError && !blocked ? <div role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Connection interrupted. Reconnecting to the lobby… <button type="button" onClick={retry} className="ml-2 font-semibold underline">Retry now</button></div> : null}
      {leaveError ? <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{leaveError}</div> : null}
      {blocked ? <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{blocked} <Link href="/multiplayer" className="ml-2 font-semibold underline">Back to rooms</Link>{blocked.includes("game started") ? <Link href={`/multiplayer/room/${lobby.room.id}/play`} className="ml-2 font-semibold underline">Rejoin Game</Link> : null}</div> : null}
      {error ? <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-7 grid gap-5 md:grid-cols-[1fr_0.75fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Players</h2>
            <span className="text-sm text-gray-500">{lobby.players.length}/{lobby.room.capacity}</span>
          </div>
          <ul className="mt-3 space-y-3">
            {lobby.players.map((player) => (
              <li key={player.playerId} className={`${player.isGuest ? "border-gray-200 bg-white text-gray-950" : rankThemeClass(player.rankTier ?? "Novice")} flex items-center justify-between gap-4 rounded-2xl border px-4 py-4`}>
                <div>
                  <p className="font-semibold">{player.displayName}{player.isHost ? <span className="ml-2 rounded-full border border-current/30 bg-white/15 px-2 py-0.5 text-[10px] font-bold">HOST</span> : null}</p>
                  <div className={`mt-1 flex items-center gap-2 text-xs ${player.isGuest ? "text-gray-500" : rankSecondaryClass}`}>
                    {player.isGuest ? null : <RankIcon rank={player.rankTier ?? "Novice"} size={14} />}
                    <span>{player.isGuest ? "Unranked guest" : `${player.rankTier} · ${player.rp} RP`}</span>
                  </div>
                </div>
                <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-blue-500 ring-4 ring-blue-100/50" aria-label="Connected" />
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-50 p-5">
          <h2 className="font-bold">Ready to play?</h2>
          <p className="mt-2 text-sm text-gray-600">{publicRoom ? (lobby.room.status === "countdown" ? `Match begins in ${countdown ?? 60}s` : "The countdown begins when a second player joins.") : isHost ? "Start whenever everyone has joined." : "Waiting for the host to start the game."}</p>
          {!publicRoom && isHost && !started ? (
            <form action={startPrivateRoomAction} className="mt-5">
              <input type="hidden" name="roomId" value={lobby.room.id} />
              <PendingSubmitButton pendingText="Starting game…" disabled={!ready || leaving || !!leaveError || !!blocked} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Start Game</PendingSubmitButton>
            </form>
          ) : null}
          {!publicRoom && isHost && lobby.players.length === 1 && !started ? <p className="mt-3 text-xs text-gray-500">Solo games automatically become unranked.</p> : null}
          {!started ? <button type="button" disabled={!ready || leaving || !!blocked} aria-busy={leaving} onClick={() => { if (leaveError || publicRoom || !isHost || window.confirm("Close this private room for everyone?")) void leave(); }} className="mt-3 w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60">{leaving ? (!publicRoom && isHost ? "Closing room…" : "Leaving room…") : leaveError ? "Retry leave" : !ready ? "Connecting…" : !publicRoom && isHost ? "Close Room" : "Leave Room"}</button> : null}
          {started ? <div className="mt-5 rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-800">Game started</div> : null}
        </aside>
      </div>
    </>
  );
}
