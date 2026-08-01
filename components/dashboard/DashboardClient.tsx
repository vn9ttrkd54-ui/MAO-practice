"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Brain,
  CheckCircle2,
  Lock,
  Target,
  Trophy,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import SessionMetric from "@/components/dashboard/SessionMetric";
import { getDashboardData } from "@/lib/dashboardService";
import { calculateTrainerStats } from "@/lib/trainer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import type { DashboardData } from "@/lib/dashboardService";

const LEVEL_PROGRESS_GOAL = 30;

function getPercentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((value / total) * 100)
  );
}

export default function DashboardClient() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  useEffect(() => {
    setDashboardData(getDashboardData());
  }, []);

  if (!dashboardData) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-6 py-10 sm:px-8">
        <div className="animate-pulse">
          <div className="h-10 w-52 rounded-lg bg-gray-200" />

          <div className="mt-4 h-5 w-full max-w-xl rounded bg-gray-100" />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 rounded-2xl border bg-gray-50"
              />
            ))}
          </div>
        </div>
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

  const levelPercentage = getPercentage(
    level.progress,
    LEVEL_PROGRESS_GOAL
  );

  const questionCompletionPercentage =
    getPercentage(
      questionBank.solved,
      questionBank.totalQuestions
    );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">
      <DashboardHeader />

      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Overview
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Overall Progress
          </h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Trainer Level
                </p>

                <p className="mt-2 text-3xl font-bold">
                  Level {level.level}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                <Brain size={22} />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>
                  {level.progress} progress
                </span>

                <span>
                  {LEVEL_PROGRESS_GOAL}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{
                    width: `${levelPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-gray-500">
                {LEVEL_PROGRESS_GOAL -
                  level.progress}{" "}
                more to Level {level.level + 1}
              </p>
            </div>
          </article>

          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Questions Solved
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {questionBank.solved}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <CheckCircle2 size={22} />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>
                  {questionCompletionPercentage}%
                  complete
                </span>

                <span>
                  {questionBank.totalQuestions} total
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{
                    width: `${questionCompletionPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Across Mu, Alpha, and Theta
              </p>
            </div>
          </article>

          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Bookmarked
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {questionBank.bookmarked}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                <Bookmark size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Questions saved for review and focused
              practice.
            </p>

            <Link
              href="/practice/question-bank"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-900 hover:underline"
            >
              Review questions
              <ArrowRight size={15} />
            </Link>
          </article>

          <article className="rounded-2xl border bg-gray-50 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Multiplayer Rank
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {multiplayer.rank}
                </p>
              </div>

              <div className="rounded-xl bg-gray-200 p-3 text-gray-600">
                <Lock size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Ranking unlocks after competitive
              multiplayer launches.
            </p>

            <span className="mt-4 inline-flex rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-600">
              Coming Soon
            </span>
          </article>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
            <Brain size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Trainer
            </h2>

            <p className="mt-1 text-gray-600">
              Practice continuously, improve accuracy,
              and increase your level.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Current Level"
            value={`Level ${level.level}`}
            detail={`${level.progress} / ${LEVEL_PROGRESS_GOAL} progress`}
          />

          <StatCard
            label="Sessions Completed"
            value={trainer.sessionsCompleted}
          />

          <StatCard
            label="Questions Answered"
            value={trainer.questionsAnswered}
          />

          <StatCard
            label="Overall Accuracy"
            value={`${trainer.accuracy}%`}
          />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Recent Trainer Sessions
            </h2>

            <p className="mt-1 text-gray-600">
              Your five most recent completed sessions.
            </p>
          </div>

          <p className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
            {trainer.sessionsCompleted} Total
          </p>
        </div>

        {recentTrainerSessions.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed bg-gray-50 px-6 py-10 text-center">
            <Target
              className="mx-auto text-gray-400"
              size={30}
            />

            <p className="mt-3 font-semibold">
              No Trainer sessions yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Complete a session to begin building
              your history.
            </p>

            <Link
              href="/practice/trainer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Start Training
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
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
                    className="rounded-xl border p-4 transition hover:bg-gray-50"
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

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <SessionMetric
                        label="Questions"
                        value={
                          stats.questionsAnswered
                        }
                      />

                      <SessionMetric
                        label="Correct"
                        value={stats.correct}
                      />

                      <SessionMetric
                        label="Incorrect"
                        value={stats.incorrect}
                      />

                      <SessionMetric
                        label="Gave Up"
                        value={stats.giveUps}
                      />
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

      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <BookOpen size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Question Bank
              </h2>

              <p className="mt-1 text-gray-600">
                Track solved, attempted, new, and
                bookmarked questions.
              </p>
            </div>
          </div>

          <Link
            href="/practice/question-bank"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
          >
            Open Question Bank
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Solved"
            value={questionBank.solved}
          />

          <StatCard
            label="Attempted"
            value={questionBank.attempted}
          />

          <StatCard
            label="New"
            value={questionBank.newQuestions}
          />

          <StatCard
            label="Bookmarked"
            value={questionBank.bookmarked}
          />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-gray-50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-3 text-gray-600 shadow-sm">
              <Trophy size={24} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">
                  Multiplayer
                </h2>

                <span className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                  Coming Soon
                </span>
              </div>

              <p className="mt-1 text-gray-600">
                Compete against multiple players and
                earn a rank.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Rank"
            value={multiplayer.rank}
            muted
          />

          <StatCard
            label="Rating"
            value={multiplayer.rating ?? "—"}
            muted
          />

          <StatCard
            label="Matches Played"
            value={multiplayer.matchesPlayed}
            muted
          />

          <StatCard
            label="Wins"
            value={multiplayer.wins}
            muted
          />

          <StatCard
            label="Average Placement"
            value={
              multiplayer.averagePlacement ?? "—"
            }
            muted
          />

          <StatCard
            label="Current Streak"
            value={multiplayer.currentStreak}
            muted
          />
        </div>
      </section>
    </main>
  );
}