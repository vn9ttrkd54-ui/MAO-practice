import styles from "@/components/challenge/challenge.module.css";
import ChallengeDivisionSelect from "@/components/challenge/ChallengeDivisionSelect";
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

export default async function ChallengePage({ searchParams }: { searchParams: Promise<{ division?: string }> }) {
  const params = await searchParams;
  const division = params.division === "Alpha" || params.division === "Theta" ? params.division : "Mu";
  const {
    dailyChallenge,
    attempt: existingAttempt,
    leaderboard,
    statistics,
    userLeaderboardEntry: userPosition,
  } = await getChallengeOverview(division);

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
    <main className={`${styles.page} min-h-[calc(100vh-4rem)] px-5 py-9 sm:px-8`}>
      <div className="mx-auto max-w-7xl">
        <header
          className={`${styles.hero} mb-8 min-h-36 overflow-hidden rounded-3xl border px-8 py-7 text-white sm:px-10`}
        >
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-100">
            Daily competition
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight">
            Challenge
          </h1>
          <div className="mt-4 h-1 w-16 rounded-full bg-[#fbbf24]" aria-hidden="true" />
        </header>

        <div className="challenge-layout">
          <section className={`${styles.panel} rounded-3xl border p-6 sm:p-7`}>
            <ChallengeDivisionSelect division={division} />
            {!dailyChallenge ? (
              <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-12 text-center">
                <span className="text-4xl" aria-hidden="true">📅</span>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                  Daily Challenge
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Today&apos;s {division} question has not been scheduled yet.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-slate-600">
                  Check back soon. A new official Challenge will appear here once
                  today&apos;s question is assigned.
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-300 pb-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                    Today&apos;s Challenge
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {formatChallengeDate(dailyChallenge.date)}
                  </h2>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-400 bg-white px-3 py-1 text-sm">
                    {dailyChallenge.question.division}
                  </span>
                  <span className="rounded-full border border-slate-400 bg-white px-3 py-1 text-sm">
                    {dailyChallenge.question.topic}
                  </span>
                  <span
                    aria-label={`Difficulty ${dailyChallenge.question.difficulty} out of 5`}
                    className="rounded-full border border-slate-400 bg-white px-3 py-1 text-sm text-[#b77900]"
                  >
                    {"★".repeat(dailyChallenge.question.difficulty)}
                    {"☆".repeat(5 - dailyChallenge.question.difficulty)}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-600">Question</h3>
                  <div className="mt-3 rounded-2xl border border-slate-300 bg-white p-5 text-lg leading-8">
                    <MathText>{dailyChallenge.question.question}</MathText>
                  </div>
                </div>

                <ChallengeAnswerForm
                  key={`${dailyChallenge.date}-${dailyChallenge.questionId}`}
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
