import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { questions } from "@/data/questions";
import { dashboardObject, parseDashboardSnapshot } from "@/lib/dashboardSnapshot";
import { getMultiplayerSummary } from "@/lib/multiplayerSummary";

const questionNumbers = new Map(questions.map(question => [question.id, question.number]));
const questionIds = [...questionNumbers.keys()];

export async function readDashboardSnapshot(supabase: SupabaseClient, userId: string, signal: AbortSignal) {
  signal.throwIfAborted();
  const { data, error } = await supabase.rpc("get_dashboard_snapshot", { p_question_ids: questionIds }).abortSignal(signal);
  if (error) throw new Error("Unable to read dashboard snapshot.");
  signal.throwIfAborted();
  const raw = dashboardObject(data);
  const multiplayer = dashboardObject(raw.multiplayer);
  for (const field of ["rp", "rankedMatchesPlayed", "rankedWins"]) {
    if (!Number.isSafeInteger(multiplayer[field]) || Number(multiplayer[field]) < 0) throw new Error("Invalid rating summary.");
  }
  const averagePlacement = multiplayer.averagePlacement;
  if (averagePlacement !== null && (typeof averagePlacement !== "number" || !Number.isFinite(averagePlacement) || averagePlacement < 1)) {
    throw new Error("Invalid placement summary.");
  }
  if (!Array.isArray(raw.recentActivity) || raw.recentActivity.length > 10) throw new Error("Invalid recent activity.");
  return parseDashboardSnapshot({
    ...raw,
    multiplayer: {
      ...getMultiplayerSummary({ rp: Number(multiplayer.rp), rankedMatchesPlayed: Number(multiplayer.rankedMatchesPlayed), rankedWins: Number(multiplayer.rankedWins) }),
      averagePlacement: averagePlacement === null ? null : Number(averagePlacement.toFixed(1)),
      currentStreak: multiplayer.currentStreak,
    },
    recentActivity: raw.recentActivity.map(value => {
      const entry = dashboardObject(value);
      return entry.type === "trainer-session" ? entry : { ...entry, questionNumber: questionNumbers.get(Number(entry.questionId)) };
    }),
  }, userId);
}
