"use client";

import { useState } from "react";

import { submitDailyChallenge } from "@/app/challenge/actions";
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
  existingAnswer: AnswerChoice | null;
}

export default function ChallengeAnswerForm({
  challengeDate,
  questionId,
  choices,
  existingAnswer,
}: ChallengeAnswerFormProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerChoice | null>(
    existingAnswer
  );
  const [result, setResult] = useState<ChallengeSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const completed = existingAnswer !== null || result !== null;

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
      <div className="mt-8 space-y-3">
        {answerChoices.map((choice) => {
          const selected = selectedAnswer === choice;
          return (
            <button
              type="button"
              key={choice}
              disabled={completed || isSubmitting}
              onClick={() => setSelectedAnswer(choice)}
              className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                selected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
              } disabled:cursor-not-allowed`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold">
                {choice}
              </span>
              <span className="pt-1">{choices[choice]}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selectedAnswer || completed || isSubmitting}
        onClick={() => void handleSubmit()}
        className="mt-8 rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {completed ? "Answer Submitted" : isSubmitting ? "Submitting..." : "Submit Answer"}
      </button>

      {result && (
        <p className="mt-4 text-sm font-medium text-gray-600">
          Answer received. {result.saved ? "Your attempt was saved." : "Sign in to save future attempts and streaks."}
        </p>
      )}
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
    </>
  );
}
