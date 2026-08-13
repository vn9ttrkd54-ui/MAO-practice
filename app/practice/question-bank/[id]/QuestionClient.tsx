"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Question } from "@/types/question";
import type { QuestionProgress } from "@/types/progress";

import {
  getQuestionProgress,
  saveQuestionAttempt,
  saveQuestionGiveUp,
} from "@/lib/services/progressService";

import {
  isQuestionBookmarked,
  toggleQuestionBookmark,
} from "@/lib/services/bookmarkService";

import {
  getNextQuestion,
  getPreviousQuestion,
} from "@/lib/questions";
import { questions } from "@/data/questions";

import QuestionHeader from "@/components/practice/QuestionHeader";
import QuestionStats from "@/components/practice/QuestionStats";
import Timer from "@/components/practice/Timer";
import MultipleChoice from "@/components/practice/MultipleChoice";
import SolutionPanel from "@/components/practice/SolutionPanel";
import QuestionNavigation from "@/components/practice/QuestionNavigation";
import BookmarkButton from "@/components/practice/BookmarkButton";
import QuestionReportButton from "@/components/feedback/QuestionReportButton";
import MathText from "@/components/math/MathText";

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
  return <QuestionSession key={question.id} question={question} />;
}

function QuestionSession({ question }: { question: Question }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedReturnTo = searchParams.get("returnTo");
  const defaultReturnTo = `/practice/question-bank/${question.division.toLowerCase()}`;
  const returnTo = requestedReturnTo?.startsWith("/practice/question-bank/")
    ? requestedReturnTo
    : defaultReturnTo;

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isBookmarkSaving, setIsBookmarkSaving] =
    useState(false);

  const startTime = useRef(0);

  const [attemptNumber, setAttemptNumber] =
    useState(0);

  const [bookmarked, setBookmarked] =
    useState(false);

  const [progress, setProgress] =
    useState<QuestionProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    let cancelled = false;
    startTime.current = Date.now();

    async function loadQuestionState() {
      try {
        const [savedProgress, savedBookmark] =
          await Promise.all([
            getQuestionProgress(question.id),
            isQuestionBookmarked(question.id),
          ]);

        if (!cancelled) {
          setProgress(savedProgress);
          setBookmarked(savedBookmark);
        }
      } catch {
        if (!cancelled) {
          setProgress(EMPTY_PROGRESS);
          setBookmarked(false);
        }
      }
    }

    void loadQuestionState();

    return () => {
      cancelled = true;
    };
  }, [question.id]);

  const sequence = (searchParams.get("sequence") ?? "")
    .split(",")
    .map(Number)
    .filter((id) => Number.isInteger(id));
  const sequenceIndex = sequence.indexOf(question.id);
  const sequenceQuestion = (offset: number) => {
    if (sequenceIndex === -1) return null;
    const id = sequence[sequenceIndex + offset];
    return questions.find((item) => item.id === id) ?? null;
  };
  const nextQuestion = sequence.length ? sequenceQuestion(1) : getNextQuestion(question.id);
  const previousQuestion = sequence.length ? sequenceQuestion(-1) : getPreviousQuestion(question.id);
  const sequenceQuery = sequence.length ? `&sequence=${encodeURIComponent(sequence.join(","))}` : "";

  const goToQuestion = (
    destinationId: number
  ) => {
    router.push(
      `/practice/question-bank/${destinationId}?returnTo=${encodeURIComponent(returnTo)}${sequenceQuery}`
    );
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || isSaving) {
      return;
    }

    const timeSpent = Math.floor(
      (Date.now() - startTime.current) / 1000
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
    startTime.current = Date.now();
    setAttemptNumber((current) => current + 1);
  };

  const handleBookmarkToggle = async () => {
    if (isBookmarkSaving) {
      return;
    }

    setIsBookmarkSaving(true);

    try {
      const updatedBookmark =
        await toggleQuestionBookmark(question.id);

      setBookmarked(updatedBookmark);
    } finally {
      setIsBookmarkSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#e5e7eb] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
      <QuestionHeader
        questionNumber={question.number}
        division={question.division}
        topic={question.topic}
        difficulty={"★".repeat(
          question.difficulty
        )}
        status="Question Bank"
        backHref={returnTo}
      />

      <div className="flex flex-wrap justify-between items-center gap-3 mt-6 mb-6">
        <Timer
          key={`${question.id}-${attemptNumber}`}
          running={!submitted && !isSaving}
        />

        <div className="flex flex-wrap items-center gap-3">
          <QuestionReportButton questionId={question.id} division={question.division} />
          <BookmarkButton
            bookmarked={bookmarked}
            onToggle={() => {
              void handleBookmarkToggle();
            }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-6 shadow-[0_12px_30px_rgba(17,24,39,0.14)] sm:p-7">
            <h2 className="text-2xl font-bold mb-6">
              Question
            </h2>

            <div className="mb-8 text-lg leading-8"><MathText>{question.question}</MathText></div>

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
                  rounded-lg
                  bg-gradient-to-br
                  from-[#2563eb]
                  to-[#111827]
                  px-6
                  py-3
                  font-semibold
                  text-white
                  shadow-md
                  transition
                  hover:brightness-110
                  disabled:cursor-not-allowed
                  disabled:opacity-50
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
                  rounded-lg
                  border-2
                  border-[#111827]
                  bg-white
                  px-6
                  py-3
                  font-semibold
                  text-slate-950
                  transition
                  hover:bg-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
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
      </div>
    </main>
  );
}
