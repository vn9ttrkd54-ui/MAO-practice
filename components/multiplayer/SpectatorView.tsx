"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import MathText from "@/components/math/MathText";
import { RankIcon, RankPill, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import { subscribeToMultiplayerRoom } from "@/lib/multiplayerRealtime";
import type { MultiplayerSpectator, MultiplayerSpectatorState } from "@/types/multiplayer";

function Spectators({ spectators }: { spectators: MultiplayerSpectator[] }) {
  return (
    <aside className="rounded-2xl border bg-white p-4">
      <h2 className="font-bold">Spectators · {spectators.length}</h2>
      <div className="mt-3 space-y-3">
        {spectators.map((person) => (
          <div key={person.playerId}>
            <p className="truncate text-sm font-semibold">{person.displayName}</p>
            <div className="mt-1 flex items-center gap-2">
              <RankPill rank={person.rankTier} />
              <span className="text-xs text-gray-500">{person.rp} RP</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function SpectatorView({ initialState }: { initialState: MultiplayerSpectatorState }) {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [now, setNow] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  const refreshState = useRef<() => void>(() => undefined);

  useEffect(() => {
    let stopped = false;
    let requestInFlight = false;
    let refreshQueued = false;
    const clock = window.setInterval(() => setNow(Date.now()), 250);

    async function loadState() {
      if (requestInFlight) {
        refreshQueued = true;
        return;
      }
      requestInFlight = true;
      try {
        const response = await fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { cache: "no-store" });
        if (stopped) return;
        if (!response.ok) {
          if (response.status === 404) setEnded(true);
          return;
        }
        const payload = await response.json() as MultiplayerSpectatorState | { completed: true };
        if ("completed" in payload) {
          router.replace(`/multiplayer/room/${state.roomId}/results`);
          return;
        }
        setState(payload);
      } catch {
        // The heartbeat retries after brief network interruptions.
      } finally {
        requestInFlight = false;
        if (refreshQueued && !stopped) {
          refreshQueued = false;
          void loadState();
        }
      }
    }

    refreshState.current = () => void loadState();
    const unsubscribe = subscribeToMultiplayerRoom(state.roomId, refreshState.current);
    const heartbeat = window.setInterval(refreshState.current, 5_000);
    const leave = () => {
      fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { method: "DELETE", keepalive: true });
    };
    window.addEventListener("pagehide", leave);
    return () => {
      stopped = true;
      refreshState.current = () => undefined;
      window.clearInterval(clock);
      window.clearInterval(heartbeat);
      unsubscribe();
      window.removeEventListener("pagehide", leave);
      fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { method: "DELETE", keepalive: true });
    };
  }, [router, state.roomId]);

  useEffect(() => {
    const boundary = state.intermissionEndsAt ?? state.questionEndsAt;
    const delay = Math.max(0, boundary - Date.now() + 100);
    const timer = window.setTimeout(() => refreshState.current(), delay);
    return () => window.clearTimeout(timer);
  }, [state.intermissionEndsAt, state.questionEndsAt]);

  if (ended) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Match ended</h1>
        <Link href="/multiplayer" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Back to multiplayer</Link>
      </main>
    );
  }

  const leaderboard = [...state.players].sort((a, b) => b.score - a.score);
  const spectatorEndsAt = Math.min(
    state.questionEndsAt,
    state.questionStartedAt + state.questionDurationSeconds * 1000,
  );
  const seconds = now === null ? null : Math.max(0, Math.ceil((spectatorEndsAt - now) / 1000));

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Live spectator view</p>
          <h1 className="text-2xl font-bold">Question {state.questionNumber} of {state.totalQuestions}</h1>
        </div>
        <div className="rounded-xl bg-gray-100 px-4 py-2 text-xl font-bold tabular-nums">{seconds}s</div>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold leading-8"><MathText>{state.question.question}</MathText></div>
            <div className="mt-5 grid gap-2">
              {state.question.choices.map((choice, index) => (
                <div key={`${index}-${choice}`} className="flex items-start gap-3 rounded-xl border px-4 py-3">
                  <b>{String.fromCharCode(65 + index)}</b>
                  <MathText>{choice}</MathText>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">Spectators cannot submit answers.</p>
          </section>

          <section>
            <h2 className="font-bold">Live leaderboard</h2>
            <ol className="mt-3 space-y-2">
              {leaderboard.map((player, index) => (
                <li key={player.playerId} className={`${player.isGuest ? "border-gray-200 bg-white text-gray-950" : rankThemeClass(player.rankTier ?? "Novice")} flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm`}>
                  <div>
                    <span className="font-semibold">{index + 1}. {player.displayName}</span>
                    <div className={`mt-1 flex items-center gap-1.5 text-xs ${player.isGuest ? "text-gray-500" : rankSecondaryClass}`}>
                      {player.isGuest ? null : <RankIcon rank={player.rankTier ?? "Novice"} size={13} />}
                      <span>{player.isGuest ? "Unranked guest" : player.rankTier}</span>
                    </div>
                  </div>
                  <b>{player.score} pts</b>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <Spectators spectators={state.spectators} />
      </div>
    </main>
  );
}
