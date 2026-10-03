import { createClient } from "@/lib/supabase/client";
import { getMemoryProgressSnapshot } from "@/lib/storage/progress/memoryProgressStorage";
import { memoryLevelStorage } from "@/lib/storage/levels/memoryLevelStorage";
import { createDefaultLevel } from "@/lib/storage/levels/levelStorage";
import { selectNextTrainerQuestion, type TrainerSelectionOptions } from "@/lib/trainer";
import { withRequestTimeout } from "@/lib/requestTimeout";
import type { TrainerQuestionItem, TrainerSelectionProgress } from "@/types/trainer";
import type { Question } from "@/types/question";
import type { LevelProgress } from "@/types/level";

type ProgressRow = {
  question_id: number;
  attempts: number;
  correct: number;
  last_result: TrainerSelectionProgress["lastResult"];
  last_correct_at: string | null;
};

export class TrainerAccountChangedError extends Error {
  constructor() { super("Your account changed. Reload Trainer to start a new session."); }
}

// Recovery fetches the same public question, not a fresh adaptive selection.
export async function loadTrainerQuestion(selected: TrainerQuestionItem, signal: AbortSignal): Promise<Question> {
  const response = await fetch(`/api/practice/trainer/question?id=${selected.id}`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load this Trainer question. Please retry.");
  const { question } = await response.json() as { question?: Question };
  signal.throwIfAborted();
  if (!question || question.id !== selected.id || question.division !== selected.division
    || question.difficulty !== selected.difficulty || question.topic !== selected.topic
    || question.number !== selected.number || typeof question.question !== "string"
    || typeof question.solution !== "string" || !Array.isArray(question.choices)
    || !question.choices.every(choice => typeof choice === "string")
    || !["A", "B", "C", "D", "E"].includes(question.answer)) {
    throw new Error("The question catalog changed. Reload Trainer and try again.");
  }
  return question;
}

export async function getNextTrainerSelection(
  items: TrainerQuestionItem[],
  options: TrainerSelectionOptions,
  request: { signal?: AbortSignal; expectedUserId?: string | null; includeLevel?: boolean } = {},
): Promise<{ question: Question | null; userId: string | null; level: LevelProgress }> {
  return withRequestTimeout(async signal => {
    const supabase = createClient();
    const readOwner = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      signal.throwIfAborted();
      if (error) throw new Error("Unable to verify your account. Please retry.");
      return session?.user.id ?? null;
    };
    const userId = await readOwner();
    if (request.expectedUserId !== undefined && request.expectedUserId !== userId) throw new TrainerAccountChangedError();
    const verifyOwner = async () => { if (await readOwner() !== userId) throw new TrainerAccountChangedError(); };
    const divisionItems = items.filter(item => item.division === options.division);
    const ids = new Set(divisionItems.map(item => item.id));
    const currentTime = Date.now();
    const reads = new AbortController();
    const cancelReads = () => reads.abort(signal.reason);
    signal.addEventListener("abort", cancelReads, { once: true });

    async function readProgress() {
      const progress = new Map<number, TrainerSelectionProgress>();
      if (!userId) {
        for (const [id, value] of getMemoryProgressSnapshot()) if (ids.has(id)) progress.set(id, value);
        return progress;
      }
      if (!ids.size) return progress;
      const min = divisionItems.reduce((value, item) => Math.min(value, item.id), Infinity);
      const max = divisionItems.reduce((value, item) => Math.max(value, item.id), -Infinity);
      // Indexed user/question range + exact membership filtering. Do not fetch
      // timing arrays, bookmarks, full history, or one row per network request.
      for (let offset = 0; ; offset += 500) {
        reads.signal.throwIfAborted();
        const { data, error } = await supabase.from("question_progress")
          .select("question_id, attempts, correct, last_result, last_correct_at")
          .eq("user_id", userId).gte("question_id", min).lte("question_id", max)
          .order("question_id", { ascending: true }).range(offset, offset + 499).abortSignal(reads.signal);
        if (error) throw new Error("Unable to load your Trainer progress. Please retry.");
        const rows = (data ?? []) as ProgressRow[];
        for (const row of rows) if (ids.has(row.question_id)) progress.set(row.question_id, {
          attempts: row.attempts, correct: row.correct, lastResult: row.last_result,
          lastCorrectAt: row.last_correct_at === null ? null : new Date(row.last_correct_at).getTime(),
        });
        if (rows.length < 500) return progress;
      }
    }

    async function readLevel(): Promise<LevelProgress> {
      if (!request.includeLevel) return createDefaultLevel();
      if (!userId) return memoryLevelStorage.getLevelProgress();
      const { data, error } = await supabase.from("user_levels").select("level, progress")
        .eq("user_id", userId).abortSignal(reads.signal).maybeSingle();
      if (error) throw new Error("Unable to load your Trainer level. Please retry.");
      // Missing rows are initialized by the verified result RPC, never a read.
      return data ?? createDefaultLevel();
    }

    let progress: Map<number, TrainerSelectionProgress>, level: LevelProgress;
    try {
      [progress, level] = await Promise.all([readProgress(), readLevel()]);
    } finally {
      reads.abort();
      signal.removeEventListener("abort", cancelReads);
    }
    await verifyOwner();
    const selected = selectNextTrainerQuestion(divisionItems, progress, options, currentTime);
    if (!selected) return { question: null, userId, level };
    const question = await loadTrainerQuestion(selected, signal);
    await verifyOwner();
    return { question, userId, level };
  }, { signal: request.signal, message: "Loading Trainer took too long. Please retry." });
}
