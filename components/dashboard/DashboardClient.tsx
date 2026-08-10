"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChallengeSection from "@/components/dashboard/ChallengeSection";
import MultiplayerSection from "@/components/dashboard/MultiplayerSection";
import OverviewSection from "@/components/dashboard/OverviewSection";
import QuestionBankSection from "@/components/dashboard/QuestionBankSection";
import RecentActivitySection from "@/components/dashboard/RecentActivitySection";
import RecentSessionsSection from "@/components/dashboard/RecentSessionsSection";
import TrainerChartsSection from "@/components/dashboard/TrainerChartsSection";
import TrainerSection from "@/components/dashboard/TrainerSection";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import { getDashboardData } from "@/lib/dashboardService";

import type { DashboardData } from "@/lib/dashboardService";

export default function DashboardClient() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await getDashboardData();

        if (!cancelled) {
          setDashboardData(data);
          setErrorMessage(null);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage(
            "Unable to load your dashboard right now. Please refresh and try again."
          );
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      </main>
    );
  }

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
    username,
    isAdmin,
    multiplayer,
    trainer,
    questionBank,
    challenge,
    level,
    recentTrainerSessions,
    recentActivity,
  } = dashboardData;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">
      <DashboardHeader
        username={username}
        level={level}
      />

      <DashboardQuickActions isAdmin={isAdmin} />

      <OverviewSection
        level={level}
        questionBank={questionBank}
        multiplayer={multiplayer}
      />

      <ChallengeSection
        currentStreak={challenge.currentStreak}
        longestStreak={challenge.longestStreak}
      />

      <MultiplayerSection multiplayer={multiplayer} />

      <TrainerSection
        level={level}
        trainer={trainer}
      />

      <TrainerChartsSection trainer={trainer} />

      <RecentActivitySection
        activities={recentActivity}
      />

      <RecentSessionsSection
        sessionsCompleted={trainer.sessionsCompleted}
        sessions={recentTrainerSessions}
      />

      <QuestionBankSection questionBank={questionBank} />
    </main>
  );
}
