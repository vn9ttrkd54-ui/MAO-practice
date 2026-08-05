import ChallengeAnswerForm from "@/components/challenge/ChallengeAnswerForm";
import ChallengeLeaderboard from "@/components/challenge/ChallengeLeaderboard";
import ChallengePersonalStats from "@/components/challenge/ChallengePersonalStats";
import MathText from "@/components/math/MathText";
import { getChallengeOverview } from "@/lib/challenge";
import type { ChallengeSubmissionResult } from "@/types/challenge";

export const dynamic = "force-dynamic";

function formatChallengeDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function ChallengePage() {
  const {
    dailyChallenge,
    attempt: existingAttempt,
    leaderboard,
    statistics,
    userLeaderboardEntry: userPosition,
  } = await getChallengeOverview();

  const initialResult: ChallengeSubmissionResult | null =
    dailyChallenge && existingAttempt
      ? {
          challengeDate: existingAttempt.challengeDate,
          questionId: existingAttempt.questionId,
          selectedAnswer: existingAttempt.selectedAnswer,
          correct: existingAttempt.correct,
          correctAnswer: dailyChallenge.question.answer,
          solution: dailyChallenge.question.solution,
          saved: true,
        }
      : null;

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8" style={{ paddingTop: "34px", paddingBottom: "34px" }}>
      <header
        className="overflow-hidden rounded-3xl text-white shadow-lg"
        style={{ background: "linear-gradient(120deg, #ea580c 0%, #f59e0b 55%, #facc15 100%)", color: "white", padding: "30px 38px", marginBottom: "32px", minHeight: "150px" }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">Daily competition</p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ marginTop: "12px", lineHeight: 1.08 }}>Challenge</h1>
      </header>

      <div className="challenge-layout">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-7">
          {!dailyChallenge ? (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl px-6 py-12 text-center" style={{ backgroundColor: "#f8fafc" }}>
            <span className="text-4xl" aria-hidden="true">📅</span>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Daily Challenge
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Today&apos;s question has not been scheduled yet.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Check back soon. A new official Challenge will appear here once
              today&apos;s question is assigned.
            </p>
          </div>
          ) : (
          <>
            <div className="border-b pb-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Today&apos;s Challenge
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {formatChallengeDate(dailyChallenge.date)}
              </h2>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border px-3 py-1 text-sm">
                {dailyChallenge.question.division}
              </span>
              <span className="rounded-full border px-3 py-1 text-sm">
                {dailyChallenge.question.topic}
              </span>
              <span
                aria-label={`Difficulty ${dailyChallenge.question.difficulty} out of 5`}
                className="rounded-full border px-3 py-1 text-sm"
              >
                {"★".repeat(dailyChallenge.question.difficulty)}
                {"☆".repeat(5 - dailyChallenge.question.difficulty)}
              </span>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-500">Question</h3>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-lg leading-8"><MathText>{dailyChallenge.question.question}</MathText></div>
            </div>

            <ChallengeAnswerForm
              challengeDate={dailyChallenge.date}
              questionId={dailyChallenge.questionId}
              choices={dailyChallenge.question.choices}
              initialResult={initialResult}
            />
          </>
          )}
        </section>

        <aside className="challenge-sidebar">
          <ChallengePersonalStats statistics={statistics} position={userPosition} />
          <ChallengeLeaderboard entries={leaderboard} />
        </aside>
      </div>

      <style>{`
        .challenge-layout { display: grid; gap: 24px; align-items: start; }
        .challenge-sidebar { display: grid; gap: 24px; }
        @media (min-width: 1024px) {
          .challenge-layout { grid-template-columns: minmax(0, 1fr) 360px; }
          .challenge-sidebar { position: sticky; top: 24px; }
        }
      `}</style>
    </main>
  );
}
