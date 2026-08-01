"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Target,
  Trophy,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewSection from "@/components/dashboard/OverviewSection";
import SessionMetric from "@/components/dashboard/SessionMetric";
import StatCard from "@/components/dashboard/StatCard";
import TrainerSection from "@/components/dashboard/TrainerSection";
import { getDashboardData } from "@/lib/dashboardService";
import { calculateTrainerStats } from "@/lib/trainer";

import type { DashboardData } from "@/lib/dashboardService";

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">
      <DashboardHeader />

      <OverviewSection
        level={level}
        questionBank={questionBank}
        multiplayer={multiplayer}
      />

      <TrainerSection
        level={level}
        trainer={trainer}
      />

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
