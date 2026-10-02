import type { DashboardData } from "@/types/dashboard";

const divisions = ["Mu", "Alpha", "Theta"];
export function dashboardObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid dashboard response.");
  return value as Record<string, unknown>;
}

function number(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER, integer = true): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isSafeInteger(value))) {
    throw new Error("Invalid dashboard count.");
  }
}
function text(value: unknown): asserts value is string {
  if (typeof value !== "string" || !value || value.length > 200) throw new Error("Invalid dashboard label.");
}
function list(value: unknown, maximum: number): unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new Error("Invalid dashboard list.");
  return value;
}
function division(value: unknown) {
  if (typeof value !== "string" || !divisions.includes(value)) throw new Error("Invalid dashboard division.");
}
function level(value: unknown) {
  const data = dashboardObject(value); number(data.level, 1); number(data.progress, 0, 29);
}
function stats(value: unknown) {
  const data = dashboardObject(value);
  for (const key of ["questionsAnswered", "correct", "incorrect", "giveUps"]) number(data[key]);
  number(data.accuracy, 0, 100);
  if (data.questionsAnswered !== Number(data.correct) + Number(data.incorrect) + Number(data.giveUps)) throw new Error("Inconsistent dashboard totals.");
}
function timestamp(value: unknown) { number(value, 0, 8.64e15, false); }

/** Reject incomplete/wrong-account snapshots instead of silently showing zeros. */
export function parseDashboardSnapshot(value: unknown, expectedUserId: string): DashboardData {
  const data = dashboardObject(value);
  if (data.version !== 1 || data.userId !== expectedUserId) throw new Error("Your dashboard account changed. Reload the page.");
  text(data.username);
  if (typeof data.isAdmin !== "boolean") throw new Error("Invalid dashboard profile.");
  level(data.level);
  const trainer = dashboardObject(data.trainer); stats(trainer);
  for (const key of ["sessionsCompleted", "averageSessionDurationSeconds", "bestSessionCorrect"]) number(trainer[key]);
  number(trainer.score, -Number.MAX_SAFE_INTEGER);
  number(trainer.averageQuestionsPerSession, 0, Number.MAX_SAFE_INTEGER, false);
  number(trainer.bestSessionAccuracy, 0, 100);
  const byDivision = list(trainer.sessionsByDivision, 3);
  if (byDivision.length !== 3) throw new Error("Incomplete division totals.");
  byDivision.forEach((value, index) => {
    const entry = dashboardObject(value);
    if (entry.division !== divisions[index]) throw new Error("Invalid division order.");
    number(entry.sessions);
  });
  for (const value of list(trainer.recentSessionAccuracy, 8)) {
    const entry = dashboardObject(value); text(entry.id); timestamp(entry.endedAt);
    number(entry.accuracy, 0, 100); number(entry.questionsAnswered);
  }
  const bank = dashboardObject(data.questionBank);
  for (const key of ["totalQuestions", "solved", "attempted", "newQuestions", "bookmarked"]) number(bank[key]);
  if (bank.totalQuestions !== Number(bank.solved) + Number(bank.attempted) + Number(bank.newQuestions)
    || Number(bank.bookmarked) > Number(bank.totalQuestions)) throw new Error("Inconsistent question totals.");
  const challenge = dashboardObject(data.challenge); number(challenge.currentStreak); number(challenge.longestStreak);
  const multiplayer = dashboardObject(data.multiplayer);
  if (multiplayer.status !== "active") throw new Error("Invalid multiplayer summary.");
  text(multiplayer.rank); number(multiplayer.rating); number(multiplayer.matchesPlayed); number(multiplayer.wins); number(multiplayer.currentStreak);
  if (multiplayer.averagePlacement !== null) number(multiplayer.averagePlacement, 1, Number.MAX_SAFE_INTEGER, false);
  for (const value of list(data.recentTrainerSessions, 5)) {
    const entry = dashboardObject(value); text(entry.id); division(entry.division); timestamp(entry.endedAt);
    level(entry.startingLevel); level(entry.endingLevel); stats(entry.stats);
  }
  for (const value of list(data.recentActivity, 10)) {
    const entry = dashboardObject(value); text(entry.id); timestamp(entry.occurredAt);
    if (entry.type === "trainer-session") {
      division(entry.division); number(entry.questionsAnswered); number(entry.accuracy, 0, 100);
    } else if (entry.type === "bookmark" || entry.type === "question") {
      number(entry.questionId, 1); number(entry.questionNumber, 1);
      if (entry.type === "question" && !["correct", "incorrect", "give-up"].includes(String(entry.result))) throw new Error("Invalid practice result.");
    } else throw new Error("Invalid activity type.");
  }
  return data as unknown as DashboardData;
}
