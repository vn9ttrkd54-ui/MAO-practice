"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { RankPill } from "@/components/multiplayer/RankTheme";
import type { MultiplayerSpectator, MultiplayerSpectatorState } from "@/types/multiplayer";

function Spectators({ spectators }: { spectators: MultiplayerSpectator[] }) {
  return <aside className="rounded-2xl border bg-white p-4"><h2 className="font-bold">Spectators · {spectators.length}</h2><div className="mt-3 space-y-3">{spectators.map((person) => <div key={person.playerId}><p className="truncate text-sm font-semibold">{person.displayName}</p><div className="mt-1 flex items-center gap-2"><RankPill rank={person.rankTier} /><span className="text-xs text-gray-500">{person.rp} RP</span></div></div>)}</div></aside>;
}

export default function SpectatorView({ initialState }: { initialState: MultiplayerSpectatorState }) {
  const [state, setState] = useState(initialState);
  const [now, setNow] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 250);
    const poll = window.setInterval(async () => {
      const response = await fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { cache: "no-store" });
      if (response.ok) setState(await response.json() as MultiplayerSpectatorState); else setEnded(true);
    }, 1000);
    const leave = () => { fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { method: "DELETE", keepalive: true }); };
    window.addEventListener("pagehide", leave);
    return () => { window.clearInterval(clock); window.clearInterval(poll); window.removeEventListener("pagehide", leave); fetch(`/api/multiplayer/rooms/${state.roomId}/spectate`, { method: "DELETE", keepalive: true }); };
  }, [state.roomId]);
  if (ended) return <main className="mx-auto max-w-xl px-6 py-16 text-center"><h1 className="text-3xl font-bold">Match ended</h1><Link href="/multiplayer" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Back to multiplayer</Link></main>;
  const leaderboard = [...state.players].sort((a, b) => b.score - a.score);
  const seconds = now === null ? null : Math.max(0, Math.ceil((state.questionEndsAt - now) / 1000));
  return <main className="mx-auto max-w-5xl px-5 py-8"><header className="flex items-center justify-between"><div><p className="text-sm font-semibold text-blue-600">Live spectator view</p><h1 className="text-2xl font-bold">Question {state.questionNumber} of {state.totalQuestions}</h1></div><div className="rounded-xl bg-gray-100 px-4 py-2 text-xl font-bold tabular-nums">{seconds}s</div></header><div className="mt-6 grid gap-4 lg:grid-cols-[1fr_18rem]"><div className="space-y-4"><section className="rounded-2xl border bg-white p-6 shadow-sm"><p className="text-lg font-semibold">{state.question.question}</p><div className="mt-5 grid gap-2">{state.question.choices.map((choice, index) => <div key={choice} className="flex gap-3 rounded-xl border px-4 py-3"><b>{String.fromCharCode(65 + index)}</b><span>{choice}</span></div>)}</div><p className="mt-4 text-xs text-gray-500">Spectators cannot submit answers.</p></section><section className="rounded-2xl border bg-white p-4"><h2 className="font-bold">Live leaderboard</h2><ol className="mt-2 divide-y">{leaderboard.map((player, index) => <li key={player.playerId} className="flex items-center justify-between gap-3 py-2 text-sm"><div><span>{index + 1}. {player.displayName}</span>{!player.isGuest ? <div className="mt-1"><RankPill rank={player.rankTier} /></div> : null}</div><b>{player.score} pts</b></li>)}</ol></section></div><Spectators spectators={state.spectators} /></div></main>;
}
