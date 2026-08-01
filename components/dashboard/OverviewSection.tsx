import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Brain,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface OverviewSectionProps {
  level: {
    level: number;
    progress: number;
  };

  questionBank: {
    solved: number;
    bookmarked: number;
    totalQuestions: number;
  };

  multiplayer: {
    rank: string;
  };
}

const LEVEL_PROGRESS_GOAL = 30;

function getPercentage(
  value: number,
  total: number
) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((value / total) * 100)
  );
}

export default function OverviewSection({
  level,
  questionBank,
  multiplayer,
}: OverviewSectionProps) {
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
  );
}