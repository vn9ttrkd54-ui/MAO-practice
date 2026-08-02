"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Question } from "@/types/question";
import type { QuestionProgress } from "@/types/progress";

import {
  getQuestionProgress,
  saveQuestionAttempt,
  saveQuestionGiveUp,
} from "@/lib/services/progressService";

import {
  getNextQuestion,
  getPreviousQuestion,
} from "@/lib/questions";

import {
  isQuestionBookmarked,
  toggleQuestionBookmark,
} from "@/lib/bookmarks";

import QuestionHeader from "@/components/practice/QuestionHeader";
import QuestionStats from "@/components/practice/QuestionStats";
import Timer from "@/components/practice/Timer";
import MultipleChoice from "@/components/practice/MultipleChoice";
import SolutionPanel from "@/components/practice/SolutionPanel";
import QuestionNavigation from "@/components/practice/QuestionNavigation";
import BookmarkButton from "@/components/practice/BookmarkButton";

const EMPTY_PROGRESS: QuestionProgress = {
  attempts: 0,
  correct: 0,
  times: [],
  lastResult: null,
  lastCorrectAt: null,
};

export default function QuestionClient({
  question,
}: {
  question: Question;
}) {
  const router = useRouter();

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [startTime, setStartTime] =
    useState(Date.now());

  const [timerReset, setTimerReset] =
    useState(0);

  const [bookmarked, setBookmarked] =
    useState(false);

  const [progress, setProgress] =
    useState<QuestionProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      try {
        const savedProgress =
          await getQuestionProgress(question.id);

        if (!cancelled) {
          setProgress(savedProgress);
        }
      } catch {
        if (!cancelled) {
          setProgress(EMPTY_PROGRESS);
        }
      }
    }

    void loadProgress();

    setBookmarked(
      isQuestionBookmarked(question.id)
    );

    setSelectedAnswer(null);
    setSubmitted(false);
    setIsSaving(false);
    setStartTime(Date.now());
    setTimerReset((current) => current + 1);

    return () => {
      cancelled = true;
    };
  }, [question.id]);

  const nextQuestion =
    getNextQuestion(question.id);

  const previousQuestion =
    getPreviousQuestion(question.id);

  const goToQuestion = (
    destinationId: number
  ) => {
    router.push(
      `/practice/question-bank/${destinationId}`
    );
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || isSaving) {
      return;
    }

    const timeSpent = Math.floor(
      (Date.now() - startTime) / 1000
    );

    const isCorrect =
      selectedAnswer === question.answer;

    setIsSaving(true);

    try {
      const updatedProgress =
        await saveQuestionAttempt(
          question.id,
          isCorrect,
          timeSpent
        );

      setProgress(updatedProgress);
      setSubmitted(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGiveUp = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedProgress =
        await saveQuestionGiveUp(question.id);

      setProgress(updatedProgress);
      setSubmitted(true);
      setSelectedAnswer(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReattempt = () => {
    setSubmitted(false);
    setSelectedAnswer(null);
    setStartTime(Date.now());
    setTimerReset(
      (current) => current + 1
    );
  };

  const handleBookmarkToggle = () => {
    const updatedBookmark =
      toggleQuestionBookmark(
        question.id
      );

    setBookmarked(updatedBookmark);
  };

  return (
    <main className="max-w-7xl mx-auto p-8">
      <QuestionHeader
        questionNumber={question.number}
        division={question.division}
        topic={question.topic}
        difficulty={"★".repeat(
          question.difficulty
        )}
        status="Question Bank"
      />

      <div className="flex justify-between items-center mt-6 mb-6">
        <Timer
          running={!submitted && !isSaving}
          resetKey={timerReset}
        />

        <BookmarkButton
          bookmarked={bookmarked}
          onToggle={handleBookmarkToggle}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              Question
            </h2>

            <p className="mb-8 text-lg">
              {question.question}
            </p>

            <MultipleChoice
              choices={question.choices}
              selectedAnswer={selectedAnswer}
              submitted={submitted || isSaving}
              onSelect={setSelectedAnswer}
            />

            <div className="flex gap-4 mt-8">
              <button
                disabled={
                  !selectedAnswer ||
                  submitted ||
                  isSaving
                }
                onClick={() => {
                  void handleSubmit();
                }}
                className="
                  bg-black
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {isSaving ? "Saving..." : "Submit"}
              </button>

              <button
                disabled={submitted || isSaving}
                onClick={() => {
                  void handleGiveUp();
                }}
                className="
                  border
                  border-gray-400
                  bg-white
                  px-6
                  py-3
                  rounded-lg
                  hover:bg-gray-100
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Give Up
              </button>
            </div>

            <SolutionPanel
              submitted={submitted}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.answer}
              solution={question.solution}
              onReattempt={handleReattempt}
            />

            <QuestionNavigation
              previousDisabled={!previousQuestion}
              nextDisabled={!nextQuestion}
              onPrevious={() => {
                if (previousQuestion) {
                  goToQuestion(previousQuestion.id);
                }
              }}
              onNext={() => {
                if (nextQuestion) {
                  goToQuestion(nextQuestion.id);
                }
              }}
            />
          </div>
        </div>

        <QuestionStats
          attempts={progress.attempts}
          correct={progress.correct}
          times={progress.times}
        />
      </div>
    </main>
  );
}
