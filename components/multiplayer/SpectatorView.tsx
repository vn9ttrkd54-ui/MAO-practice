"use client";

import RoundLeaderboard from "./RoundLeaderboard";
import styles from "./matchSurface.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import MathText from "@/components/math/MathText";
import QuestionImage from "@/components/questions/QuestionImage";
import QuestionSourceCredit from "@/components/questions/QuestionSourceCredit";
import { RankPill } from "@/components/multiplayer/RankTheme";
import { subscribeToMultiplayerRoom } from "@/lib/multiplayerRealtime";
import { countdownSeconds } from "@/lib/multiplayerTiming";
import { withRequestTimeout } from "@/lib/requestTimeout";
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
  const [connectionWarning, setConnectionWarning] = useState(false);
  const refreshState = useRef<() => void>(() => undefined);

  useEffect(() => {
    let stopped = false;
    let requestInFlight = false;
    let refreshQueued = false;
    const lifecycle = new AbortController();
    const clock = window.setInterval(() => setNow(Date.now()), 250);

    async function loadState() {
      if (stopped) return;
      if (requestInFlight) {
        refreshQueued = true;
        return;
      }
      requestInFlight = true;
      try {
        const { response, payload } = await withRequestTimeout(async (signal) => {
          const response = await fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { cache: "no-store", signal });
          return { response, payload: response.ok ? await response.json() as MultiplayerSpectatorState | { completed: true } : null };
        }, { signal: lifecycle.signal, timeoutMs: 8_000 });
        if (stopped) return;
        if (!payload) {
          if (response.status === 404) setEnded(true);
          else setConnectionWarning(true);
          return;
        }
        setConnectionWarning(false);
        if ("completed" in payload) {
          router.replace(`/multiplayer/room/${state.roomId}/results`);
          return;
        }
        setState(current => payload.questionNumber < current.questionNumber ||
          (payload.stateVersion !== undefined && current.stateVersion !== undefined && payload.stateVersion < current.stateVersion)
          ? current : payload);
      } catch {
        if (!stopped) setConnectionWarning(true);
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
      void fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { method: "DELETE", keepalive: true }).catch(() => undefined);
    };
    const reconnect = () => {
      if (document.visibilityState === "visible") void loadState();
    };
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", reconnect);
    window.addEventListener("focus", reconnect);
    window.addEventListener("online", reconnect);
    document.addEventListener("visibilitychange", reconnect);
    return () => {
      stopped = true;
      lifecycle.abort();
      refreshState.current = () => undefined;
      window.clearInterval(clock);
      window.clearInterval(heartbeat);
      unsubscribe();
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("pageshow", reconnect);
      window.removeEventListener("focus", reconnect);
      window.removeEventListener("online", reconnect);
      document.removeEventListener("visibilitychange", reconnect);
      leave();
    };
  }, [router, state.roomId]);

  useEffect(() => {
    const boundary = state.intermissionEndsAt ?? state.questionEndsAt;
    if (!boundary) return;
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

  const spectatorEndsAt = Math.min(
    state.questionEndsAt,
    state.questionStartedAt + state.questionDurationSeconds * 1000,
  );
  const seconds = now === null ? null : Math.max(0, Math.ceil((spectatorEndsAt - now) / 1000));
  const preparing = !state.questionStartedAt || now === null || now < state.questionStartedAt;
  const countdown = countdownSeconds(state.questionStartedAt, now, state.questionNumber);

  return (
    <main className={`${styles.page} mx-auto max-w-5xl px-5 py-8`}>
      {connectionWarning ? <p role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Connection interrupted. Reconnecting to the match… <button type="button" onClick={() => refreshState.current()} className="ml-2 font-semibold underline">Retry now</button></p> : null}
      <header className={`${styles.header} flex items-center justify-between`}>
        <div>
          <p className="text-sm font-semibold text-blue-600">Live spectator view</p>
          <h1 className="text-2xl font-bold">Question {state.questionNumber} of {state.totalQuestions}</h1>
        </div>
        <div className="rounded-xl bg-gray-100 px-4 py-2 text-xl font-bold tabular-nums">{state.roundClosed ? "Round complete" : preparing ? (countdown === null ? "Preparing…" : `Starts in ${countdown}s`) : `${seconds}s`}</div>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-4">
          <section className={`${styles.panel} rounded-2xl border bg-white p-6 shadow-sm`}>
            {preparing ? <p>Waiting for the shared question start…</p> : <>
            <QuestionSourceCredit source={state.question.source} />
            <div className="text-lg font-semibold leading-8"><MathText>{state.question.question}</MathText></div>
            <QuestionImage illustration={state.question.illustration} />
            <div className="mt-5 grid gap-2">
              {state.question.choices.map((choice, index) => (
                <div key={`${index}-${choice}`} className="flex items-start gap-3 rounded-xl border px-4 py-3">
                  <b>{String.fromCharCode(65 + index)}</b>
                  <MathText>{choice}</MathText>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">Spectators cannot submit answers.</p>
            </>}
          </section>

          <section>
            <h2 className="mb-3 font-bold">{state.roundClosed ? `Question ${state.questionNumber} results` : "Live leaderboard"}</h2>
            {!state.roundClosed && seconds === 0 && !preparing ? <p className="mb-3 mt-1 text-sm text-slate-600">Waiting for the round to close…</p> : null}
            <RoundLeaderboard players={state.players} questionNumber={state.questionNumber} closed={state.roundClosed === true} />
          </section>
        </div>
        <Spectators spectators={state.spectators} />
      </div>
    </main>
  );
}
