import "server-only";

import { requireChallengeQuestionById } from "@/data/challengeQuestions";
import { createAdminClient } from "@/lib/supabase/admin";

import type {
  ChallengeAttempt,
  ChallengeLeaderboardEntry,
  ChallengeOverview,
  ChallengeQuestion,
  ChallengeQuestionId,
  ChallengeUserStatistics,
  DailyChallenge,
  SubmitChallengeInput,
} from "@/types/challenge";

interface DailyChallengeRow {
  challenge_date: string;
  question_id: string;
}

const CHALLENGE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function notImplemented(): never {
  throw new Error("Challenge service is not implemented yet.");
}

function validateChallengeDate(date: string): string {
  if (!CHALLENGE_DATE_PATTERN.test(date)) {
    throw new Error(
      `Invalid challenge date "${date}". Expected YYYY-MM-DD.`
    );
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Invalid challenge date "${date}".`);
  }

  return date;
}

export function getCurrentChallengeDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export async function getChallengeByDate(
  date: string
): Promise<DailyChallenge | null> {
  const challengeDate = validateChallengeDate(date);
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("daily_challenges")
    .select("challenge_date, question_id")
    .eq("challenge_date", challengeDate)
    .maybeSingle<DailyChallengeRow>();

  if (error) {
    throw new Error(
      `Unable to load the challenge for ${challengeDate}: ${error.message}`
    );
  }

  if (!data) {
    return null;
  }

  const questionId = data.question_id as ChallengeQuestionId;
  const question = requireChallengeQuestionById(questionId);

  return {
    date: data.challenge_date,
    questionId,
    question,
  };
}

export async function getTodayChallenge(): Promise<DailyChallenge | null> {
  return getChallengeByDate(getCurrentChallengeDate());
}

export async function getTodayChallengeQuestion(): Promise<
  ChallengeQuestion | null
> {
  const dailyChallenge = await getTodayChallenge();
  return dailyChallenge?.question ?? null;
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
