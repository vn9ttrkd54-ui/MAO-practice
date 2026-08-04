"use client";

import { useEffect, useState } from "react";

import type { MultiplayerRoundState } from "@/types/multiplayer";

const labels = ["A", "B", "C", "D", "E"];

export default function MatchQuestion({ round }: { round: MultiplayerRoundState }) {
  const [now, setNow] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const secondsLeft = now === null ? null : Math.max(0, Math.ceil((round.questionEndsAt - now) / 1000));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">{round.question.division} · {round.question.topic}</p>
          <h1 className="mt-1 text-2xl font-bold">Question {round.questionNumber} of {round.totalQuestions}</h1>
        </div>
        <div className={`rounded-2xl px-5 py-3 text-center ${secondsLeft !== null && secondsLeft <= 10 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-900"}`}>
          <p className="text-xs font-semibold uppercase">Time</p>
          <p className="text-2xl font-bold tabular-nums">{secondsLeft === null ? "--" : `${secondsLeft}s`}</p>
        </div>
      </header>

      <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-lg font-semibold leading-8">{round.question.question}</p>
        <div className="mt-6 grid gap-3">
          {round.question.choices.map((choice, index) => {
            const label = labels[index];
            const active = selected === label;
            return <button key={label} disabled={secondsLeft === null || secondsLeft === 0} onClick={() => setSelected(label)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${active ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "hover:bg-gray-50"} disabled:cursor-not-allowed disabled:opacity-60`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold">{label}</span><span>{choice}</span></button>;
          })}
        </div>
        <button disabled className="mt-6 w-full rounded-xl bg-gray-300 px-4 py-3 font-semibold text-gray-600">Answer submission arrives in M6</button>
      </section>
    </main>
  );
}
