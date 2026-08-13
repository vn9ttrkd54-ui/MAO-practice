import Link from "next/link";

import { questions } from "@/data/questions";

import type { Division } from "@/types/question";
import type { LevelProgress } from "@/types/level";
import type {
  TrainerQuestionResult,
  TrainerSessionRecord,
  TrainerSessionStats,
} from "@/types/trainer";

type TrainerSummaryProps = {
  division: Division;
  stats: TrainerSessionStats;
  results: TrainerQuestionResult[];
  startingLevel: LevelProgress;
  endingLevel: LevelProgress;
  sessionHistory: TrainerSessionRecord[];
  onStartNewSession: () => void;
  onReturnToPractice: () => void;
};

type TopicPerformance = {
  topic: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

const questionById = new Map(
  questions.map((question) => [question.id, question])
);

function resultLabel(result: TrainerQuestionResult["result"]) {
  if (result === "correct") return "Correct";
  if (result === "incorrect") return "Incorrect";
  return "Gave Up";
}

function resultClasses(result: TrainerQuestionResult["result"]) {
  if (result === "correct") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (result === "incorrect") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  return "border-amber-200 bg-amber-50 text-amber-800";
}

function topicPerformance(results: TrainerQuestionResult[]) {
  const topics = new Map<string, { attempted: number; correct: number }>();

  for (const result of results) {
    const topic = questionById.get(result.questionId)?.topic ?? "Other";
    const current = topics.get(topic) ?? { attempted: 0, correct: 0 };

    current.attempted += 1;

    if (result.result === "correct") {
      current.correct += 1;
    }

    topics.set(topic, current);
  }

  return Array.from(topics, ([topic, values]) => ({
    topic,
    ...values,
    accuracy:
      values.attempted > 0
        ? Math.round((values.correct / values.attempted) * 100)
        : 0,
  })).sort(
    (first, second) =>
      second.attempted - first.attempted ||
      first.topic.localeCompare(second.topic)
  );
}

function sessionAccuracy(session: TrainerSessionRecord) {
  if (session.results.length === 0) return 0;

  const correct = session.results.filter(
    (result) => result.result === "correct"
  ).length;

  return Math.round((correct / session.results.length) * 100);
}

export default function TrainerSummary({
  division,
  stats,
  results,
  startingLevel,
  endingLevel,
  sessionHistory,
  onStartNewSession,
  onReturnToPractice,
}: TrainerSummaryProps) {
  const sessionScore =
    stats.correct - stats.incorrect - stats.giveUps;
  const topics = topicPerformance(results);
  const rankedTopics = [...topics].sort(
    (first, second) =>
      second.accuracy - first.accuracy ||
      second.attempted - first.attempted
  );
  const strongestTopic = rankedTopics[0] ?? null;
  const focusTopic =
    [...topics].sort(
      (first, second) =>
        first.accuracy - second.accuracy ||
        second.attempted - first.attempted
    )[0] ?? null;
  const recentSessions = [...sessionHistory]
    .sort((first, second) => first.endedAt - second.endedAt)
    .slice(-5);
  const previousSession =
    recentSessions.length > 1
      ? recentSessions[recentSessions.length - 2]
      : null;
  const accuracyChange = previousSession
    ? stats.accuracy - sessionAccuracy(previousSession)
    : null;
  const improvingStreak = [...recentSessions]
    .map(sessionAccuracy)
    .reduce(
      (state, accuracy) => {
        if (
          state.previous !== null &&
          accuracy > state.previous
        ) {
          return {
            previous: accuracy,
            current: state.current + 1,
            best: Math.max(state.best, state.current + 1),
          };
        }

        return {
          previous: accuracy,
          current: 0,
          best: state.best,
        };
      },
      {
        previous: null as number | null,
        current: 0,
        best: 0,
      }
    ).current;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#e5e7eb] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-[#f8fafc] shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
          <header className="bg-gradient-to-r from-[#2563eb] via-[#2457d6] to-[#172554] px-6 py-8 text-white sm:px-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-100">
              {division} Division
            </p>

            <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black sm:text-5xl">
                  Daily Trainer Summary
                </h1>
                <p className="mt-3 max-w-2xl text-blue-100">
                  See what improved, where to focus next, and how this
                  session compares with your recent training.
                </p>
              </div>

              <div className="rounded-2xl border border-white/30 bg-white/10 px-6 py-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
                  Overall accuracy
                </p>
                <p className="mt-1 text-4xl font-black">{stats.accuracy}%</p>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Questions"
                value={stats.questionsAnswered}
                detail="completed this session"
                className="border-blue-200 bg-blue-50 text-blue-900"
              />
              <SummaryCard
                label="Correct"
                value={stats.correct}
                detail="answers mastered"
                className="border-emerald-200 bg-emerald-50 text-emerald-900"
              />
              <SummaryCard
                label="Incorrect"
                value={stats.incorrect}
                detail="questions to review"
                className="border-rose-200 bg-rose-50 text-rose-900"
              />
              <SummaryCard
                label="Gave Up"
                value={stats.giveUps}
                detail="solutions revealed"
                className="border-amber-200 bg-amber-50 text-amber-900"
              />
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Session score"
                value={sessionScore > 0 ? `+${sessionScore}` : sessionScore}
                detail="correct − incorrect − gave up"
              />
              <SummaryCard
                label="Level progress"
                value={`Level ${startingLevel.level} → ${endingLevel.level}`}
                detail={`${startingLevel.progress}/30 → ${endingLevel.progress}/30`}
              />
              <SummaryCard
                label="Accuracy change"
                value={
                  accuracyChange === null
                    ? "First session"
                    : `${accuracyChange > 0 ? "+" : ""}${accuracyChange}%`
                }
                detail="compared with your previous session"
              />
              <SummaryCard
                label="Improving streak"
                value={`${improvingStreak} session${improvingStreak === 1 ? "" : "s"}`}
                detail="consecutive accuracy improvements"
              />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                      This session
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Topic performance
                    </h2>
                  </div>
                  <p className="text-sm text-slate-500">
                    Accuracy · correct / attempted
                  </p>
                </div>

                {topics.length === 0 ? (
                  <p className="mt-6 text-slate-500">
                    Answer questions to unlock topic analytics.
                  </p>
                ) : (
                  <div className="mt-6 space-y-5">
                    {topics.map((topic) => (
                      <div key={topic.topic}>
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-bold text-slate-800">
                            {topic.topic}
                          </p>
                          <p className="text-sm font-semibold text-slate-600">
                            {topic.accuracy}% · {topic.correct}/{topic.attempted}
                          </p>
                        </div>
                        <div className="mt-2 h-3 overflow-hidden rounded-full border border-slate-300 bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
                            style={{ width: `${topic.accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Recent progress
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Last five sessions
                </h2>

                {recentSessions.length === 0 ? (
                  <p className="mt-6 text-slate-500">
                    Your session trend will appear here.
                  </p>
                ) : (
                  <div className="mt-8 flex h-52 items-end gap-3">
                    {recentSessions.map((session, index) => {
                      const accuracy = sessionAccuracy(session);
                      const isCurrent =
                        index === recentSessions.length - 1;

                      return (
                        <div
                          key={session.id}
                          className="flex min-w-0 flex-1 flex-col items-center"
                        >
                          <p className="mb-2 text-xs font-bold text-slate-600">
                            {accuracy}%
                          </p>
                          <div className="flex h-36 w-full items-end overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            <div
                              className={
                                isCurrent
                                  ? "w-full rounded-t-xl bg-gradient-to-t from-blue-700 to-blue-400"
                                  : "w-full rounded-t-xl bg-slate-400"
                              }
                              style={{
                                height: `${Math.max(accuracy, 4)}%`,
                              }}
                            />
                          </div>
                          <p className="mt-2 text-xs font-semibold text-slate-500">
                            {isCurrent ? "Current" : `S${index + 1}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2">
              <InsightCard
                eyebrow="Strongest topic"
                title={strongestTopic?.topic ?? "Not enough data"}
                description={
                  strongestTopic
                    ? `${strongestTopic.accuracy}% accuracy across ${strongestTopic.attempted} attempt${strongestTopic.attempted === 1 ? "" : "s"}.`
                    : "Complete a question to identify your strongest topic."
                }
                className="border-emerald-200 bg-emerald-50"
              />
              <InsightCard
                eyebrow="Focus next"
                title={focusTopic?.topic ?? "Not enough data"}
                description={
                  focusTopic
                    ? `${focusTopic.accuracy}% accuracy across ${focusTopic.attempted} attempt${focusTopic.attempted === 1 ? "" : "s"}. Review this topic next.`
                    : "Complete a question to receive a focus recommendation."
                }
                className="border-amber-200 bg-amber-50"
              />
            </section>

            <section className="mt-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Review
                </p>
                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  Session results
                </h2>
              </div>

              {results.length === 0 ? (
                <p className="mt-4 text-slate-500">
                  No questions were answered during this session.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {results.map((result, index) => {
                    const question = questionById.get(result.questionId);

                    return (
                      <article
                        key={`${result.questionId}-${index}`}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-black text-slate-950">
                              Question {index + 1}
                            </p>
                            {question ? (
                              <>
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                  {question.topic}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                  Difficulty {question.difficulty}/5
                                </span>
                              </>
                            ) : null}
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            Your answer: {result.selectedAnswer ?? "None"} ·
                            Correct answer: {result.correctAnswer}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-sm font-bold ${resultClasses(result.result)}`}
                          >
                            {resultLabel(result.result)}
                          </span>
                          <Link
                            href={`/practice/question-bank/${result.questionId}`}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Review question
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onStartNewSession}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 font-bold text-white shadow-lg shadow-blue-900/15 transition hover:brightness-110"
              >
                Start New Session
              </button>
              <button
                type="button"
                onClick={onReturnToPractice}
                className="rounded-xl border-2 border-slate-900 bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Return to Practice
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  className = "border-slate-200 bg-white text-slate-900",
}: {
  label: string;
  value: string | number;
  detail: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm opacity-70">{detail}</p>
    </div>
  );
}

function InsightCard({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
        {eyebrow}
      </p>
      <p className="mt-1 text-xl font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
