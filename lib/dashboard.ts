import type { AttemptResult } from "@/types/progress";
import type { Question } from "@/types/question";
import type { TrainerSessionRecord } from "@/types/trainer";

export interface TrainerHistorySummary {
  sessionsCompleted: number;
  questionsAnswered: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  accuracy: number;
  score: number;
  averageQuestionsPerSession: number;
  averageSessionDurationSeconds: number;
  bestSessionAccuracy: number;
  bestSessionCorrect: number;
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
  let totalSessionDurationMs = 0;
  let bestSessionAccuracy = 0;
  let bestSessionCorrect = 0;

  for (const session of sessions) {
    const sessionQuestionsAnswered =
      session.results.length;
    let sessionCorrect = 0;

    questionsAnswered += sessionQuestionsAnswered;
    totalSessionDurationMs += Math.max(
      0,
      session.endedAt - session.startedAt
    );

    for (const result of session.results) {
      if (result.result === "correct") {
        correct += 1;
        sessionCorrect += 1;
      } else if (result.result === "incorrect") {
        incorrect += 1;
      } else {
        giveUps += 1;
      }
    }

    const sessionAccuracy =
      sessionQuestionsAnswered > 0
        ? Math.round(
            (sessionCorrect /
              sessionQuestionsAnswered) *
              100
          )
        : 0;

    if (
      sessionAccuracy > bestSessionAccuracy ||
      (sessionAccuracy === bestSessionAccuracy &&
        sessionCorrect > bestSessionCorrect)
    ) {
      bestSessionAccuracy = sessionAccuracy;
      bestSessionCorrect = sessionCorrect;
    }
  }

  const sessionsCompleted = sessions.length;

  const accuracy =
    questionsAnswered > 0
      ? Math.round((correct / questionsAnswered) * 100)
      : 0;

  return {
    sessionsCompleted,
    questionsAnswered,
    correct,
    incorrect,
    giveUps,
    accuracy,
    score: correct - incorrect - giveUps,
    averageQuestionsPerSession:
      sessionsCompleted > 0
        ? Math.round(
            (questionsAnswered / sessionsCompleted) * 10
          ) / 10
        : 0,
    averageSessionDurationSeconds:
      sessionsCompleted > 0
        ? Math.round(
            totalSessionDurationMs /
              sessionsCompleted /
              1000
          )
        : 0,
    bestSessionAccuracy,
    bestSessionCorrect,
  };
}

export function calculateQuestionBankSummary(
  questions: Question[],
  progressByQuestionId: ReadonlyMap<
    number,
    AttemptResult | null
  >,
  bookmarkedQuestionIds: number[]
): QuestionBankSummary {
  let solved = 0;
  let attempted = 0;
  let newQuestions = 0;

  for (const question of questions) {
    const lastResult =
      progressByQuestionId.get(question.id) ?? null;

    if (lastResult === "correct") {
      solved += 1;
    } else if (
      lastResult === "incorrect" ||
      lastResult === "give-up"
    ) {
      attempted += 1;
    } else {
      newQuestions += 1;
    }
  }

  const validQuestionIds = new Set(
    questions.map((question) => question.id)
  );

  const bookmarked = bookmarkedQuestionIds.filter(
    (questionId) => validQuestionIds.has(questionId)
  ).length;

  return {
    totalQuestions: questions.length,
    solved,
    attempted,
    newQuestions,
    bookmarked,
  };
}
