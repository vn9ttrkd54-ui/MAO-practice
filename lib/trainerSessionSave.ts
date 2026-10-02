import type { TrainerHistoryPoint, TrainerSessionReceipt, TrainerSessionRecord } from "@/types/trainer";

export const MAX_TRAINER_SESSION_RESULTS = 2_000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const answers = ["A", "B", "C", "D", "E"];
function integer(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= max;
}

/** Match the fields historically persisted; per-answer timing remains local. */
export function trainerSessionArguments(session: TrainerSessionRecord, userId: string) {
  const levels = [session.startingLevel, session.endingLevel];
  if (!uuid.test(session.id) || !["Mu", "Alpha", "Theta"].includes(session.division)
    || !integer(session.startedAt, 0, 8.64e15) || !integer(session.endedAt, session.startedAt, 8.64e15)
    || levels.some(value => !value || !integer(value.level, 1, 2147483647) || !integer(value.progress, 0, 29))
    || !Array.isArray(session.results) || session.results.length > MAX_TRAINER_SESSION_RESULTS
    || session.results.some(value => !value || !integer(value.questionId, 1, 2147483647)
      || !integer(value.questionNumber, 1, 2147483647) || !answers.includes(value.correctAnswer)
      || (value.selectedAnswer !== null && !answers.includes(value.selectedAnswer))
      || value.result !== (value.selectedAnswer === null ? "give-up" : value.selectedAnswer === value.correctAnswer ? "correct" : "incorrect"))) {
    throw new Error("Unable to save an invalid Trainer session.");
  }
  return {
    p_expected_user_id: userId, p_session_id: session.id, p_division: session.division,
    p_started_at: new Date(session.startedAt).toISOString(), p_ended_at: new Date(session.endedAt).toISOString(),
    p_starting_level: session.startingLevel.level, p_starting_progress: session.startingLevel.progress,
    p_ending_level: session.endingLevel.level, p_ending_progress: session.endingLevel.progress,
    p_results: session.results.map(result => ({
      question_id: result.questionId, question_number: result.questionNumber,
      selected_answer: result.selectedAnswer, correct_answer: result.correctAnswer, result: result.result,
    })),
  };
}

export function parseTrainerSessionReceipt(value: unknown, session: TrainerSessionRecord, userId: string | null): TrainerSessionReceipt {
  const data = value as Partial<TrainerSessionReceipt> | null;
  if (!data || data.status !== "saved" || data.sessionId !== session.id || data.userId !== userId
    || !Array.isArray(data.recentSessions) || data.recentSessions.length < 1 || data.recentSessions.length > 5) {
    throw new Error("Unable to confirm this session. Retry session save to check it safely.");
  }
  const points = data.recentSessions;
  if (new Set(points.map(point => point?.id)).size !== points.length || points.some(point => !point
    || typeof point.id !== "string" || !uuid.test(point.id)
    || typeof point.endedAt !== "number" || !Number.isFinite(point.endedAt) || point.endedAt < 0 || point.endedAt > session.endedAt
    || !integer(point.questionsAnswered, 0, Number.MAX_SAFE_INTEGER) || !integer(point.accuracy, 0, 100))
    || points.some((point, index) => index > 0 && point.endedAt < points[index - 1].endedAt)) {
    throw new Error("Invalid Trainer history confirmation. Please retry.");
  }
  const current = points[points.length - 1];
  const accuracy = session.results.length ? Math.round(100 * session.results.filter(result => result.result === "correct").length / session.results.length) : 0;
  if (current.id !== session.id || Math.abs(current.endedAt - session.endedAt) > 0.01
    || current.questionsAnswered !== session.results.length || current.accuracy !== accuracy) {
    throw new Error("The saved session does not match this session. Please retry.");
  }
  return data as TrainerSessionReceipt;
}

export function localTrainerHistoryPoints(history: TrainerSessionRecord[], current: TrainerSessionRecord): TrainerHistoryPoint[] {
  const previous = history.filter(session => session.id !== current.id && (session.endedAt < current.endedAt
    || (session.endedAt === current.endedAt && session.id < current.id)))
    .sort((a, b) => b.endedAt - a.endedAt || b.id.localeCompare(a.id)).slice(0, 4).reverse();
  return [...previous, current].map(session => ({
    id: session.id, endedAt: session.endedAt, questionsAnswered: session.results.length,
    accuracy: session.results.length ? Math.round(100 * session.results.filter(result => result.result === "correct").length / session.results.length) : 0,
  }));
}
