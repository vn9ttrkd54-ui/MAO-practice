import type { TrainerResult } from "@/types/trainer";

export type AdaptiveTrainerState = {
  difficulty: number;
  correctStreak: number;
  incorrectStreak: number;
};

export function createAdaptiveTrainerState(difficulty: number): AdaptiveTrainerState {
  return {
    difficulty: Math.max(1, Math.min(5, Math.round(difficulty))),
    correctStreak: 0,
    incorrectStreak: 0,
  };
}

function correctThreshold(difficulty: number) {
  if (difficulty <= 2) return 2;
  if (difficulty <= 4) return 3;
  return Number.POSITIVE_INFINITY;
}

function incorrectThreshold(difficulty: number) {
  if (difficulty <= 1) return Number.POSITIVE_INFINITY;
  if (difficulty <= 3) return 3;
  return 2;
}

export function applyAdaptiveTrainerResult(
  state: AdaptiveTrainerState,
  result: TrainerResult,
  isChallenge: boolean,
): AdaptiveTrainerState {
  if (isChallenge && result !== "correct") return state;

  if (result === "correct") {
    const correctStreak = state.correctStreak + 1;
    if (correctStreak >= correctThreshold(state.difficulty)) {
      return createAdaptiveTrainerState(state.difficulty + 1);
    }

    return { ...state, correctStreak, incorrectStreak: 0 };
  }

  const incorrectStreak = state.incorrectStreak + 1;
  if (incorrectStreak >= incorrectThreshold(state.difficulty)) {
    return createAdaptiveTrainerState(state.difficulty - 1);
  }

  return { ...state, correctStreak: 0, incorrectStreak };
}

export function isTrainerChallengeQuestion(questionNumber: number) {
  return questionNumber > 0 && questionNumber % 10 === 0;
}
