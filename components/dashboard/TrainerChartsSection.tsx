import { BarChart3, TrendingUp } from "lucide-react";

import type { TrainerHistorySummary } from "@/lib/dashboard";

interface TrainerChartsSectionProps {
  trainer: TrainerHistorySummary;
}

function formatSessionDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export default function TrainerChartsSection({
  trainer,
}: TrainerChartsSectionProps) {
  const maximumDivisionSessions = Math.max(
    1,
    ...trainer.sessionsByDivision.map(
      (item) => item.sessions
    )
  );

  const hasSessionData =
    trainer.recentSessionAccuracy.length > 0;

  return (
    <section className="mt-12">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
          <BarChart3 size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Trainer Trends
          </h2>

          <p className="mt-1 text-gray-600">
            Review recent accuracy and how your
            practice is distributed across divisions.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Recent Session Accuracy
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Last {trainer.recentSessionAccuracy.length || 0} sessions
              </h3>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <TrendingUp size={21} />
            </div>
          </div>

          {hasSessionData ? (
            <div className="mt-8">
              <div className="flex h-56 items-end gap-3 border-b border-gray-200 pb-1">
                {trainer.recentSessionAccuracy.map(
                  (session, index) => (
                    <div
                      key={session.id}
                      className="flex min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-2 text-xs font-semibold text-gray-700">
                        {session.accuracy}%
                      </span>

                      <div className="flex h-40 w-full items-end rounded-t-xl bg-gray-50 px-1">
                        <div
                          className="w-full rounded-t-lg bg-emerald-500 transition-all"
                          style={{
                            height: `${Math.max(
                              4,
                              session.accuracy
                            )}%`,
                          }}
                          title={`${session.accuracy}% accuracy across ${session.questionsAnswered} questions`}
                        />
                      </div>

                      <span className="mt-3 truncate text-xs text-gray-500">
                        {formatSessionDate(session.endedAt)}
                      </span>

                      <span className="mt-1 text-[11px] text-gray-400">
                        S{index + 1}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed bg-gray-50 px-5 py-12 text-center text-sm text-gray-500">
              Complete a Trainer session to start
              building your accuracy trend.
            </div>
          )}
        </article>

        <article className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">
            Sessions by Division
          </p>

          <h3 className="mt-1 text-xl font-bold">
            Practice Distribution
          </h3>

          <div className="mt-8 space-y-6">
            {trainer.sessionsByDivision.map((item) => {
              const width =
                trainer.sessionsCompleted > 0
                  ? Math.round(
                      (item.sessions /
                        maximumDivisionSessions) *
                        100
                    )
                  : 0;

              const share =
                trainer.sessionsCompleted > 0
                  ? Math.round(
                      (item.sessions /
                        trainer.sessionsCompleted) *
                        100
                    )
                  : 0;

              return (
                <div key={item.division}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-gray-800">
                      {item.division}
                    </span>

                    <span className="text-sm text-gray-500">
                      {item.sessions} sessions · {share}%
                    </span>
                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-sm leading-6 text-gray-500">
            Balanced practice across Mu, Alpha, and
            Theta can help reveal division-specific
            strengths and gaps.
          </p>
        </article>
      </div>
    </section>
  );
}
