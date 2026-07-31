"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Trophy,
  Brain,
  BookOpen,
} from "lucide-react";

import {
  getDashboardData,
} from "@/lib/dashboardService";

import {
  calculateTrainerStats,
} from "@/lib/trainer";

import type {
  DashboardData,
} from "@/lib/dashboardService";

export default function DashboardClient() {
  const [
    dashboardData,
    setDashboardData,
  ] = useState<DashboardData | null>(null);

  useEffect(() => {
    setDashboardData(
      getDashboardData()
    );
  }, []);

  if (!dashboardData) {
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-6 text-gray-500">
          Loading your progress...
        </p>
      </main>
    );
  }

  const {
    multiplayer,
    trainer,
    questionBank,
    level,
    recentTrainerSessions,
  } = dashboardData;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-3 text-gray-600">
        Review your progress, practice activity,
        and competitive status.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          Overall Progress
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Trainer Level
            </p>

            <p className="mt-1 text-3xl font-bold">
              Level {level.level}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {level.progress} / 30 to Level{" "}
              {level.level + 1}
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Multiplayer Rank
            </p>

            <p className="mt-1 text-3xl font-bold">
              {multiplayer.rank}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Competitive mode coming soon
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Questions Solved
            </p>

            <p className="mt-1 text-3xl font-bold">
              {questionBank.solved}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {questionBank.totalQuestions} total
              questions
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Bookmarked
            </p>

            <p className="mt-1 text-3xl font-bold">
              {questionBank.bookmarked}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Saved Question Bank questions
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 border rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg border p-3">
              <Trophy size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Multiplayer
              </h2>

              <p className="mt-1 text-gray-600">
                Compete against multiple players
                and earn a competitive rank.
              </p>
            </div>
          </div>

          <span className="rounded-full border px-4 py-2 text-sm font-semibold">
            Coming Soon
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Rank
            </p>

            <p className="mt-1 text-2xl font-bold">
              {multiplayer.rank}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Rating
            </p>

            <p className="mt-1 text-2xl font-bold">
              {multiplayer.rating ?? "—"}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Matches Played
            </p>

            <p className="mt-1 text-2xl font-bold">
              {multiplayer.matchesPlayed}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Wins
            </p>

            <p className="mt-1 text-2xl font-bold">
              {multiplayer.wins}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Average Placement
            </p>

            <p className="mt-1 text-2xl font-bold">
              {multiplayer.averagePlacement ??
                "—"}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Current Streak
            </p>

            <p className="mt-1 text-2xl font-bold">
              {multiplayer.currentStreak}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Ranking and rating calculations will be
          added after the multiplayer match system
          is designed.
        </p>
      </section>

      <section className="mt-10">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border p-3">
            <Brain size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Trainer
            </h2>

            <p className="mt-1 text-gray-600">
              Practice continuously, improve your
              accuracy, and increase your level.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Current Level
            </p>

            <p className="mt-1 text-3xl font-bold">
              Level {level.level}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {level.progress} / 30 progress
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Sessions Completed
            </p>

            <p className="mt-1 text-3xl font-bold">
              {trainer.sessionsCompleted}
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Questions Answered
            </p>

            <p className="mt-1 text-3xl font-bold">
              {trainer.questionsAnswered}
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Overall Accuracy
            </p>

            <p className="mt-1 text-3xl font-bold">
              {trainer.accuracy}%
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 border rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Recent Trainer Sessions
            </h2>

            <p className="mt-1 text-gray-600">
              Your five most recent MAO Trainer
              sessions.
            </p>
          </div>

          <p className="font-semibold">
            {trainer.sessionsCompleted} Total
          </p>
        </div>

        {recentTrainerSessions.length === 0 ? (
          <p className="mt-6 text-gray-500">
            No Trainer sessions have been
            completed yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {recentTrainerSessions.map(
              (session) => {
                const stats =
                  calculateTrainerStats(
                    session.results
                  );

                const sessionScore =
                  stats.correct -
                  stats.incorrect -
                  stats.giveUps;

                return (
                  <article
                    key={session.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-bold">
                          {session.division} Division
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(
                            session.endedAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {stats.accuracy}% Accuracy
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Score:{" "}
                          {sessionScore > 0
                            ? `+${sessionScore}`
                            : sessionScore}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6 text-sm">
                      <p>
                        Questions:{" "}
                        <strong>
                          {stats.questionsAnswered}
                        </strong>
                      </p>

                      <p>
                        Correct:{" "}
                        <strong>
                          {stats.correct}
                        </strong>
                      </p>

                      <p>
                        Incorrect:{" "}
                        <strong>
                          {stats.incorrect}
                        </strong>
                      </p>

                      <p>
                        Gave Up:{" "}
                        <strong>
                          {stats.giveUps}
                        </strong>
                      </p>
                    </div>

                    <div className="mt-4 border-t pt-4 text-sm text-gray-500">
                      Level{" "}
                      {session.startingLevel.level}
                      {" → "}
                      Level{" "}
                      {session.endingLevel.level}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      <section className="mt-10 border rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border p-3">
            <BookOpen size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Question Bank
            </h2>

            <p className="mt-1 text-gray-600">
              Track your solved, attempted, new,
              and bookmarked questions.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Solved
            </p>

            <p className="mt-1 text-2xl font-bold">
              {questionBank.solved}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Attempted
            </p>

            <p className="mt-1 text-2xl font-bold">
              {questionBank.attempted}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              New
            </p>

            <p className="mt-1 text-2xl font-bold">
              {questionBank.newQuestions}
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <p className="text-sm text-gray-500">
              Bookmarked
            </p>

            <p className="mt-1 text-2xl font-bold">
              {questionBank.bookmarked}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}