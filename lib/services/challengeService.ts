import "server-only";

import { requireChallengeQuestionById } from "@/data/challengeQuestions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  ChallengeAttempt,
  ChallengeLeaderboardEntry,
  ChallengeOverview,
  ChallengeQuestion,
  ChallengeQuestionId,
  ChallengeSubmissionResult,
  ChallengeUserStatistics,
  DailyChallenge,
  SubmitChallengeInput,
} from "@/types/challenge";
import type { AnswerChoice } from "@/types/question";

interface DailyChallengeRow {
  challenge_date: string;
  question_id: string;
}

interface ChallengeAttemptRow {
  id: string;
  user_id: string;
  challenge_date: string;
  question_id: string;
  selected_answer: string;
  correct: boolean;
  submitted_at: string;
}

interface ChallengeLeaderboardRow {
  user_id: string;
  username: string;
  current_streak: number;
  longest_streak: number;
  rank: number | string;
}

const CHALLENGE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ANSWER_CHOICES: AnswerChoice[] = ["A", "B", "C", "D", "E"];

function notImplemented(): never {
  throw new Error("Challenge service is not implemented yet.");
}

function validateChallengeDate(date: string): string {
  if (!CHALLENGE_DATE_PATTERN.test(date)) {
    throw new Error(`Invalid challenge date "${date}". Expected YYYY-MM-DD.`);
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

function mapAttempt(row: ChallengeAttemptRow): ChallengeAttempt {
  return {
    id: row.id,
    userId: row.user_id,
    challengeDate: row.challenge_date,
    questionId: row.question_id as ChallengeQuestionId,
    selectedAnswer: row.selected_answer as AnswerChoice,
    correct: row.correct,
    submittedAt: new Date(row.submitted_at).getTime(),
  };
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
  if (!data) return null;

  const questionId = data.question_id as ChallengeQuestionId;
  return {
    date: data.challenge_date,
    questionId,
    question: requireChallengeQuestionById(questionId),
  };
}

export async function getTodayChallenge(): Promise<DailyChallenge | null> {
  return getChallengeByDate(getCurrentChallengeDate());
}

export async function getTodayChallengeQuestion(): Promise<
  ChallengeQuestion | null
> {
  return (await getTodayChallenge())?.question ?? null;
}

export async function getUserChallengeAttempt(): Promise<
  ChallengeAttempt | null
> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from("challenge_attempts")
    .select(
      "id, user_id, challenge_date, question_id, selected_answer, correct, submitted_at"
    )
    .eq("user_id", authData.user.id)
    .eq("challenge_date", getCurrentChallengeDate())
    .maybeSingle<ChallengeAttemptRow>();

  if (error) {
    throw new Error(`Unable to load your Challenge attempt: ${error.message}`);
  }
  return data ? mapAttempt(data) : null;
}

export async function submitChallenge(
  input: SubmitChallengeInput
): Promise<ChallengeSubmissionResult> {
  const today = getCurrentChallengeDate();
  if (validateChallengeDate(input.challengeDate) !== today) {
    throw new Error("Only today's Challenge can be submitted.");
  }
  if (!ANSWER_CHOICES.includes(input.selectedAnswer)) {
    throw new Error("Select a valid answer choice.");
  }

  const dailyChallenge = await getChallengeByDate(today);
  if (!dailyChallenge || dailyChallenge.questionId !== input.questionId) {
    throw new Error("Today's Challenge assignment has changed. Refresh the page.");
  }

  const correct = input.selectedAnswer === dailyChallenge.question.answer;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return {
      ...input,
      correct,
      correctAnswer: dailyChallenge.question.answer,
      solution: dailyChallenge.question.solution,
      saved: false,
    };
  }

  const admin = createAdminClient();
  const { error } = await admin.rpc("submit_challenge_attempt", {
    p_user_id: authData.user.id,
    p_challenge_date: today,
    p_question_id: input.questionId,
    p_selected_answer: input.selectedAnswer,
    p_correct: correct,
  });

  if (error?.code === "23505") {
    throw new Error("You have already submitted today's Challenge.");
  }
  if (error) {
    throw new Error(`Unable to submit the Challenge: ${error.message}`);
  }

  return {
    ...input,
    correct,
    correctAnswer: dailyChallenge.question.answer,
    solution: dailyChallenge.question.solution,
    saved: true,
  };
}

export async function getChallengeStatistics(): Promise<ChallengeUserStatistics> {
  return notImplemented();
}

export async function getChallengeLeaderboard(): Promise<
  ChallengeLeaderboardEntry[]
> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("get_challenge_leaderboard");

  if (error) {
    throw new Error(`Unable to load the Challenge leaderboard: ${error.message}`);
  }

  return ((data ?? []) as ChallengeLeaderboardRow[]).map((entry) => ({
    userId: entry.user_id,
    username: entry.username,
    currentStreak: entry.current_streak,
    longestStreak: entry.longest_streak,
    rank: Number(entry.rank),
  }));
}

export async function getUserLeaderboardPosition(): Promise<
  ChallengeLeaderboardEntry | null
> {
  return notImplemented();
}

export async function hasCompletedToday(): Promise<boolean> {
  return (await getUserChallengeAttempt()) !== null;
}

export async function getChallengeOverview(): Promise<ChallengeOverview> {
  return notImplemented();
}
