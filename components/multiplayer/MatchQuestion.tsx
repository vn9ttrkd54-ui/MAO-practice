"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { MultiplayerRoundState } from "@/types/multiplayer";
import type { AnswerChoice } from "@/types/question";

const labels: AnswerChoice[] = ["A", "B", "C", "D", "E"];

function SpectatorList({ round }: { round: MultiplayerRoundState }) {
  if (round.spectators.length === 0) return null;
  return <aside className="mt-4 rounded-2xl border bg-gray-50 p-4"><h2 className="text-sm font-bold">Spectators · {round.spectators.length}</h2><div className="mt-2 flex flex-wrap gap-2">{round.spectators.map((person) => <span key={person.playerId} className="rounded-full bg-white px-3 py-1 text-xs shadow-sm">{person.displayName} · {person.rankTier} · {person.rp} RP</span>)}</div></aside>;
}

export default function MatchQuestion({ round: initialRound }: { round: MultiplayerRoundState }) {
  const router = useRouter();
  const [round, setRound] = useState(initialRound);
  const [now, setNow] = useState<number | null>(null);
  const [selected, setSelected] = useState<AnswerChoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const currentPlayer = round.players.find((player) => player.playerId === round.currentPlayerId);
  const submitted = currentPlayer?.hasSubmittedCurrentQuestion ?? false;
  const secondsLeft = now === null ? null : Math.max(0, Math.ceil((round.questionEndsAt - now) / 1000));
  const intermissionLeft = now === null || !round.intermissionEndsAt ? null : Math.max(0, Math.ceil((round.intermissionEndsAt - now) / 1000));

  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 250);
    const poll = window.setInterval(async () => {
      const response = await fetch(`/api/multiplayer/rooms/${round.roomId}/round`, { cache: "no-store" });
      if (response.status === 204) {
        setFinished(true);
        router.replace(`/multiplayer/room/${round.roomId}/results`);
      } else if (response.ok) {
        const nextRound = await response.json() as MultiplayerRoundState;
        setRound((current) => {
          if (current.questionNumber !== nextRound.questionNumber) {
            setSelected(null);
            setShowLeaderboard(false);
          }
          return nextRound;
        });
      }
    }, 1000);
    return () => { window.clearInterval(clock); window.clearInterval(poll); };
  }, [round.roomId, router]);

  async function submitAnswer() {
    if (!selected) return;
    setError(null);
    setShowLeaderboard(true);
    const response = await fetch(`/api/multiplayer/rooms/${round.roomId}/round`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: round.question.questionId, selectedAnswer: selected }),
    });
    const body = await response.json() as MultiplayerRoundState | { error: string };
    if (!response.ok) {
      setError("error" in body ? body.error : "Unable to submit answer.");
      setShowLeaderboard(false);
      return;
    }
    setRound(body as MultiplayerRoundState);
  }

  if (finished) {
    return <main className="mx-auto max-w-3xl px-6 py-16 text-center"><div className="rounded-3xl border bg-white p-10 shadow-sm"><h1 className="text-3xl font-bold">Match complete</h1><p className="mt-3 text-gray-600">Final results and question review arrive in the next pack.</p></div></main>;
  }

  const inIntermission = round.intermissionEndsAt !== null;
  if (inIntermission || submitted || showLeaderboard) {
    const leaderboard = [...round.players].sort((a, b) => b.score - a.score);
    return <main className="mx-auto max-w-3xl px-6 py-8"><header className="text-center"><p className="text-sm font-semibold text-blue-600">Answer submitted</p><h1 className="mt-1 text-3xl font-bold">Live leaderboard</h1><p className="mt-2 text-gray-600">{inIntermission ? `Next question in ${intermissionLeft ?? 10}s` : "Waiting for the other players…"}</p></header><ol className="mt-6 divide-y rounded-2xl border bg-white shadow-sm">{leaderboard.map((player, index) => <li key={player.playerId} className="flex items-center justify-between px-5 py-4"><span className="font-semibold">{index + 1}. {player.displayName}</span><span className="font-bold tabular-nums">{player.score} pts</span></li>)}</ol><SpectatorList round={round} /></main>;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-blue-600">{round.question.division} · {round.question.topic}</p><h1 className="mt-1 text-2xl font-bold">Question {round.questionNumber} of {round.totalQuestions}</h1></div><div className={`rounded-2xl px-5 py-3 text-center ${secondsLeft !== null && secondsLeft <= 10 ? "bg-red-100 text-red-700" : "bg-gray-100"}`}><p className="text-xs font-semibold uppercase">Time</p><p className="text-2xl font-bold tabular-nums">{secondsLeft === null ? "--" : `${secondsLeft}s`}</p></div></header>
      <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-lg font-semibold leading-8">{round.question.question}</p>
        <div className="mt-6 grid gap-3">{round.question.choices.map((choice, index) => { const label = labels[index]; const active = selected === label; return <button key={label} disabled={submitted || secondsLeft === null || secondsLeft === 0} onClick={() => setSelected(label)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left ${active ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "hover:bg-gray-50"} disabled:cursor-not-allowed disabled:opacity-60`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold">{label}</span><span>{choice}</span></button>; })}</div>
        {error ? <p role="alert" className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button onClick={submitAnswer} disabled={!selected || submitted || secondsLeft === null || secondsLeft === 0} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600">{submitted ? "Answer submitted" : "Submit Answer"}</button>
      </section>
      <SpectatorList round={round} />
    </main>
  );
}
