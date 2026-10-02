"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type {
  AnswerChoice,
  Division,
  Question,
} from "@/types/question";

import type {
  TrainerQuestionResult,
  TrainerSessionRecord,
  TrainerQuestionItem,
  TrainerHistoryPoint,
} from "@/types/trainer";

import type {
  LevelProgress,
} from "@/types/level";

import {
  calculateTrainerStats,
} from "@/lib/trainer";
import { getNextTrainerSelection, TrainerAccountChangedError } from "@/lib/services/trainerSelectionService";
import { createClient } from "@/lib/supabase/client";
import {
  applyAdaptiveTrainerResult,
  createAdaptiveTrainerState,
  isTrainerChallengeQuestion,
  type AdaptiveTrainerState,
} from "@/lib/trainerAdaptive";

import {
  saveVerifiedTrainerResult,
} from "@/lib/services/progressService";

import {
  saveTrainerSession,
} from "@/lib/services/trainerHistoryService";

import TrainerSetup from "@/components/trainer/TrainerSetup";
import TrainerHeader from "@/components/trainer/TrainerHeader";
import TrainerQuestion from "@/components/trainer/TrainerQuestion";
import TrainerStatsSidebar from "@/components/trainer/TrainerStatsSidebar";
import EndSessionDialog from "@/components/trainer/EndSessionDialog";
import TrainerSummary from "@/components/trainer/TrainerSummary";
import LevelUpBanner from "@/components/trainer/LevelUpBanner";

import { createPracticeAttempt, type PracticeAttempt } from "@/lib/services/practiceAttemptService";
import { MAX_TRAINER_SESSION_RESULTS } from "@/lib/trainerSessionSave";

const DEFAULT_LEVEL: LevelProgress = {
  level: 1,
  progress: 0,
};

export default function TrainerClient({ items }: { items: TrainerQuestionItem[] }) {
  const router = useRouter();
  const selectionRequest = useRef<AbortController | null>(null);
  const sessionOwner = useRef<string | null | undefined>(undefined);
  const [accountChanged, setAccountChanged] = useState(false);
  const attempt = useRef<PracticeAttempt | null>(null);
  const pending = useRef<{ answer: AnswerChoice | null; time: number; answeredAt: number } | null>(null);
  const saveBusy = useRef(false);
  const sessionId = useRef<string | null>(null);
  const pendingSession = useRef<TrainerSessionRecord | null>(null);
  const sessionSaveRequest = useRef<AbortController | null>(null);
  const [sessionSaveStatus, setSessionSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [sessionSaveError, setSessionSaveError] = useState<string | null>(null);
  const [hasPending, setHasPending] = useState(false);

  const [division, setDivision] =
    useState<Division>("Mu");

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState<Question | null>(null);

  const [
    sessionStarted,
    setSessionStarted,
  ] = useState(false);

  const [
    levelUpLevel,
    setLevelUpLevel,
  ] = useState<number | null>(null);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<AnswerChoice | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [adaptiveState, setAdaptiveState] =
    useState<AdaptiveTrainerState | null>(null);

  const [currentIsChallenge, setCurrentIsChallenge] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [startTime, setStartTime] =
    useState(() => Date.now());

  const [questionFinishedAt, setQuestionFinishedAt] =
    useState<number | null>(null);

  const [now, setNow] =
    useState(() => Date.now());

  const [
    sessionStartedAt,
    setSessionStartedAt,
  ] = useState<number | null>(null);

  const [
    sessionEndedAt,
    setSessionEndedAt,
  ] = useState<number | null>(null);

  const [results, setResults] =
    useState<TrainerQuestionResult[]>([]);

  const [
    trainerHistory,
    setTrainerHistory,
  ] = useState<TrainerHistoryPoint[]>([]);

  const [hasAccount, setHasAccount] =
    useState(false);

  const [startError, setStartError] =
    useState<string | null>(null);

  const [
    showEndDialog,
    setShowEndDialog,
  ] = useState(false);

  const [
    showSummary,
    setShowSummary,
  ] = useState(false);

  const [
    levelProgress,
    setLevelProgress,
  ] = useState<LevelProgress>(DEFAULT_LEVEL);

  const [
    startingLevelProgress,
    setStartingLevelProgress,
  ] = useState<LevelProgress>(DEFAULT_LEVEL);

  useEffect(() => {
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      if (sessionOwner.current !== undefined && sessionOwner.current !== (session?.user.id ?? null)) {
        selectionRequest.current?.abort();
        selectionRequest.current = null;
        attempt.current = null;
        sessionSaveRequest.current?.abort();
        sessionSaveRequest.current = null;
        setAccountChanged(true);
        setIsSaving(false);
      }
    });
    return () => {
      subscription.unsubscribe();
      selectionRequest.current?.abort();
      selectionRequest.current = null;
      attempt.current = null;
      sessionSaveRequest.current?.abort();
      sessionSaveRequest.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sessionStarted || showSummary || accountChanged) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [sessionStarted, showSummary, accountChanged]);

  const sessionStats =
    calculateTrainerStats(results);

  const openAttempt = (question: Question) => {
    const fresh = createPracticeAttempt(question.id, true, sessionOwner.current);
    attempt.current = fresh;
    pending.current = null;
    setHasPending(false);
    void fresh.prepare().catch((error: unknown) => {
      if (attempt.current === fresh) setStartError(error instanceof Error ? error.message : "Unable to start this attempt.");
    });
  };

  const handleStartSession = async () => {
    if (isSaving || selectionRequest.current || accountChanged) {
      return;
    }
    const controller = new AbortController();
    selectionRequest.current = controller;
    setIsSaving(true);
    setStartError(null);

    try {
      const { question: firstQuestion, level: currentLevel, userId } = await getNextTrainerSelection(
        items, { division, previousQuestionId: null }, { signal: controller.signal, includeLevel: true },
      );
      if (selectionRequest.current !== controller || controller.signal.aborted) return;

      if (!firstQuestion) {
        setStartError(
          `There are currently no eligible ${division} questions.`
        );
        return;
      }

      sessionOwner.current = userId;
      sessionId.current = crypto.randomUUID();
      pendingSession.current = null;
      setSessionSaveStatus("idle");
      setSessionSaveError(null);
      setTrainerHistory([]);
      openAttempt(firstQuestion);
      setCurrentQuestion(firstQuestion);
      setAdaptiveState(createAdaptiveTrainerState(firstQuestion.difficulty));
      setCurrentIsChallenge(false);
      setSelectedAnswer(null);
      setSubmitted(false);
      setResults([]);

      const startedAt = Date.now();

      setStartTime(startedAt);
      setQuestionFinishedAt(null);
      setNow(startedAt);
      setSessionStartedAt(startedAt);
      setSessionEndedAt(null);
      setLevelProgress(currentLevel);
      setStartingLevelProgress(currentLevel);
      setHasAccount(userId !== null);
      setSessionStarted(true);
      setShowSummary(false);
      setShowEndDialog(false);
      setStartError(null);
    } catch (error) {
      if (selectionRequest.current !== controller || controller.signal.aborted) return;
      setStartError(
        error instanceof Error ? error.message : "Unable to start Trainer right now. Please try again."
      );
    } finally {
      if (selectionRequest.current === controller) {
        selectionRequest.current = null;
        setIsSaving(false);
      }
    }
  };

  const handleSave = async (answer: AnswerChoice | null) => {
    if (!currentQuestion || !attempt.current || submitted || isSaving || saveBusy.current || accountChanged || pendingSession.current) return;
    saveBusy.current = true;
    const answeredAt = Date.now();
    pending.current ??= { answer, time: Math.floor((answeredAt - startTime) / 1000), answeredAt };
    const original = pending.current;
    setHasPending(true);
    setSelectedAnswer(original.answer);
    setQuestionFinishedAt(original.answeredAt);
    setIsSaving(true);
    setStartError(null);
    try {
      const savedResult = await saveVerifiedTrainerResult(currentQuestion.id, original.answer, original.time, attempt.current, currentQuestion);
      const levelChange = savedResult.levelChange;
      setLevelProgress({ level: levelChange.level, progress: levelChange.progress });
      if (levelChange.leveledUp) setLevelUpLevel(levelChange.level);
      const newResult: TrainerQuestionResult = {
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.number,
        selectedAnswer: original.answer,
        correctAnswer: currentQuestion.answer,
        result: original.answer === null ? "give-up" : savedResult.isCorrect ? "correct" : "incorrect",
        elapsedSeconds: original.time,
      };
      setResults((currentResults) => [...currentResults, newResult]);
      setAdaptiveState((current) => current ? applyAdaptiveTrainerResult(current, newResult.result, currentIsChallenge) : current);
      setNow(original.answeredAt);
      setSubmitted(true);
    } catch (error) {
      setStartError(error instanceof Error ? error.message : "Unable to save this result. Please retry.");
    } finally {
      saveBusy.current = false;
      setIsSaving(false);
    }
  };

  const finishSession = async () => {
    if (sessionSaveRequest.current || accountChanged || sessionStartedAt === null || !sessionId.current
      || sessionOwner.current === undefined || sessionSaveStatus === "saved") return;
    // Freeze identity, duration, levels and answers once. A lost confirmation
    // must resend this exact session rather than invent a new UUID or end time.
    pendingSession.current ??= {
        id: sessionId.current,
        division,
        startedAt: sessionStartedAt,
        endedAt: Date.now(),
        startingLevel: { ...startingLevelProgress },
        endingLevel: { ...levelProgress },
        results: results.map(result => ({ ...result })),
    };
    const controller = new AbortController();
    sessionSaveRequest.current = controller;
    setSessionEndedAt(pendingSession.current.endedAt);
    setShowEndDialog(false);
    setShowSummary(true);
    setSessionSaveStatus("saving");
    setSessionSaveError(null);
    try {
      const receipt = await saveTrainerSession(pendingSession.current, sessionOwner.current, controller.signal);
      if (controller.signal.aborted || sessionSaveRequest.current !== controller) return;
      setTrainerHistory(receipt.recentSessions);
      setSessionSaveStatus("saved");
    } catch (error) {
      if (controller.signal.aborted || sessionSaveRequest.current !== controller) return;
      setSessionSaveStatus("error");
      setSessionSaveError(error instanceof Error ? error.message : "Unable to confirm this session. Please retry session save.");
    } finally {
      if (sessionSaveRequest.current === controller) sessionSaveRequest.current = null;
    }
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion || !submitted || isSaving || saveBusy.current || selectionRequest.current || accountChanged || pendingSession.current) {
      return;
    }

    if (results.length >= MAX_TRAINER_SESSION_RESULTS) {
      await finishSession();
      return;
    }

    const controller = new AbortController();
    selectionRequest.current = controller;
    setIsSaving(true);
    setStartError(null);

    try {
      const nextQuestionNumber = results.length + 1;
      const forceChallenge = isTrainerChallengeQuestion(nextQuestionNumber);
      const { question: nextQuestion } =
        await getNextTrainerSelection(items, {
          division,
          previousQuestionId:
            currentQuestion.id,
          targetDifficulty: adaptiveState?.difficulty,
          sessionResults: results,
          forceChallenge,
        }, { signal: controller.signal, expectedUserId: sessionOwner.current });
      if (selectionRequest.current !== controller || controller.signal.aborted) return;

      if (!nextQuestion) {
        await finishSession();
        return;
      }

      openAttempt(nextQuestion);
      setCurrentQuestion(nextQuestion);
      setCurrentIsChallenge(forceChallenge);
      setSelectedAnswer(null);
      setSubmitted(false);
      const startedAt = Date.now();
      setStartTime(startedAt);
      setQuestionFinishedAt(null);
      setNow(startedAt);
      setStartError(null);
    } catch (error) {
      if (selectionRequest.current !== controller || controller.signal.aborted) return;
      if (error instanceof TrainerAccountChangedError) setAccountChanged(true);
      setStartError(
        error instanceof Error ? error.message : "Unable to load the next question. Please try again."
      );
    } finally {
      if (selectionRequest.current === controller) {
        selectionRequest.current = null;
        setIsSaving(false);
      }
    }
  };

  const handleEndSession = () => {
    if (!isSaving && !accountChanged && (!hasPending || submitted)) {
      setShowEndDialog(true);
    }
  };

  const handleConfirmEndSession = async () => {
    if (isSaving || saveBusy.current || accountChanged || (hasPending && !submitted)) return;
    await finishSession();
  };

  const handleStartNewSession = () => {
    if (pendingSession.current && sessionSaveStatus !== "saved") return;
    sessionOwner.current = undefined;
    sessionId.current = null;
    pendingSession.current = null;
    setSessionSaveStatus("idle");
    setSessionSaveError(null);
    attempt.current = null;
    pending.current = null;
    setHasPending(false);
    setShowSummary(false);
    setShowEndDialog(false);
    setSessionStarted(false);
    setCurrentQuestion(null);
    setAdaptiveState(null);
    setCurrentIsChallenge(false);
    setSessionStartedAt(null);
    setSessionEndedAt(null);
    setQuestionFinishedAt(null);
    setSelectedAnswer(null);
    setSubmitted(false);
    setResults([]);
    setStartError(null);
  };

  const handleReturnToPractice = () => {
    if (pendingSession.current && sessionSaveStatus !== "saved") return;
    router.push("/practice");
  };

  if (accountChanged) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12 text-slate-950">
        <h1 className="text-3xl font-bold">Your account changed</h1>
        <p role="alert" className="mt-4">Reload Trainer to start a new session. This session will not be saved to a different account.</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">Reload Trainer</button>
      </main>
    );
  }

  if (!sessionStarted) {
    return (
      <TrainerSetup
        division={division}
        error={startError}
        loading={isSaving}
        onDivisionChange={(newDivision) => {
          setDivision(newDivision);
          setStartError(null);
        }}
        onStart={() => {
          void handleStartSession();
        }}
      />
    );
  }

  if (showSummary) {
    return (
      <TrainerSummary
        items={items}
        division={division}
        stats={sessionStats}
        results={results}
        startingLevel={startingLevelProgress}
        endingLevel={levelProgress}
        sessionSeconds={
          sessionStartedAt === null
            ? 0
            : Math.max(
                0,
                Math.floor(
                  ((sessionEndedAt ?? now) - sessionStartedAt) / 1_000
                )
              )
        }
        sessionHistory={trainerHistory}
        saveStatus={sessionSaveStatus}
        saveError={sessionSaveError}
        onRetrySave={() => { void finishSession(); }}
        hasAccount={hasAccount}
        onStartNewSession={handleStartNewSession}
        onReturnToPractice={handleReturnToPractice}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <main className="max-w-5xl mx-auto p-8">
        <section className="border rounded-xl p-6">
          <h1 className="text-3xl font-bold">
            No Eligible Questions
          </h1>

          <p className="mt-3 text-gray-600">
            Every available question in this division
            is currently inside its 30-day cooldown.
          </p>

          <button
            type="button"
            onClick={handleStartNewSession}
            className="mt-6 border rounded-lg px-5 py-3 hover:bg-gray-100"
          >
            Choose Another Division
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#e5e7eb] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
      {startError ? (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {startError}
        </div>
      ) : null}

      <TrainerHeader
        division={division}
        level={levelProgress.level}
        levelProgress={levelProgress.progress}
      />

      <div className="trainer-workspace mt-6">
        <div>
          <TrainerQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            submitted={submitted}
            saving={isSaving}
            answerLocked={hasPending}
            onSelectAnswer={setSelectedAnswer}
            onSubmit={() => {
              void handleSave(selectedAnswer);
            }}
            onGiveUp={() => {
              void handleSave(null);
            }}
            onNextQuestion={() => {
              void handleNextQuestion();
            }}
          />
        </div>

        <aside className="trainer-sidebar">
          <TrainerStatsSidebar
            difficulty={currentQuestion.difficulty}
            questionSeconds={Math.max(
              0,
              Math.floor(
                ((questionFinishedAt ?? now) - startTime) / 1_000
              )
            )}
            sessionSeconds={Math.max(
              0,
              Math.floor(
                (now - (sessionStartedAt ?? now)) / 1_000
              )
            )}
            correct={sessionStats.correct}
            incorrect={sessionStats.incorrect}
            giveUps={sessionStats.giveUps}
            onEndSession={handleEndSession}
          />
        </aside>
      </div>

      <style jsx>{`
        .trainer-workspace {
          display: grid;
          gap: 24px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .trainer-workspace {
            grid-template-columns: minmax(0, 1fr) 300px;
          }

          .trainer-sidebar {
            position: sticky;
            top: 24px;
          }
        }
      `}</style>

      <EndSessionDialog
        open={showEndDialog}
        questionsAnswered={sessionStats.questionsAnswered}
        correct={sessionStats.correct}
        incorrect={sessionStats.incorrect}
        giveUps={sessionStats.giveUps}
        onContinue={() =>
          setShowEndDialog(false)
        }
        onConfirmEnd={() => {
          void handleConfirmEndSession();
        }}
      />

      <LevelUpBanner
        level={levelUpLevel ?? 1}
        open={levelUpLevel !== null}
        onClose={() =>
          setLevelUpLevel(null)
        }
      />
      </div>
    </main>
  );
}
