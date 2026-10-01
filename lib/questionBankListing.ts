import type { Division, Question } from "@/types/question";

// Explicit allowlist: never serialize question text, choices, answers or solutions
// into a division listing just because the Question type gains another field.
export type QuestionBankItem = Pick<Question, "id" | "number" | "division" | "topic" | "difficulty" | "methods">;
export const QUESTION_BANK_BATCH_SIZE = 120;

export function toQuestionBankItem(question: Question): QuestionBankItem {
  const { id, number, division, topic, difficulty, methods } = question;
  return { id, number, division, topic, difficulty, methods };
}

export function filterQuestionBankItems(items: QuestionBankItem[], filters: { topic: string; difficulty: string; method: string }) {
  return items.filter(question =>
    (filters.topic === "All Topics" || question.topic === filters.topic) &&
    (filters.difficulty === "All Difficulties" || question.difficulty === Number(filters.difficulty)) &&
    (filters.method === "All Methods" || question.methods.includes(filters.method)),
  );
}

// Lossless range compression keeps filtered order and works in copied/new-tab
// links. Legacy comma-separated sequence URLs still decode without storage.
export function encodeQuestionSequence(ids: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < ids.length; i++) {
    const start = ids[i];
    let end = start;
    while (i + 1 < ids.length && ids[i + 1] === end + 1) end = ids[++i];
    parts.push(end > start + 1 ? `${start}-${end}` : end === start ? `${start}` : `${start},${end}`);
  }
  return parts.join(",");
}

export function decodeQuestionSequence(raw: string | undefined, allowedIds: number[]): number[] | null {
  if (!raw || raw.length > 65_536) return null;
  const allowed = new Set(allowedIds);
  const result: number[] = [];
  const seen = new Set<number>();
  for (const part of raw.split(",")) {
    const match = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!match) return null;
    const start = Number(match[1]), end = Number(match[2] ?? match[1]);
    // Check before expanding: a user-supplied enormous range cannot allocate or loop.
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start || end - start + 1 > allowed.size - result.length) return null;
    for (let id = start; id <= end; id++) {
      if (!allowed.has(id) || seen.has(id)) return null;
      seen.add(id);
      result.push(id);
    }
  }
  return result.length ? result : null;
}

export function questionBankNavigation(id: number, orderedIds: number[], raw?: string) {
  const decoded = decodeQuestionSequence(raw, orderedIds);
  const sequence = decoded?.includes(id) ? decoded : null;
  const ids = sequence ?? orderedIds;
  const index = ids.indexOf(id);
  return {
    previousId: index > 0 ? ids[index - 1] : null,
    nextId: index >= 0 ? ids[index + 1] ?? null : null,
    sequence: sequence ? encodeQuestionSequence(sequence) : null,
  };
}

export function questionBankReturnTo(raw: string | null, division: Division): string {
  const fallback = `/practice/question-bank/${division.toLowerCase()}`;
  if (!raw || raw.length > 4096) return fallback;
  try {
    const url = new URL(raw, "https://question-bank.invalid");
    return url.origin === "https://question-bank.invalid" && url.pathname === fallback
      ? `${url.pathname}${url.search}` : fallback;
  } catch { return fallback; }
}

export function questionBankHref(id: number, returnTo: string, sequence?: string | null): string {
  const query = new URLSearchParams({ returnTo });
  if (sequence) query.set("sequence", sequence);
  return `/practice/question-bank/${id}?${query}`;
}
