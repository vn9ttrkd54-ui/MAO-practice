export type AttemptResult =
  | "correct"
  | "incorrect"
  | "give-up";

export type QuestionStatus =
  | "solved"
  | "attempted"
  | "new";

export interface QuestionProgress {
  attempts: number;
  correct: number;
  times: number[];
  lastResult: AttemptResult | null;

  /**
   * Unix timestamp in milliseconds for the most recent
   * correct answer. Null means the question has never
   * been answered correctly.
   */
  lastCorrectAt: number | null;
}