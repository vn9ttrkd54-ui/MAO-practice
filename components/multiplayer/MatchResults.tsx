import Link from "next/link";

import { RankPill } from "@/components/multiplayer/RankTheme";
import type { MultiplayerMatchResult } from "@/types/multiplayer";

const labels = ["A", "B", "C", "D", "E"];

export default function MatchResults({ result }: { result: MultiplayerMatchResult }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Match complete</p>
        <h1 className="mt-2 text-4xl font-bold">You placed #{result.placement}</h1>
        <p className="mt-2 text-lg text-gray-600">{result.score} total points</p>
        {result.ratingChange ? <div className={`mx-auto mt-4 inline-flex rounded-full px-4 py-2 font-bold ${result.ratingChange.change >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>{result.ratingChange.change >= 0 ? "+" : ""}{result.ratingChange.change} RP · {result.ratingChange.newRp} RP total</div> : <div className="mx-auto mt-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">Unranked match</div>}
      </header>

      <section className="mt-8"><h2 className="text-xl font-bold">Final leaderboard</h2><ol className="mt-3 divide-y rounded-2xl border bg-white shadow-sm">{result.finalLeaderboard.map((player) => <li key={player.playerId} className="flex items-center justify-between gap-4 px-5 py-4"><div><span className="font-semibold">#{player.placement} {player.displayName}</span>{!player.isGuest ? <div className="mt-1"><RankPill rank={player.rankTier} /></div> : null}</div><span className="font-bold tabular-nums">{player.score} pts</span></li>)}</ol></section>

      <section className="mt-8"><h2 className="text-xl font-bold">Question review</h2><div className="mt-3 space-y-4">{result.rounds.map((round) => <article key={round.questionId} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-4"><h3 className="font-bold">Question {round.questionNumber}</h3><span className={`rounded-full px-3 py-1 text-xs font-semibold ${round.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>{round.correct ? `Correct · +${round.pointsEarned}` : "Incorrect · +0"}</span></div><p className="mt-3 font-medium">{round.question}</p><div className="mt-4 grid gap-2">{round.choices.map((choice, index) => { const label = labels[index]; const isCorrect = label === round.correctAnswer; const isSelected = label === round.selectedAnswer; return <div key={label} className={`rounded-lg border px-3 py-2 text-sm ${isCorrect ? "border-green-300 bg-green-50" : isSelected ? "border-red-300 bg-red-50" : "bg-gray-50"}`}><span className="mr-2 font-bold">{label}.</span>{choice}{isCorrect ? " ✓" : isSelected ? " (your answer)" : ""}</div>; })}</div><div className="mt-4 rounded-xl bg-blue-50 p-4"><p className="text-xs font-bold uppercase text-blue-700">Solution</p><p className="mt-1 text-sm text-blue-950">{round.solution}</p></div></article>)}</div></section>

      <Link href="/multiplayer" className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">Return to Multiplayer</Link>
    </main>
  );
}
