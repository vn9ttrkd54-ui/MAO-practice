import Link from "next/link";
import Image from "next/image";
import { ArrowRight, RotateCcw } from "lucide-react";
import logo from "@/app/apple-icon.png";
import styles from "./trainer-summary.module.css";

import type { Division } from "@/types/question";
import type { LevelProgress } from "@/types/level";
import type {
  TrainerQuestionResult,
  TrainerHistoryPoint,
  TrainerSessionStats,
  TrainerQuestionItem,
} from "@/types/trainer";

type TrainerSummaryProps = {
  items: TrainerQuestionItem[];
  division: Division;
  stats: TrainerSessionStats;
  results: TrainerQuestionResult[];
  startingLevel: LevelProgress;
  endingLevel: LevelProgress;
  sessionSeconds: number;
  sessionHistory: TrainerHistoryPoint[];
  saveStatus: "idle" | "saving" | "saved" | "error";
  saveError: string | null;
  onRetrySave: () => void;
  hasAccount: boolean;
  onStartNewSession: () => void;
  onReturnToPractice: () => void;
};

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

function topicPerformance(results: TrainerQuestionResult[], questionById: Map<number, TrainerQuestionItem>) {
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
    missed: values.attempted - values.correct,
    accuracy:
      values.attempted > 0
        ? Math.round((100 * values.correct) / values.attempted)
        : 0,
  })).sort(
    (first, second) =>
      second.attempted - first.attempted ||
      first.topic.localeCompare(second.topic)
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TrainerSummary({
  items,
  division,
  stats,
  results,
  startingLevel,
  endingLevel,
  sessionSeconds,
  sessionHistory,
  saveStatus,
  saveError,
  onRetrySave,
  hasAccount,
  onStartNewSession,
  onReturnToPractice,
}: TrainerSummaryProps) {
  const saveReady = saveStatus === "saved";
  const questionById = new Map(items.map(item => [item.id, item]));
  const sessionScore =
    stats.correct - stats.incorrect - stats.giveUps;
  const totalQuestionSeconds = results.reduce(
    (total, result) => total + result.elapsedSeconds,
    0
  );
  const averageQuestionSeconds =
    results.length > 0
      ? Math.round(totalQuestionSeconds / results.length)
      : 0;
  const topics = topicPerformance(results, questionById);
  const rankedTopics = [...topics].sort(
    (first, second) =>
      second.correct - first.correct ||
      second.accuracy - first.accuracy ||
      second.attempted - first.attempted
  );
  const noCorrectTopics =
    stats.questionsAnswered > 0 && stats.correct === 0;
  const strongestTopic = !noCorrectTopics
    ? rankedTopics[0] ?? null
    : null;
  const focusTopic =
    [...topics].sort(
      (first, second) =>
        second.missed - first.missed ||
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
    ? stats.accuracy - previousSession.accuracy
    : null;
  const improvingStreak = [...recentSessions]
    .map(session => session.accuracy)
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
    <main className={styles.page}>
      <div className={styles.content}>
        <section>
          <header className={styles.header}>
            <Image src={logo} alt="" width={170} height={170} unoptimized className={styles.watermark} />
            <div className={styles.title}>
            <p className={styles.eyebrow}>
              {division} Division
            </p>

                <h1>
                  Daily Trainer Summary
                </h1>
                <p className={styles.intro}>
                  See what improved, where to focus next, and how this
                  session compares with your recent training.
                </p>
                <span className={styles.goldRule} aria-hidden="true" />
            </div>
              <div className={styles.accuracy}>
                <p>
                  Overall accuracy
                </p>
                <strong>{stats.accuracy}%</strong>
              </div>
          </header>

          <div className={styles.body}>
            {!saveReady ? <div role={saveStatus === "error" ? "alert" : "status"} className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
              <p>{saveStatus === "error" ? saveError : "Saving your session history…"}</p>
              <p className="mt-1 text-sm">Keep this page open until the session is confirmed. Answers already confirmed during practice are saved separately.</p>
              {saveStatus === "error" ? <button type="button" onClick={onRetrySave} className="mt-3 rounded-lg bg-slate-950 px-4 py-2 font-bold text-white">Retry session save</button> : null}
            </div> : <p role="status" className="mb-6 text-sm font-semibold text-emerald-800">{hasAccount ? "Session history saved." : "Session kept for this visit. Sign in before your next session to save history to an account."}</p>}
            <section className={styles.totals} aria-label="Session totals">
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

            <section className={styles.metrics} aria-label="Session metrics">
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
                  !saveReady ? "Pending save" : accuracyChange === null
                    ? "First session"
                    : `${accuracyChange > 0 ? "+" : ""}${accuracyChange}%`
                }
                detail="compared with your previous session"
              />
              <SummaryCard
                label="Improving streak"
                value={saveReady ? `${improvingStreak} session${improvingStreak === 1 ? "" : "s"}` : "Pending save"}
                detail="consecutive accuracy improvements"
              />
              <SummaryCard
                label="Session time"
                value={formatDuration(sessionSeconds)}
                detail="total training time"
              />
              <SummaryCard
                label="Average time"
                value={formatDuration(averageQuestionSeconds)}
                detail="per answered question"
              />
            </section>

            <section className={styles.analytics}>
              <div className={styles.chart}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className={styles.sectionLabel}>
                      This session
                    </p>
                    <h2 className={styles.sectionTitle}>
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
                        <div className={styles.topicTrack}>
                          <div
                            className={styles.topicFill}
                            style={{ width: `${topic.accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.chart}>
                <p className={styles.sectionLabel}>
                  Recent progress
                </p>
                <h2 className={styles.sectionTitle}>
                  Last five sessions
                </h2>

                {!hasAccount ? (
                  <div className={styles.accountPrompt}>
                    <p className="font-bold text-blue-950">
                      Create an account to compare sessions
                    </p>
                    <Link
                      href="/signup"
                      className={styles.accountLink}
                    >
                      Create Account
                    </Link>
                  </div>
                ) : recentSessions.length === 0 ? (
                  <p className="mt-6 text-slate-500">
                    {saveReady ? "Your session trend will appear here." : "Recent comparisons will appear after your session save is confirmed."}
                  </p>
                ) : (
                  <div className="mt-8 flex h-52 items-end gap-3">
                    {recentSessions.map((session, index) => {
                      const accuracy = session.accuracy;
                      const isCurrent =
                        index === recentSessions.length - 1;

                      return (
                        <div
                          key={session.id}
                          className="flex min-w-0 flex-1 flex-col items-center"
                        >
                          <div className="mb-2 text-center">
                            <p className="text-xs font-bold text-slate-600">
                              {accuracy}%
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                              {session.questionsAnswered} Q
                            </p>
                          </div>
                          <div className={styles.historyTrack}>
                            <div
                              className={
                                isCurrent
                                  ? styles.historyCurrent
                                  : styles.historyPast
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

            <section className={styles.insights}>
              <InsightCard
                eyebrow="Strongest topic"
                title={noCorrectTopics ? ":(" : strongestTopic?.topic ?? "Not enough data"}
                description={
                  noCorrectTopics
                    ? "No topics mastered this session."
                    : strongestTopic
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
                <p className={styles.sectionLabel}>
                  Review
                </p>
                <h2 className={styles.sectionTitle}>
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
                        className={styles.result}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-bold text-slate-950">
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
                            Correct answer: {result.correctAnswer} · Time: {formatDuration(result.elapsedSeconds)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-sm font-bold ${resultClasses(result.result)}`}
                          >
                            {resultLabel(result.result)}
                          </span>
                          {saveReady ? <Link
                            href={`/practice/question-bank/${result.questionId}`}
                            className={styles.review}
                          >
                            Review question
                          </Link> : <span className="text-sm text-slate-500">Review links unlock after the session is confirmed.</span>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={onStartNewSession}
                disabled={!saveReady}
                className={styles.primary}
              >
                <RotateCcw size={16} aria-hidden="true" />Start New Session
              </button>
              <button
                type="button"
                onClick={onReturnToPractice}
                disabled={!saveReady}
                className={styles.secondary}
              >
                Return to Practice<ArrowRight size={16} aria-hidden="true" />
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
  className = "text-slate-900",
}: {
  label: string;
  value: string | number;
  detail: string;
  className?: string;
}) {
  return (
    <div className={`${styles.metric} ${className}`}>
      <p className={styles.metricLabel}>
        {label}
      </p>
      <p className={styles.metricValue}>{value}</p>
      <p className={styles.metricDetail}>{detail}</p>
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
    <div className={`${styles.insight} ${className}`}>
      <p className={styles.sectionLabel}>
        {eyebrow}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
