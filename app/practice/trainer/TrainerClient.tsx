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
  saveQuestionAttempt,
  saveQuestionGiveUp,
} from "@/lib/progress";

import {
  applyTrainerResult,
  getLevelProgress,
} from "@/lib/levels";

import {
  saveTrainerSession,
} from "@/lib/trainerHistory";

import TrainerSetup from "@/components/trainer/TrainerSetup";
import TrainerHeader from "@/components/trainer/TrainerHeader";
import TrainerQuestion from "@/components/trainer/TrainerQuestion";
import EndSessionDialog from "@/components/trainer/EndSessionDialog";
import TrainerSummary from "@/components/trainer/TrainerSummary";
import LevelUpBanner from "@/components/trainer/LevelUpBanner";

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

  const [startTime, setStartTime] =
    useState(Date.now());

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
  ] = useState<LevelProgress>({
    level: 1,
    progress: 0,
  });

  const [
    startingLevelProgress,
    setStartingLevelProgress,
  ] = useState<LevelProgress>({
    level: 1,
    progress: 0,
  });

  useEffect(() => {
    const savedLevel =
        getLevelProgress();

    setLevelProgress(savedLevel);
    setStartingLevelProgress(savedLevel);
  }, []);

  const sessionStats =
    calculateTrainerStats(
      results
    );

  const handleStartSession = () => {
    const firstQuestion =
      getNextTrainerQuestion({
        division,
        previousQuestionId: null,
      });

    if (!firstQuestion) {
      setStartError(
        `There are currently no eligible ${division} questions.`
      );

      return;
    }

    const currentLevel =
      getLevelProgress();

    setCurrentQuestion(
      firstQuestion
    );

    setSelectedAnswer(null);
    setSubmitted(false);
    setResults([]);
    const startedAt = Date.now();

    setStartTime(startedAt);
    setSessionStartedAt(startedAt);

    setLevelProgress(
      currentLevel
    );

    setStartingLevelProgress(
      currentLevel
    );

    setSessionStarted(true);
    setShowSummary(false);
    setShowEndDialog(false);
    setStartError(null);
  };

  const handleSubmit = () => {
    if (
      !currentQuestion ||
      !selectedAnswer ||
      submitted
    ) {
      return;
    }

    const timeSpent = Math.floor(
      (Date.now() - startTime) /
        1000
    );

    const isCorrect =
      selectedAnswer ===
      currentQuestion.answer;

    saveQuestionAttempt(
      currentQuestion.id,
      isCorrect,
      timeSpent
    );

    const levelChange =
      applyTrainerResult(
        isCorrect
      );

    setLevelProgress({
      level:
        levelChange.level,

      progress:
        levelChange.progress,
    });
    if (levelChange.leveledUp) {
      setLevelUpLevel(
          levelChange.level
      );
    }

    const newResult:
      TrainerQuestionResult = {
        questionId:
          currentQuestion.id,

        questionNumber:
          currentQuestion.number,

        selectedAnswer,

        correctAnswer:
          currentQuestion.answer,

        result: isCorrect
          ? "correct"
          : "incorrect",
      };

    setResults(
      (currentResults) => [
        ...currentResults,
        newResult,
      ]
    );

    setSubmitted(true);
  };

  const handleGiveUp = () => {
    if (
      !currentQuestion ||
      submitted
    ) {
      return;
    }

    saveQuestionGiveUp(
      currentQuestion.id
    );

    const levelChange =
      applyTrainerResult(false);

    setLevelProgress({
      level:
        levelChange.level,

      progress:
        levelChange.progress,
    });

    const newResult:
      TrainerQuestionResult = {
        questionId:
          currentQuestion.id,

        questionNumber:
          currentQuestion.number,

        selectedAnswer: null,

        correctAnswer:
          currentQuestion.answer,

        result: "give-up",
      };

    setResults(
      (currentResults) => [
        ...currentResults,
        newResult,
      ]
    );

    setSelectedAnswer(null);
    setSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) {
        return;
    }

    const nextQuestion =
        getNextTrainerQuestion({
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
  };

  const handleEndSession = () => {
    setShowEndDialog(true);
  };

  const handleConfirmEndSession = () => {
    const endedAt = Date.now();

    if (sessionStartedAt !== null) {
      saveTrainerSession({
        id: crypto.randomUUID(),
        division,
        startedAt: sessionStartedAt,
        endedAt,
        startingLevel:
          startingLevelProgress,
        endingLevel:
          levelProgress,
        results,
      });
    }

    setShowEndDialog(false);
    setShowSummary(true);
  };

  const handleStartNewSession =
    () => {
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

  const handleReturnToPractice =
    () => {
      router.push(
        "/practice"
      );
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
        onStart={handleStartSession}
      />
    );
  }

  if (showSummary) {
    return (
      <TrainerSummary
        division={
          division
        }
        stats={
          sessionStats
        }
        results={
          results
        }
        startingLevel={
          startingLevelProgress
        }
        endingLevel={
          levelProgress
        }
        onStartNewSession={
          handleStartNewSession
        }
        onReturnToPractice={
          handleReturnToPractice
        }
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
            Every available question
            in this division is
            currently inside its
            30-day cooldown.
          </p>

          <button
            type="button"
            onClick={
              handleStartNewSession
            }
            className="
              mt-6
              border
              rounded-lg
              px-5
              py-3
              hover:bg-gray-100
            "
          >
            Choose Another Division
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <TrainerHeader
        division={
          division
        }
        difficulty={
          currentQuestion.difficulty
        }
        level={
          levelProgress.level
        }
        levelProgress={
          levelProgress.progress
        }
        correct={
          sessionStats.correct
        }
        incorrect={
          sessionStats.incorrect
        }
        giveUps={
          sessionStats.giveUps
        }
        onEndSession={
          handleEndSession
        }
      />

      <TrainerQuestion
        question={
          currentQuestion
        }
        selectedAnswer={
          selectedAnswer
        }
        submitted={
          submitted
        }
        onSelectAnswer={
          setSelectedAnswer
        }
        onSubmit={
          handleSubmit
        }
        onGiveUp={
          handleGiveUp
        }
        onNextQuestion={
          handleNextQuestion
        }
      />

      <EndSessionDialog
        open={
          showEndDialog
        }
        questionsAnswered={
          sessionStats.questionsAnswered
        }
        correct={
          sessionStats.correct
        }
        incorrect={
          sessionStats.incorrect
        }
        giveUps={
          sessionStats.giveUps
        }
        onContinue={() =>
          setShowEndDialog(
            false
          )
        }
        onConfirmEnd={
          handleConfirmEndSession
        }
      />

      <LevelUpBanner
        level={levelUpLevel ?? 1}
        open={levelUpLevel !== null}
        onClose={() =>
            setLevelUpLevel(null)
        }
      />
    </main>
  );
}