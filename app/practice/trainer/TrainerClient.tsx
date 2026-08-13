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
} from "@/types/trainer";

import type {
  LevelProgress,
} from "@/types/level";

import {
  calculateTrainerStats,
  getNextTrainerQuestion,
} from "@/lib/trainer";

import {
  saveVerifiedTrainerResult,
} from "@/lib/services/progressService";

import {
  getLevelProgress,
} from "@/lib/services/levelService";

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

  const [isSaving, setIsSaving] =
    useState(false);

  const [startTime, setStartTime] =
    useState(() => Date.now());

  const [
    sessionStartedAt,
    setSessionStartedAt,
  ] = useState<number | null>(null);

  const [results, setResults] =
    useState<TrainerQuestionResult[]>([]);

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
        const savedLevel =
          await getLevelProgress();

        if (!cancelled) {
          setLevelProgress(savedLevel);
          setStartingLevelProgress(savedLevel);
        }
      } catch {
        if (!cancelled) {
          setLevelProgress(DEFAULT_LEVEL);
          setStartingLevelProgress(DEFAULT_LEVEL);
        }
      }
    }

    void loadLevel();

    return () => {
      cancelled = true;
    };
  }, []);

  const sessionStats =
    calculateTrainerStats(results);

  const handleStartSession = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const [firstQuestion, currentLevel] =
        await Promise.all([
          getNextTrainerQuestion({
            division,
            previousQuestionId: null,
          }),
          getLevelProgress(),
        ]);

      if (!firstQuestion) {
        setStartError(
          `There are currently no eligible ${division} questions.`
        );
        return;
      }

      setCurrentQuestion(firstQuestion);
      setSelectedAnswer(null);
      setSubmitted(false);
      setResults([]);

      const startedAt = Date.now();

      setStartTime(startedAt);
      setSessionStartedAt(startedAt);
      setLevelProgress(currentLevel);
      setStartingLevelProgress(currentLevel);
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

    const timeSpent = Math.floor(
      (Date.now() - startTime) / 1000
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
      };

      setResults((currentResults) => [
        ...currentResults,
        newResult,
      ]);

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

    setIsSaving(true);

    try {
      const savedResult = await saveVerifiedTrainerResult(
        currentQuestion.id,
        null,
        Math.floor((Date.now() - startTime) / 1000)
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
      };

      setResults((currentResults) => [
        ...currentResults,
        newResult,
      ]);

      setSelectedAnswer(null);
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
      const nextQuestion =
        await getNextTrainerQuestion({
          division,
          previousQuestionId:
            currentQuestion.id,
        });

      if (!nextQuestion) {
        setCurrentQuestion(null);
        setShowSummary(true);
        return;
      }

      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setSubmitted(false);
      setStartTime(Date.now());
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
      await saveTrainerSession({
        id: crypto.randomUUID(),
        division,
        startedAt: sessionStartedAt,
        endedAt,
        startingLevel:
          startingLevelProgress,
        endingLevel: levelProgress,
        results,
      });

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
    setSessionStartedAt(null);
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
