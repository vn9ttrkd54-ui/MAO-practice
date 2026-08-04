import ChallengeAnswerForm from "@/components/challenge/ChallengeAnswerForm";
import ChallengeLeaderboard from "@/components/challenge/ChallengeLeaderboard";
import {
  getChallengeLeaderboard,
  getTodayChallenge,
  getUserChallengeAttempt,
} from "@/lib/challenge";
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
  const [dailyChallenge, existingAttempt, leaderboard] = await Promise.all([
    getTodayChallenge(),
    getUserChallengeAttempt(),
    getChallengeLeaderboard(),
  ]);

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
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          One question. One attempt. Every day.
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">Challenge</h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Solve the same official problem as the MAO community. You can
          participate without an account; saved attempts and streaks are coming
          in the next packs.
        </p>
      </header>

      <ChallengeLeaderboard entries={leaderboard} />

      <section className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        {!dailyChallenge ? (
          <div className="py-12 text-center">
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
              <p className="mt-3 text-lg leading-8">
                {dailyChallenge.question.question}
              </p>
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
    </main>
  );
}
