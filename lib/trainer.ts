import { questions } from "@/data/questions";

import {
  getQuestionProgress,
} from "@/lib/progress";

import type {
  Division,
  Question,
} from "@/types/question";

import type {
  TrainerQuestionResult,
  TrainerSessionStats,
} from "@/types/trainer";

const CORRECT_ANSWER_COOLDOWN_MS =
  30 * 24 * 60 * 60 * 1000;

export function getTrainerQuestions(
  division: Division
): Question[] {
  return questions.filter(
    (question) =>
      question.division === division
  );
}

export function isQuestionEligibleForTrainer(
  question: Question,
  currentTime = Date.now()
): boolean {
  const progress =
    getQuestionProgress(question.id);

  if (progress.lastCorrectAt === null) {
    return true;
  }

  const timeSinceLastCorrect =
    currentTime -
    progress.lastCorrectAt;

  return (
    timeSinceLastCorrect >=
    CORRECT_ANSWER_COOLDOWN_MS
  );
}

export function getEligibleTrainerQuestions(
  division: Division
): Question[] {
  const currentTime = Date.now();

  return getTrainerQuestions(
    division
  ).filter((question) =>
    isQuestionEligibleForTrainer(
      question,
      currentTime
    )
  );
}

function chooseRandomQuestion(
  questionPool: Question[],
  previousQuestionId?: number | null
): Question | null {
  if (questionPool.length === 0) {
    return null;
  }

  const questionsWithoutImmediateRepeat =
    questionPool.filter(
      (question) =>
        question.id !== previousQuestionId
    );

  const finalPool =
    questionsWithoutImmediateRepeat.length > 0
      ? questionsWithoutImmediateRepeat
      : questionPool;

  const randomIndex = Math.floor(
    Math.random() * finalPool.length
  );

  return finalPool[randomIndex];
}

export function getNextTrainerQuestion({
  division,
  previousQuestionId,
}: {
  division: Division;
  previousQuestionId?: number | null;
}): Question | null {
  const primaryPool =
    getEligibleTrainerQuestions(
      division
    );

  /*
   * Primary queue:
   * - never answered correctly, or
   * - last correct answer was at least 30 days ago, or
   * - most recent result was incorrect/give-up without
   *   a correct answer during the cooldown period.
   */
  if (primaryPool.length > 0) {
    return chooseRandomQuestion(
      primaryPool,
      previousQuestionId
    );
  }

  /*
   * Secondary queue:
   * If every question is on cooldown, allow questions
   * from the complete division pool to appear again.
   *
   * This prevents small question sets from locking the
   * user out of MAO Trainer.
   */
  const secondaryPool =
    getTrainerQuestions(division);

  return chooseRandomQuestion(
    secondaryPool,
    previousQuestionId
  );
}

export function calculateTrainerStats(
  results: TrainerQuestionResult[]
): TrainerSessionStats {
  const correct = results.filter(
    (result) =>
      result.result === "correct"
  ).length;

  const incorrect = results.filter(
    (result) =>
      result.result === "incorrect"
  ).length;

  const giveUps = results.filter(
    (result) =>
      result.result === "give-up"
  ).length;

  const questionsAnswered =
    results.length;

  const accuracy =
    questionsAnswered > 0
      ? Math.round(
          (correct /
            questionsAnswered) *
            100
        )
      : 0;

  return {
    questionsAnswered,
    correct,
    incorrect,
    giveUps,
    accuracy,
  };
}