"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { submitDailyChallenge } from "@/app/challenge/actions";
import MathText from "@/components/math/MathText";
import type {
  ChallengeQuestionId,
  ChallengeSubmissionResult,
} from "@/types/challenge";
import type { AnswerChoice } from "@/types/question";

const answerChoices: AnswerChoice[] = ["A", "B", "C", "D", "E"];

interface ChallengeAnswerFormProps {
  challengeDate: string;
  questionId: ChallengeQuestionId;
  choices: Record<AnswerChoice, string>;
  initialResult: ChallengeSubmissionResult | null;
}

export default function ChallengeAnswerForm({
  challengeDate,
  questionId,
  choices,
  initialResult,
}: ChallengeAnswerFormProps) {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerChoice | null>(
    initialResult?.selectedAnswer ?? null
  );
  const [result, setResult] = useState<ChallengeSubmissionResult | null>(
    initialResult
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const completed = result !== null;

  async function handleSubmit() {
    if (!selectedAnswer || completed || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      setResult(
        await submitDailyChallenge({
          challengeDate,
          questionId,
          selectedAnswer,
        })
      );
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit the Challenge."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mt-5 space-y-2.5">
        {answerChoices.map((choice) => {
          const selected = selectedAnswer === choice;
          return (
            <button
              type="button"
              key={choice}
              disabled={completed || isSubmitting}
              onClick={() => setSelectedAnswer(choice)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                selected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
              } disabled:cursor-not-allowed`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold">
                {choice}
              </span>
              <span className="pt-1"><MathText>{choices[choice]}</MathText></span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selectedAnswer || completed || isSubmitting}
        onClick={() => void handleSubmit()}
        className="mt-5 w-full rounded-xl bg-black px-6 py-3 font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {completed ? "Answer Submitted" : isSubmitting ? "Submitting..." : "Submit Answer"}
      </button>

      {result && (
        <section
          className={`mt-8 rounded-2xl border p-6 ${
            result.correct
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <h3 className="text-2xl font-bold">
            {result.correct ? "Correct!" : "Incorrect"}
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Your Answer
              </p>
              <p className="mt-1 font-semibold">
                {result.selectedAnswer}. <MathText>{choices[result.selectedAnswer]}</MathText>
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Correct Answer
              </p>
              <p className="mt-1 font-semibold">
                {result.correctAnswer}. <MathText>{choices[result.correctAnswer]}</MathText>
              </p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Official Solution
            </p>
            <div className="mt-2 leading-7 text-gray-700"><MathText>{result.solution}</MathText></div>
          </div>

          <p className="mt-6 text-sm font-medium text-gray-600">
            {result.saved
              ? "Your attempt was saved. One correct answer across today’s divisions earns your streak; extra attempts won’t add another day or erase earned credit."
              : "This guest attempt was not saved. Sign in to build a streak."}
          </p>
        </section>
      )}
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
    </>
  );
}
