export interface SavedMultiplayerAnswer {
  questionId: number;
  questionNumber: number;
  selectedAnswer: "A" | "B" | "C" | "D" | "E" | null;
}

export function restoreMultiplayerAnswers(raw: string | null): SavedMultiplayerAnswer[] {
  try {
    const entries: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(entries)) return [];
    const seen = new Set<number>();
    return entries.filter((entry): entry is SavedMultiplayerAnswer => {
      if (!entry || !Number.isSafeInteger(entry.questionId) || entry.questionId <= 0
        || !Number.isInteger(entry.questionNumber) || entry.questionNumber < 1 || entry.questionNumber > 30
        || (entry.selectedAnswer !== null && !["A", "B", "C", "D", "E"].includes(entry.selectedAnswer))
        || seen.has(entry.questionId)) return false;
      seen.add(entry.questionId);
      return true;
    }).slice(0, 30).map(({ questionId, questionNumber, selectedAnswer }) => ({ questionId, questionNumber, selectedAnswer }));
  } catch { return []; }
}

export function acceptRoundSnapshot(version: number, question: number, currentVersion: number, currentQuestion: number) {
  return Number.isSafeInteger(version) && Number.isInteger(question)
    && version >= currentVersion && question >= currentQuestion;
}
