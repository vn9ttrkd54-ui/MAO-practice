import { questions } from "@/data/questions";
import { getQuestionProgress } from "@/lib/services/progressService";

import type {
  Division,
  Question,
} from "@/types/question";

import type {
  TrainerQuestionResult,
  TrainerResult,
  TrainerSessionStats,
} from "@/types/trainer";
import type { QuestionProgress } from "@/types/progress";

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

type QuestionWithProgress = {
  question: Question;
  progress: QuestionProgress;
};

function weightedQuestion(
  pool: QuestionWithProgress[],
  allQuestions: QuestionWithProgress[],
  targetDifficulty: number,
  previousTopic?: string,
  previousResult?: TrainerResult,
) {
  if (pool.length === 0) return null;

  const sameTopicChance = previousResult === "correct" ? 0.4 : 0.6;
  const sameTopic = previousTopic
    ? pool.filter((item) => item.question.topic === previousTopic)
    : [];
  const topicPool = sameTopic.length > 0 && Math.random() < sameTopicChance
    ? sameTopic
    : pool;

  const topicTotals = new Map<string, { attempts: number; correct: number; higherCorrect: number }>();
  for (const item of allQuestions) {
    const current = topicTotals.get(item.question.topic) ?? { attempts: 0, correct: 0, higherCorrect: 0 };
    current.attempts += item.progress.attempts;
    current.correct += item.progress.correct;
    if (item.question.difficulty >= targetDifficulty && item.progress.correct > 0) current.higherCorrect += 1;
    topicTotals.set(item.question.topic, current);
  }

  const weights = topicPool.map((item) => {
    const topic = topicTotals.get(item.question.topic)!;
    const proficient = topic.attempts >= 5
      && topic.correct / topic.attempts >= 0.8
      && topic.higherCorrect >= 2;
    const needsReview = item.progress.lastResult === "incorrect" || item.progress.lastResult === "give-up";
    return (proficient ? 0.3 : 1) * (needsReview ? 1.35 : 1);
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let choice = Math.random() * totalWeight;
  for (let index = 0; index < topicPool.length; index += 1) {
    choice -= weights[index];
    if (choice <= 0) return topicPool[index].question;
  }

  return topicPool[topicPool.length - 1].question;
}

function difficultyOrder(targetDifficulty: number) {
  const order = [targetDifficulty];
  for (let distance = 1; distance <= 4; distance += 1) {
    if (targetDifficulty - distance >= 1) order.push(targetDifficulty - distance);
    if (targetDifficulty + distance <= 5) order.push(targetDifficulty + distance);
  }
  return order;
}

export async function getNextTrainerQuestion({
  division,
  previousQuestionId,
  targetDifficulty,
  sessionResults = [],
  forceChallenge = false,
}: {
  division: Division;
  previousQuestionId?: number | null;
  targetDifficulty?: number | null;
  sessionResults?: TrainerQuestionResult[];
  forceChallenge?: boolean;
}): Promise<Question | null> {
  const currentTime = Date.now();
  const divisionQuestions = getTrainerQuestions(division);
  const withProgress = await Promise.all(
    divisionQuestions.map(async (question) => ({
      question,
      progress: await getQuestionProgress(question.id),
    }))
  );
  const eligible = withProgress.filter(({ progress }) =>
    progress.lastResult !== "correct"
    || progress.lastCorrectAt === null
    || currentTime - progress.lastCorrectAt >= CORRECT_ANSWER_COOLDOWN_MS
  );
  const available = eligible.length > 0 ? eligible : withProgress;
  const availableDifficulties = [...new Set(available.map((item) => item.question.difficulty))];
  if (availableDifficulties.length === 0) return null;

  const chosenStartingDifficulty = availableDifficulties[
    Math.floor(Math.random() * availableDifficulties.length)
  ];
  const requestedDifficulty = targetDifficulty ?? chosenStartingDifficulty;
  const difficulties = forceChallenge
    ? [5, 4, 3, 2, 1]
    : difficultyOrder(requestedDifficulty);
  const seenIds = new Set(sessionResults.map((result) => result.questionId));
  const previousTopic = divisionQuestions.find((question) => question.id === previousQuestionId)?.topic;
  const previousResult = sessionResults[sessionResults.length - 1]?.result;

  for (const difficulty of difficulties) {
    const atDifficulty = available.filter(({ question }) =>
      question.difficulty === difficulty && question.id !== previousQuestionId
    );
    if (atDifficulty.length === 0) continue;

    const unseen = atDifficulty.filter(({ question, progress }) =>
      progress.attempts === 0 && !seenIds.has(question.id)
    );
    const unusedThisSession = atDifficulty.filter(({ question }) => !seenIds.has(question.id));
    const retryIds = sessionResults
      .filter((result) => result.result !== "correct")
      .map((result) => result.questionId);
    const retryQueue = retryIds
      .map((id) => atDifficulty.find((item) => item.question.id === id))
      .filter((item): item is QuestionWithProgress => Boolean(item));
    const pool = unseen.length > 0
      ? unseen
      : unusedThisSession.length > 0
        ? unusedThisSession
        : retryQueue.length > 0
          ? retryQueue
          : atDifficulty;

    return weightedQuestion(
      pool,
      withProgress,
      requestedDifficulty,
      previousTopic,
      previousResult,
    );
  }

  return null;
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
