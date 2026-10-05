import FeedbackForm from "@/components/feedback/FeedbackForm";
import { questions } from "@/data/questions";
import styles from "./matchSurface.module.css";
import Link from "next/link";

import MathText from "@/components/math/MathText";
import RoundLeaderboard from "./RoundLeaderboard";
import { formatAnswerTime } from "@/lib/multiplayerRoundFeedback";
import type { MultiplayerMatchResult } from "@/types/multiplayer";

const labels = ["A", "B", "C", "D", "E"];

export default function MatchResults({ result }: { result: MultiplayerMatchResult }) {
  const isSpectator = result.viewerMode === "spectator";

  return (
    <main className={`${styles.page} mx-auto max-w-4xl px-6 py-8 sm:px-8`}>
      <header className={`${styles.header} text-center`}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Match complete</p>
        <h1 className="mt-2 text-4xl font-bold">{isSpectator ? "Final results" : `You placed #${result.placement}`}</h1>
        <p className="mt-2 text-lg text-gray-600">
          {isSpectator ? "The match has ended. See who won and review every solution." : `${result.score} total points`}
        </p>
        {!isSpectator && (result.ratingChange ? (
          <div className={`mx-auto mt-4 inline-flex rounded-full px-4 py-2 font-bold ${result.ratingChange.change >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
            {result.ratingChange.change >= 0 ? "+" : ""}{result.ratingChange.change} RP · {result.ratingChange.newRp} RP total
          </div>
        ) : (
          <div className="mx-auto mt-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">Unranked match</div>
        ))}
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold">Final leaderboard</h2>
        <RoundLeaderboard players={result.finalLeaderboard} questionNumber={result.rounds.at(-1)?.questionNumber ?? 0} closed final />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Question review</h2>
        <div className="mt-3 space-y-4">
          {result.rounds.map((round) => (
            <article key={round.questionId} className={`${styles.panel} rounded-2xl border bg-white p-5 shadow-sm`}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold">Question {round.questionNumber}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isSpectator ? "bg-blue-100 text-blue-800" : round.selectedAnswer === null ? "bg-slate-100 text-slate-700" : round.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                  {isSpectator ? "Official answer" : round.selectedAnswer === null ? "Blank / Give up · 0"
                    : `${round.correct ? "Correct" : "Incorrect"} · ${round.pointsEarned > 0 ? "+" : ""}${round.pointsEarned}`}
                </span>
              </div>

              {!isSpectator ? <p className="mt-2 text-sm text-slate-600">Answer time: {formatAnswerTime(round.answerTimeMs)}</p> : null}
              <div className="mt-3 font-medium leading-7">
                <MathText>{round.question}</MathText>
              </div>

              <div className="mt-4 grid gap-2">
                {round.choices.map((choice, index) => {
                  const label = labels[index];
                  const isCorrect = label === round.correctAnswer;
                  const isSelected = !isSpectator && label === round.selectedAnswer;
                  return (
                    <div key={label} className={`flex items-start rounded-lg border px-3 py-2 text-sm ${isCorrect ? "border-green-300 bg-green-50" : isSelected ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
                      <span className="mr-2 font-bold">{label}.</span>
                      <div className="min-w-0 flex-1"><MathText>{choice}</MathText></div>
                      {isCorrect ? <span className="ml-2">✓</span> : isSelected ? <span className="ml-2">(your answer)</span> : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-bold uppercase text-blue-700">Solution</p>
                <div className="mt-2 leading-7 text-blue-950">
                  <MathText>{round.solution}</MathText>
                </div>
              </div>
              {(() => {
                const question = questions.find(item => item.id === round.questionId);
                return question ? <details className={styles.report}>
                  <summary>Report an error · Question {round.questionNumber}</summary>
                  <FeedbackForm kind="question_report" questionId={round.questionId} division={question.division} />
                </details> : null;
              })()}
            </article>
          ))}
        </div>
      </section>

      <Link href="/multiplayer" className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
        Return to Multiplayer
      </Link>
    </main>
  );
}
