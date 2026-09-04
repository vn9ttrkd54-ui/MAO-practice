"use client";

import {
  useEffect,
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
} from "@/types/trainer";

import type {
  LevelProgress,
} from "@/types/level";

import {
  calculateTrainerStats,
  getNextTrainerQuestion,
} from "@/lib/trainer";
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
  getLevelProgress,
} from "@/lib/services/levelService";

import {
  hasTrainerAccount,
  saveTrainerSession,
} from "@/lib/services/trainerHistoryService";

import TrainerSetup from "@/components/trainer/TrainerSetup";
import TrainerHeader from "@/components/trainer/TrainerHeader";
import TrainerQuestion from "@/components/trainer/TrainerQuestion";
import TrainerStatsSidebar from "@/components/trainer/TrainerStatsSidebar";
import EndSessionDialog from "@/components/trainer/EndSessionDialog";
import TrainerSummary from "@/components/trainer/TrainerSummary";
import LevelUpBanner from "@/components/trainer/LevelUpBanner";

const DEFAULT_LEVEL: LevelProgress = {
  level: 1,
  progress: 0,
};

export default function TrainerClient() {
  const router = useRouter();

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
  ] = useState<TrainerSessionRecord[]>([]);

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
    let cancelled = false;

    async function loadLevel() {
      try {
        const [savedLevel, accountAvailable] =
          await Promise.all([
            getLevelProgress(),
            hasTrainerAccount(),
          ]);

        if (!cancelled) {
          setLevelProgress(savedLevel);
          setStartingLevelProgress(savedLevel);
          setHasAccount(accountAvailable);
        }
      } catch {
        if (!cancelled) {
          setLevelProgress(DEFAULT_LEVEL);
          setStartingLevelProgress(DEFAULT_LEVEL);
          setHasAccount(false);
        }
      }
    }

    void loadLevel();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sessionStarted || showSummary) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [sessionStarted, showSummary]);

  const sessionStats =
    calculateTrainerStats(results);

  const handleStartSession = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const [firstQuestion, currentLevel, accountAvailable] =
        await Promise.all([
          getNextTrainerQuestion({
            division,
            previousQuestionId: null,
          }),
          getLevelProgress(),
          hasTrainerAccount(),
        ]);

      if (!firstQuestion) {
        setStartError(
          `There are currently no eligible ${division} questions.`
        );
        return;
      }

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
      setHasAccount(accountAvailable);
      setSessionStarted(true);
      setShowSummary(false);
      setShowEndDialog(false);
      setStartError(null);
    } catch {
      setStartError(
        "Unable to start Trainer right now. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !currentQuestion ||
      !selectedAnswer ||
      submitted ||
      isSaving
    ) {
      return;
    }

    const answeredAt = Date.now();
    const timeSpent = Math.floor(
      (answeredAt - startTime) / 1000
    );

    const isCorrect =
      selectedAnswer === currentQuestion.answer;

    setIsSaving(true);

    try {
      const savedResult = await saveVerifiedTrainerResult(
        currentQuestion.id,
        selectedAnswer,
        timeSpent
      );
      const levelChange = savedResult.levelChange;

      setLevelProgress({
        level: levelChange.level,
        progress: levelChange.progress,
      });

      if (levelChange.leveledUp) {
        setLevelUpLevel(levelChange.level);
      }

      const newResult: TrainerQuestionResult = {
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.number,
        selectedAnswer,
        correctAnswer: currentQuestion.answer,
        result: isCorrect
          ? "correct"
          : "incorrect",
        elapsedSeconds: timeSpent,
      };

      setResults((currentResults) => [
        ...currentResults,
        newResult,
      ]);
      setAdaptiveState((current) => current
        ? applyAdaptiveTrainerResult(current, newResult.result, currentIsChallenge)
        : current
      );

      setQuestionFinishedAt(answeredAt);
      setNow(answeredAt);
      setSubmitted(true);
    } catch {
      setStartError(
        "Unable to save this result. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleGiveUp = async () => {
    if (
      !currentQuestion ||
      submitted ||
      isSaving
    ) {
      return;
    }

    const answeredAt = Date.now();

    setIsSaving(true);

    try {
      const savedResult = await saveVerifiedTrainerResult(
        currentQuestion.id,
        null,
        Math.floor((answeredAt - startTime) / 1000)
      );
      const levelChange = savedResult.levelChange;

      setLevelProgress({
        level: levelChange.level,
        progress: levelChange.progress,
      });

      const newResult: TrainerQuestionResult = {
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.number,
        selectedAnswer: null,
        correctAnswer: currentQuestion.answer,
        result: "give-up",
        elapsedSeconds: Math.floor(
          (answeredAt - startTime) / 1_000
        ),
      };

      setResults((currentResults) => [
        ...currentResults,
        newResult,
      ]);
      setAdaptiveState((current) => current
        ? applyAdaptiveTrainerResult(current, newResult.result, currentIsChallenge)
        : current
      );

      setSelectedAnswer(null);
      setQuestionFinishedAt(answeredAt);
      setNow(answeredAt);
      setSubmitted(true);
    } catch {
      setStartError(
        "Unable to save this result. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const nextQuestionNumber = results.length + 1;
      const forceChallenge = isTrainerChallengeQuestion(nextQuestionNumber);
      const nextQuestion =
        await getNextTrainerQuestion({
          division,
          previousQuestionId:
            currentQuestion.id,
          targetDifficulty: adaptiveState?.difficulty,
          sessionResults: results,
          forceChallenge,
        });

      if (!nextQuestion) {
        setSessionEndedAt(Date.now());
        setCurrentQuestion(null);
        setShowSummary(true);
        return;
      }

      setCurrentQuestion(nextQuestion);
      setCurrentIsChallenge(forceChallenge);
      setSelectedAnswer(null);
      setSubmitted(false);
      const startedAt = Date.now();
      setStartTime(startedAt);
      setQuestionFinishedAt(null);
      setNow(startedAt);
      setStartError(null);
    } catch {
      setStartError(
        "Unable to load the next question. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEndSession = () => {
    if (!isSaving) {
      setShowEndDialog(true);
    }
  };

  const handleConfirmEndSession = async () => {
    if (isSaving) {
      return;
    }

    const endedAt = Date.now();

    if (sessionStartedAt === null) {
      setShowEndDialog(false);
      setShowSummary(true);
      return;
    }

    setIsSaving(true);
    setStartError(null);

    try {
      const savedHistory = await saveTrainerSession({
        id: crypto.randomUUID(),
        division,
        startedAt: sessionStartedAt,
        endedAt,
        startingLevel:
          startingLevelProgress,
        endingLevel: levelProgress,
        results,
      });

      setTrainerHistory(savedHistory);
      setSessionEndedAt(endedAt);
      setShowEndDialog(false);
      setShowSummary(true);
    } catch {
      setStartError(
        "Unable to save this Trainer session. Please try again."
      );
      setShowEndDialog(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartNewSession = () => {
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
    router.push("/practice");
  };

  if (!sessionStarted) {
    return (
      <TrainerSetup
        division={division}
        error={startError}
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
            submitted={submitted || isSaving}
            onSelectAnswer={setSelectedAnswer}
            onSubmit={() => {
              void handleSubmit();
            }}
            onGiveUp={() => {
              void handleGiveUp();
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
