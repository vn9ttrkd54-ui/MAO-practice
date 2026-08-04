import { questions } from "@/data/questions";
import { getQuestionProgress } from "@/lib/services/progressService";

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
    (question) => question.division === division
  );
}

export async function isQuestionEligibleForTrainer(
  question: Question,
  currentTime = Date.now()
): Promise<boolean> {
  const progress = await getQuestionProgress(
    question.id
  );

  if (progress.lastResult !== "correct") {
    return true;
  }

  if (progress.lastCorrectAt === null) {
    return true;
  }

  const timeSinceLastCorrect =
    currentTime - progress.lastCorrectAt;

  return (
    timeSinceLastCorrect >=
    CORRECT_ANSWER_COOLDOWN_MS
  );
}

export async function getEligibleTrainerQuestions(
  division: Division
): Promise<Question[]> {
  const currentTime = Date.now();
  const divisionQuestions =
    getTrainerQuestions(division);

  const eligibility = await Promise.all(
    divisionQuestions.map((question) =>
      isQuestionEligibleForTrainer(
        question,
        currentTime
      )
    )
  );

  return divisionQuestions.filter(
    (_, index) => eligibility[index]
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

export async function getNextTrainerQuestion({
  division,
  previousQuestionId,
}: {
  division: Division;
  previousQuestionId?: number | null;
}): Promise<Question | null> {
  const primaryPool =
    await getEligibleTrainerQuestions(division);

  if (primaryPool.length > 0) {
    return chooseRandomQuestion(
      primaryPool,
      previousQuestionId
    );
  }

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
    (result) => result.result === "correct"
  ).length;

  const incorrect = results.filter(
    (result) => result.result === "incorrect"
  ).length;

  const giveUps = results.filter(
    (result) => result.result === "give-up"
  ).length;

  const questionsAnswered = results.length;

  const accuracy =
    questionsAnswered > 0
      ? Math.round(
          (correct / questionsAnswered) * 100
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
