import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";

import SessionMetric from "@/components/dashboard/SessionMetric";
import { calculateTrainerStats } from "@/lib/trainer";

import type { DashboardData } from "@/lib/dashboardService";

interface RecentSessionsSectionProps {
  sessionsCompleted: number;
  sessions: DashboardData["recentTrainerSessions"];
}

export default function RecentSessionsSection({
  sessionsCompleted,
  sessions,
}: RecentSessionsSectionProps) {
  return (
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
          {sessionsCompleted} Total
        </p>
      </div>

      {sessions.length === 0 ? (
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
          {sessions.map((session) => {
            const stats = calculateTrainerStats(
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
                    value={stats.questionsAnswered}
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
                  Level {session.startingLevel.level}
                  {" → "}
                  Level {session.endingLevel.level}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
