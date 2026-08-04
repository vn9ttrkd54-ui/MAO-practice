import "server-only";

import { getChallengeQuestionById } from "@/data/challengeQuestions";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ChallengeAttempt,
  ChallengeLeaderboardEntry,
  ChallengeOverview,
  ChallengeUserStatistics,
  DailyChallenge,
  SubmitChallengeInput,
} from "@/types/challenge";
import type { ChallengeQuestionId } from "@/types/challenge";

interface DailyChallengeRow {
  challenge_date: string;
  question_id: string;
}

function notImplemented(): never {
  throw new Error("Challenge service is not implemented yet.");
}

export async function getTodayChallenge(): Promise<DailyChallenge | null> {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("daily_challenges")
    .select("challenge_date, question_id")
    .eq("challenge_date", today)
    .maybeSingle<DailyChallengeRow>();

  if (error) {
    throw new Error(`Unable to load today's challenge: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const questionId = data.question_id as ChallengeQuestionId;
  const question = getChallengeQuestionById(questionId);

  if (!question) {
    throw new Error(
      `Daily challenge ${data.challenge_date} references unknown question ${data.question_id}.`
    );
  }

  return {
    date: data.challenge_date,
    questionId,
    question,
  };
}

export async function getUserChallengeAttempt(): Promise<
  ChallengeAttempt | null
> {
  return notImplemented();
}

export async function submitChallenge(
  _input: SubmitChallengeInput
): Promise<ChallengeAttempt> {
  return notImplemented();
}

export async function getChallengeStatistics(): Promise<
  ChallengeUserStatistics
> {
  return notImplemented();
}

export async function getChallengeLeaderboard(): Promise<
  ChallengeLeaderboardEntry[]
> {
  return notImplemented();
}

export async function getUserLeaderboardPosition(): Promise<
  ChallengeLeaderboardEntry | null
> {
  return notImplemented();
}

export async function hasCompletedToday(): Promise<boolean> {
  return notImplemented();
}

export async function getChallengeOverview(): Promise<ChallengeOverview> {
  return notImplemented();
}
