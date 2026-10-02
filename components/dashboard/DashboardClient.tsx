"use client";

import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import ChallengeSection from "@/components/dashboard/ChallengeSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import MultiplayerSection from "@/components/dashboard/MultiplayerSection";
import OverviewSection from "@/components/dashboard/OverviewSection";
import QuestionBankSection from "@/components/dashboard/QuestionBankSection";
import RecentActivitySection from "@/components/dashboard/RecentActivitySection";
import RecentSessionsSection from "@/components/dashboard/RecentSessionsSection";
import TrainerChartsSection from "@/components/dashboard/TrainerChartsSection";
import TrainerSection from "@/components/dashboard/TrainerSection";
import { rankPageClass } from "@/components/multiplayer/RankTheme";
import {
  getDashboardData,
  type DashboardData,
} from "@/lib/dashboardService";

export default function DashboardClient({ userId }: { userId: string }) {
  return <DashboardSession key={userId} userId={userId} />;
}

function DashboardSession({ userId }: { userId: string }) {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [accountChanged, setAccountChanged] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      if ((session?.user.id ?? null) !== userId) {
        controller.abort();
        setDashboardData(null);
        setErrorMessage(null);
        setAccountChanged(true);
      }
    });

    async function loadDashboard() {
      try {
        const data = await getDashboardData(userId, controller.signal);

        if (!controller.signal.aborted) {
          setDashboardData(data);
          setErrorMessage(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load your dashboard right now. Please try again."
          );
        }
      }
    }

    void loadDashboard();

    return () => {
      controller.abort();
      subscription.unsubscribe();
    };
  }, [userId, retry]);

  if (accountChanged) {
    return <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <h1 className="text-2xl font-bold text-slate-950">Your account changed</h1>
      <p className="mt-2 text-slate-700">Reload to view the dashboard for your current account.</p>
      <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white">Reload dashboard</button>
    </main>;
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {errorMessage}
          <button type="button" onClick={() => { setErrorMessage(null); setRetry(value => value + 1); }} className="mt-3 block rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white">Retry dashboard</button>
        </div>
      </main>
    );
  }

  if (!dashboardData) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-6 py-10 sm:px-8" aria-busy="true" aria-label="Loading dashboard">
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
    <div className={`${styles.dashboard} ${rankPageClass(multiplayer.rank)} min-h-screen`}>
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">
        <DashboardHeader username={username} level={level} />

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

        <TrainerSection level={level} trainer={trainer} />

        <TrainerChartsSection trainer={trainer} />

        <RecentActivitySection activities={recentActivity} />

        <RecentSessionsSection
          sessionsCompleted={trainer.sessionsCompleted}
          sessions={recentTrainerSessions}
        />

        <QuestionBankSection questionBank={questionBank} />
      </main>
    </div>
  );
}
