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

import { questionBankHref, questionBankReturnTo, type questionBankNavigation } from "@/lib/questionBankListing";
import { createPracticeAttempt, type PracticeAttempt } from "@/lib/services/practiceAttemptService";

import QuestionHeader from "@/components/practice/QuestionHeader";
import QuestionStats from "@/components/practice/QuestionStats";
import Timer from "@/components/practice/Timer";
import MultipleChoice from "@/components/practice/MultipleChoice";
import SolutionPanel from "@/components/practice/SolutionPanel";
import QuestionNavigation from "@/components/practice/QuestionNavigation";
import BookmarkButton from "@/components/practice/BookmarkButton";
import QuestionReportButton from "@/components/feedback/QuestionReportButton";
import MathText from "@/components/math/MathText";
import QuestionImage from "@/components/questions/QuestionImage";
import LlamaTutor from "@/components/practice/LlamaTutor";

const EMPTY_PROGRESS: QuestionProgress = {
  attempts: 0,
  correct: 0,
  times: [],
  lastResult: null,
  lastCorrectAt: null,
};

export default function QuestionClient({
  question,
  tutorEnabled,
  navigation,
}: {
  question: Question;
  tutorEnabled: boolean;
  navigation: ReturnType<typeof questionBankNavigation>;
}) {
  return <QuestionSession key={question.id} question={question} tutorEnabled={tutorEnabled} navigation={navigation} />;
}

function QuestionSession({ question, tutorEnabled, navigation }: { question: Question; tutorEnabled: boolean; navigation: ReturnType<typeof questionBankNavigation> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = questionBankReturnTo(searchParams.get("returnTo"), question.division);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [tutorRevealToken, setTutorRevealToken] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isBookmarkSaving, setIsBookmarkSaving] =
    useState(false);

  const startTime = useRef(0);
  const attempt = useRef<PracticeAttempt | null>(null);
  const pending = useRef<{ answer: string | null; time: number } | null>(null);
  const busy = useRef(false);
  const [hasPending, setHasPending] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [attemptNumber, setAttemptNumber] =
    useState(0);

  const [bookmarked, setBookmarked] =
    useState(false);

  const [progress, setProgress] =
    useState<QuestionProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    let cancelled = false;
    startTime.current = Date.now();
    attempt.current ??= createPracticeAttempt(question.id, false);
    void attempt.current.prepare().catch((error: unknown) => {
      if (!cancelled) setSaveError(error instanceof Error ? error.message : "Unable to start this attempt.");
    });

    async function loadQuestionState() {
      try {
        const [savedProgress, savedBookmark] =
          await Promise.all([
            getQuestionProgress(question.id),
            isQuestionBookmarked(question.id),
          ]);

        if (!cancelled) {
          if (!pending.current) setProgress(savedProgress);
          setBookmarked(savedBookmark);
        }
      } catch {
        if (!cancelled) {
          if (!pending.current) setProgress(EMPTY_PROGRESS);
          setBookmarked(false);
        }
      }
    }

    void loadQuestionState();

    return () => {
      cancelled = true;
    };
  }, [question.id]);

  const goToQuestion = (destinationId: number) => router.push(questionBankHref(destinationId, returnTo, navigation.sequence));

  const handleSave = async (answer: string | null) => {
    if (submitted || busy.current || !attempt.current) return;
    busy.current = true;
    pending.current ??= { answer, time: answer === null ? 0 : Math.floor((Date.now() - startTime.current) / 1000) };
    const original = pending.current;
    setSelectedAnswer(original.answer);
    setHasPending(true);
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = original.answer === null
        ? await saveQuestionGiveUp(question.id, attempt.current)
        : await saveQuestionAttempt(question.id, original.answer, original.time, attempt.current);
      setProgress(result.progress);
      setTutorRevealToken(result.tutorRevealToken);
      setSubmitted(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save this result. Please retry.");
    } finally {
      busy.current = false;
      setIsSaving(false);
    }
  };

  const handleReattempt = () => {
    if (busy.current) return;
    pending.current = null;
    setHasPending(false);
    setSaveError(null);
    setSubmitted(false);
    setSelectedAnswer(null);
    setTutorRevealToken(null);
    startTime.current = Date.now();
    const fresh = createPracticeAttempt(question.id, false);
    attempt.current = fresh;
    void fresh.prepare().catch((error: unknown) => {
      if (attempt.current === fresh) setSaveError(error instanceof Error ? error.message : "Unable to start this attempt.");
    });
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
    <main className="min-h-[calc(100vh-4rem)] bg-[#e5e7eb] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
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
          running={!submitted && !hasPending}
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

      <div className="grid min-w-0 gap-8 lg:grid-cols-4">
        <div className="min-w-0 lg:col-span-3">
          <div className="min-w-0 rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-4 shadow-[0_12px_30px_rgba(17,24,39,0.14)] sm:p-7">
            <h2 className="text-2xl font-bold mb-6">
              Question
            </h2>

            <div className="mb-8 text-lg leading-8">
              <MathText>{question.question}</MathText>
              <QuestionImage illustration={question.illustration} />
            </div>

            <MultipleChoice
              choices={question.choices}
              selectedAnswer={selectedAnswer}
              submitted={submitted || isSaving || hasPending}
              onSelect={setSelectedAnswer}
            />

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                disabled={
                  (!selectedAnswer && !hasPending) ||
                  submitted ||
                  isSaving
                }
                onClick={() => {
                  void handleSave(selectedAnswer);
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
                {isSaving ? "Saving..." : hasPending ? "Retry save" : "Submit"}
              </button>

              <button
                disabled={submitted || isSaving || hasPending}
                onClick={() => {
                  void handleSave(null);
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

            {saveError ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{saveError}</p> : null}

            <SolutionPanel
              submitted={submitted}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.answer}
              solution={question.solution}
              onReattempt={handleReattempt}
            />

            <QuestionNavigation
              previousDisabled={!navigation.previousId || (hasPending && !submitted)}
              nextDisabled={!navigation.nextId || (hasPending && !submitted)}
              onPrevious={() => {
                if (navigation.previousId) {
                  goToQuestion(navigation.previousId);
                }
              }}
              onNext={() => {
                if (navigation.nextId) {
                  goToQuestion(navigation.nextId);
                }
              }}
            />
          </div>
        </div>

        <QuestionStats
          attempts={progress.attempts}
          correct={progress.correct}
          times={progress.times}
          timing={progress.timing}
        />
      </div>
      {tutorEnabled ? <LlamaTutor questionId={question.id} revealToken={tutorRevealToken} /> : null}
      </div>
    </main>
  );
}
