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

  const questionsRemaining = Math.max(
    0,
    questionBank.totalQuestions -
      questionBank.solved
  );

  const levelProgressRemaining = Math.max(
    0,
    LEVEL_PROGRESS_GOAL - level.progress
  );

  const cardClassName =
    "group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Overview
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
            Overall Progress
          </h2>
        </div>

        <p className="max-w-md text-sm leading-6 text-gray-500">
          A quick view of your current training,
          question-bank progress, and saved review
          work.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className={cardClassName}>
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Trainer Level
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                Level {level.level}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700 transition group-hover:scale-105">
              <Brain size={22} />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs font-semibold text-gray-500">
              <span>{level.progress} / 30 progress</span>
              <span>{levelPercentage}%</span>
            </div>

            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-[width] duration-500"
                style={{
                  width: `${levelPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {levelProgressRemaining === 0
                ? "Ready to level up"
                : `${levelProgressRemaining} more to Level ${level.level + 1}`}
            </p>
          </div>
        </article>

        <article className={cardClassName}>
          <div className="absolute inset-x-0 top-0 h-1 bg-emerald-600" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Questions Solved
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                {questionBank.solved}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 transition group-hover:scale-105">
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs font-semibold text-gray-500">
              <span>
                {questionCompletionPercentage}% complete
              </span>

              <span>
                {questionBank.totalQuestions} total
              </span>
            </div>

            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
                style={{
                  width: `${questionCompletionPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {questionsRemaining === 0
                ? "Every available question solved"
                : `${questionsRemaining} questions remaining`}
            </p>
          </div>
        </article>

        <article className={cardClassName}>
          <div className="absolute inset-x-0 top-0 h-1 bg-amber-500" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Bookmarked
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                {questionBank.bookmarked}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-700 transition group-hover:scale-105">
              <Bookmark size={22} />
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-500">
            {questionBank.bookmarked === 0
              ? "Save difficult questions to build a focused review list."
              : `${questionBank.bookmarked} saved ${questionBank.bookmarked === 1 ? "question" : "questions"} ready for review.`}
          </p>

          <Link
            href="/practice/question-bank"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-gray-900 outline-none transition hover:gap-2 hover:text-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4"
          >
            Review questions
            <ArrowRight size={15} />
          </Link>
        </article>

        <article className="group relative overflow-hidden rounded-2xl border bg-gray-50 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-gray-400" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Multiplayer Rank
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                {multiplayer.rank}
              </p>
            </div>

            <div className="rounded-xl bg-gray-200 p-3 text-gray-600 transition group-hover:scale-105">
              <Lock size={22} />
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-500">
            Competitive rating and rank will appear
            here after multiplayer launches.
          </p>

          <span className="mt-4 inline-flex rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
            Coming Soon
          </span>
        </article>
      </div>
    </section>
  );
}
