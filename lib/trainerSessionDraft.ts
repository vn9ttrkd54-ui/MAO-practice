import type { AdaptiveTrainerState } from "@/lib/trainerAdaptive";
import type { LevelProgress } from "@/types/level";
import type { AnswerChoice, Division } from "@/types/question";
import type { TrainerQuestionItem, TrainerQuestionResult } from "@/types/trainer";
import { MAX_TRAINER_SESSION_RESULTS } from "@/lib/trainerSessionSave";

// One draft per tab, never a credential or a source of authority for scoring.
export const TRAINER_DRAFT_KEY = "mao.trainer.active.v1";
export const TRAINER_DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export type TrainerPendingAnswer = { answer: AnswerChoice | null; time: number; answeredAt: number };
export type TrainerSessionDraft = {
  version: 1;
  owner: string | null;
  id: string;
  division: Division;
  questionId: number;
  requestId: string;
  sessionStartedAt: number;
  startTime: number;
  questionFinishedAt: number | null;
  endedAt: number | null;
  selectedAnswer: AnswerChoice | null;
  submitted: boolean;
  pending: TrainerPendingAnswer | null;
  results: TrainerQuestionResult[];
  adaptiveState: AdaptiveTrainerState;
  currentIsChallenge: boolean;
  levelProgress: LevelProgress;
  startingLevelProgress: LevelProgress;
};

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const answer = (v: unknown) => typeof v === "string" && /^[A-E]$/.test(v);
const integer = (v: unknown, min: number, max = Number.MAX_SAFE_INTEGER): v is number =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= min && v <= max;
const level = (v: LevelProgress) => v && integer(v.level, 1, 2147483647) && integer(v.progress, 0, 29);

/** Reject stale, malformed, different-account and obsolete-catalog drafts. */
export function parseTrainerDraft(raw: string, owner: string | null, items: TrainerQuestionItem[], now = Date.now()): TrainerSessionDraft | null {
  try {
    if (raw.length > 2_000_000) return null;
    const d = JSON.parse(raw) as TrainerSessionDraft;
    if (!d || d.version !== 1 || d.owner !== owner || !uuid.test(d.id) || !uuid.test(d.requestId)
      || !["Mu", "Alpha", "Theta"].includes(d.division)
      || !integer(d.sessionStartedAt, 0, now) || now - d.sessionStartedAt >= TRAINER_DRAFT_MAX_AGE_MS
      || !integer(d.startTime, d.sessionStartedAt, now)
      || (d.questionFinishedAt !== null && !integer(d.questionFinishedAt, d.startTime, now))
      || (d.endedAt !== null && !integer(d.endedAt, d.questionFinishedAt ?? d.startTime, now))
      || (d.selectedAnswer !== null && !answer(d.selectedAnswer))
      || typeof d.submitted !== "boolean" || typeof d.currentIsChallenge !== "boolean"
      || !level(d.levelProgress) || !level(d.startingLevelProgress)
      || !d.adaptiveState || !integer(d.adaptiveState.difficulty, 1, 5)
      || !integer(d.adaptiveState.correctStreak, 0, MAX_TRAINER_SESSION_RESULTS)
      || !integer(d.adaptiveState.incorrectStreak, 0, MAX_TRAINER_SESSION_RESULTS)
      || !Array.isArray(d.results) || d.results.length > MAX_TRAINER_SESSION_RESULTS) return null;
    const catalog = new Map(items.filter(item => item.division === d.division).map(item => [item.id, item]));
    if (!catalog.has(d.questionId) || d.results.some(r => !r || !catalog.has(r.questionId)
      || catalog.get(r.questionId)?.number !== r.questionNumber || !answer(r.correctAnswer)
      || (r.selectedAnswer !== null && !answer(r.selectedAnswer)) || !integer(r.elapsedSeconds, 0)
      || r.result !== (r.selectedAnswer === null ? "give-up" : r.selectedAnswer === r.correctAnswer ? "correct" : "incorrect"))) return null;
    if (d.pending !== null && (!d.pending || (d.pending.answer !== null && !answer(d.pending.answer))
      || !integer(d.pending.answeredAt, d.startTime, now)
      || d.pending.time !== Math.floor((d.pending.answeredAt - d.startTime) / 1000)
      || d.questionFinishedAt !== d.pending.answeredAt || d.selectedAnswer !== d.pending.answer)) return null;
    if ((d.pending === null) !== (d.questionFinishedAt === null)) return null;
    if (d.submitted) {
      const last = d.results.at(-1);
      if (!d.pending || !last || last.questionId !== d.questionId
        || last.selectedAnswer !== d.pending.answer || last.elapsedSeconds !== d.pending.time) return null;
    } else if (d.endedAt !== null && d.pending !== null) return null;
    return d;
  } catch { return null; }
}

export function writeTrainerDraft(draft: TrainerSessionDraft): boolean {
  try { sessionStorage.setItem(TRAINER_DRAFT_KEY, JSON.stringify(draft)); return true; }
  catch { return false; }
}

export function clearTrainerDraft(): void {
  try { sessionStorage.removeItem(TRAINER_DRAFT_KEY); } catch { /* Storage may be disabled. */ }
}
