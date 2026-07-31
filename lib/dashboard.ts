import {
  getQuestionStatus,
} from "@/lib/progress";

import type {
  Question,
} from "@/types/question";

import type {
  TrainerSessionRecord,
} from "@/types/trainer";

export interface TrainerHistorySummary {
  sessionsCompleted: number;
  questionsAnswered: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  accuracy: number;
  score: number;
}

export interface QuestionBankSummary {
  totalQuestions: number;
  solved: number;
  attempted: number;
  newQuestions: number;
  bookmarked: number;
}

export function calculateTrainerHistorySummary(
  sessions: TrainerSessionRecord[]
): TrainerHistorySummary {
  let questionsAnswered = 0;
  let correct = 0;
  let incorrect = 0;
  let giveUps = 0;

  for (const session of sessions) {
    questionsAnswered +=
      session.results.length;

    for (const result of session.results) {
      if (result.result === "correct") {
        correct += 1;
      } else if (
        result.result === "incorrect"
      ) {
        incorrect += 1;
      } else {
        giveUps += 1;
      }
    }
  }

  const accuracy =
    questionsAnswered > 0
      ? Math.round(
          (correct / questionsAnswered) *
            100
        )
      : 0;

  return {
    sessionsCompleted: sessions.length,
    questionsAnswered,
    correct,
    incorrect,
    giveUps,
    accuracy,
    score:
      correct -
      incorrect -
      giveUps,
  };
}

export function calculateQuestionBankSummary(
  questions: Question[],
  bookmarkedQuestionIds: number[]
): QuestionBankSummary {
  let solved = 0;
  let attempted = 0;
  let newQuestions = 0;

  for (const question of questions) {
    const status =
      getQuestionStatus(question.id);

    if (status === "solved") {
      solved += 1;
    } else if (status === "attempted") {
      attempted += 1;
    } else {
      newQuestions += 1;
    }
  }

  const validQuestionIds = new Set(
    questions.map(
      (question) => question.id
    )
  );

  const bookmarked =
    bookmarkedQuestionIds.filter(
      (questionId) =>
        validQuestionIds.has(questionId)
    ).length;

  return {
    totalQuestions: questions.length,
    solved,
    attempted,
    newQuestions,
    bookmarked,
  };
}