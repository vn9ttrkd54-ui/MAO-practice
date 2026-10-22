import "server-only";

import { questions } from "@/data/questions";
import { pickBankChallenge } from "@/lib/challengeBankFallback";
import { getChallengeDate } from "@/lib/challengeDate";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Division } from "@/types/question";

/** Public, bounded action: caller can choose only a division, never date/content/score. */
export async function ensureTodayChallenge(division: Division): Promise<void> {
  if (!["Mu", "Alpha", "Theta"].includes(division)) throw new Error("Invalid division.");
  const today = getChallengeDate(new Date());
  const admin = createAdminClient();
  const readAssignment = () => admin.from("daily_challenges").select("question_id")
    .eq("challenge_date", today).eq("division", division).maybeSingle();
  const existing = await readAssignment();
  if (existing.error) throw new Error("Unable to prepare today's question. Please retry.");
  if (existing.data) return;

  const history: { question_id: string; challenge_date: string }[] = [];
  // Paginate so the API's row limit cannot silently cause repeated questions.
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await admin.from("daily_challenges")
      .select("question_id, challenge_date").eq("division", division)
      .lt("challenge_date", today).order("challenge_date", { ascending: false })
      .range(offset, offset + 499);
    if (error || !data) throw new Error("Unable to prepare today's question. Please retry.");
    history.push(...data);
    if (data.length < 500) break;
  }
  const questionId = pickBankChallenge(questions, division, history);
  if (!questionId) throw new Error("No published questions are available for this division.");
  // A second visitor or a manual assignment may win the race. Never overwrite it.
  const { error } = await admin.from("daily_challenges").upsert({
    challenge_date: today, division, question_id: questionId,
  }, { onConflict: "challenge_date,division", ignoreDuplicates: true });
  if (error) throw new Error("Unable to prepare today's question. Please retry.");
  const saved = await readAssignment();
  if (saved.error || !saved.data) throw new Error("Unable to prepare today's question. Please retry.");
}
