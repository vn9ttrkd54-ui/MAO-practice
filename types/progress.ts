export type AttemptResult =
  | "correct"
  | "incorrect"
  | "give-up";

export type QuestionStatus =
  | "solved"
  | "attempted"
  | "new";

export interface PracticeTiming {
  count: number;
  totalSeconds: number;
  bestSeconds: number | null;
}

export interface QuestionProgress {
  attempts: number;
  correct: number;
  times: number[];
  /** Lifetime metrics; times is only the most recent 100 correct samples. */
  timing?: PracticeTiming;
  lastResult: AttemptResult | null;

  /**
   * Unix timestamp in milliseconds for the most recent
   * correct answer. Null means the question has never
   * been answered correctly.
   */
  lastCorrectAt: number | null;
}
