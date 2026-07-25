import type {
  AttemptResult,
  QuestionProgress,
  QuestionStatus,
} from "@/types/progress";

export type {
  AttemptResult,
  QuestionProgress,
  QuestionStatus,
} from "@/types/progress";

const getStorageKey = (id: number) =>
  `question-${id}`;

const emptyProgress = (): QuestionProgress => ({
  attempts: 0,
  correct: 0,
  times: [],
  lastResult: null,
  lastCorrectAt: null,
});

export function getQuestionProgress(
  id: number
): QuestionProgress {
  if (typeof window === "undefined") {
    return emptyProgress();
  }

  const storedData = localStorage.getItem(
    getStorageKey(id)
  );

  if (!storedData) {
    return emptyProgress();
  }

  try {
    const parsedData = JSON.parse(
      storedData
    ) as Partial<QuestionProgress>;

    let lastResult: AttemptResult | null = null;

    if (
      parsedData.lastResult === "correct" ||
      parsedData.lastResult === "incorrect" ||
      parsedData.lastResult === "give-up"
    ) {
      lastResult = parsedData.lastResult;
    } else if (
      typeof parsedData.correct === "number" &&
      parsedData.correct > 0
    ) {
      lastResult = "correct";
    } else if (
      typeof parsedData.attempts === "number" &&
      parsedData.attempts > 0
    ) {
      lastResult = "incorrect";
    }

    const lastCorrectAt =
      typeof parsedData.lastCorrectAt === "number" &&
      Number.isFinite(parsedData.lastCorrectAt)
        ? parsedData.lastCorrectAt
        : null;

    return {
      attempts:
        typeof parsedData.attempts === "number"
          ? parsedData.attempts
          : 0,

      correct:
        typeof parsedData.correct === "number"
          ? parsedData.correct
          : 0,

      times: Array.isArray(parsedData.times)
        ? parsedData.times.filter(
            (time): time is number =>
              typeof time === "number" &&
              Number.isFinite(time)
          )
        : [],

      lastResult,
      lastCorrectAt,
    };
  } catch {
    return emptyProgress();
  }
}

export function getQuestionStatus(
  id: number
): QuestionStatus {
  const progress = getQuestionProgress(id);

  if (progress.lastResult === "correct") {
    return "solved";
  }

  if (
    progress.lastResult === "incorrect" ||
    progress.lastResult === "give-up"
  ) {
    return "attempted";
  }

  return "new";
}

export function saveQuestionAttempt(
  id: number,
  isCorrect: boolean,
  time: number
): QuestionProgress {
  const current = getQuestionProgress(id);

  const updated: QuestionProgress = {
    attempts: current.attempts + 1,

    correct:
      current.correct +
      (isCorrect ? 1 : 0),

    times: isCorrect
      ? [...current.times, time]
      : current.times,

    lastResult: isCorrect
      ? "correct"
      : "incorrect",

    lastCorrectAt: isCorrect
      ? Date.now()
      : current.lastCorrectAt,
  };

  localStorage.setItem(
    getStorageKey(id),
    JSON.stringify(updated)
  );

  return updated;
}

export function saveQuestionGiveUp(
  id: number
): QuestionProgress {
  const current = getQuestionProgress(id);

  const updated: QuestionProgress = {
    attempts: current.attempts + 1,
    correct: current.correct,
    times: current.times,
    lastResult: "give-up",
    lastCorrectAt: current.lastCorrectAt,
  };

  localStorage.setItem(
    getStorageKey(id),
    JSON.stringify(updated)
  );

  return updated;
}