import Link from "next/link";
import {
  Bookmark,
  Brain,
  CheckCircle2,
  CircleX,
  History,
  MinusCircle,
} from "lucide-react";

import type { DashboardActivity } from "@/lib/dashboardService";

interface RecentActivitySectionProps {
  activities: DashboardActivity[];
}

function formatActivityTime(timestamp: number) {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function RecentActivitySection({
  activities,
}: RecentActivitySectionProps) {
  return (
    <section className="mt-12">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          <History size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Recent Activity
          </h2>

          <p className="mt-1 text-gray-600">
            Your latest question attempts, bookmarks,
            and completed Trainer sessions.
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed bg-gray-50 p-8 text-center">
          <p className="font-semibold text-gray-900">
            No activity yet
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Solve a question or complete a Trainer
            session to begin building your history.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="divide-y">
            {activities.map((activity) => {
              if (activity.type === "trainer-session") {
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700">
                      <Brain size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">
                        Completed a {activity.division}{" "}
                        Trainer session
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {activity.questionsAnswered}{" "}
                        questions · {activity.accuracy}%
                        accuracy
                      </p>
                    </div>

                    <time className="shrink-0 text-xs font-medium text-gray-400">
                      {formatActivityTime(
                        activity.occurredAt
                      )}
                    </time>
                  </div>
                );
              }

              if (activity.type === "bookmark") {
                return (
                  <Link
                    key={activity.id}
                    href={`/practice/question-bank/${activity.questionId}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900"
                  >
                    <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                      <Bookmark
                        size={19}
                        fill="currentColor"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">
                        Bookmarked Question{" "}
                        {activity.questionNumber}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Saved for later review
                      </p>
                    </div>

                    <time className="shrink-0 text-xs font-medium text-gray-400">
                      {formatActivityTime(
                        activity.occurredAt
                      )}
                    </time>
                  </Link>
                );
              }

              const resultDetails =
                activity.result === "correct"
                  ? {
                      label: "Solved",
                      detail: "Correct answer",
                      icon: CheckCircle2,
                      iconClass:
                        "bg-emerald-50 text-emerald-700",
                    }
                  : activity.result === "incorrect"
                    ? {
                        label: "Attempted",
                        detail: "Incorrect answer",
                        icon: CircleX,
                        iconClass:
                          "bg-red-50 text-red-700",
                      }
                    : {
                        label: "Gave up on",
                        detail: "Marked for review",
                        icon: MinusCircle,
                        iconClass:
                          "bg-gray-100 text-gray-600",
                      };

              const ResultIcon = resultDetails.icon;

              return (
                <Link
                  key={activity.id}
                  href={`/practice/question-bank/${activity.questionId}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900"
                >
                  <div
                    className={`rounded-xl p-2.5 ${resultDetails.iconClass}`}
                  >
                    <ResultIcon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {resultDetails.label} Question{" "}
                      {activity.questionNumber}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {resultDetails.detail}
                    </p>
                  </div>

                  <time className="shrink-0 text-xs font-medium text-gray-400">
                    {formatActivityTime(
                      activity.occurredAt
                    )}
                  </time>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
