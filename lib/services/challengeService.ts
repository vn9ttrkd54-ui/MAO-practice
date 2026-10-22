import "server-only";

import { requireDailyQuestionById } from "@/lib/challengeQuestionCatalog";
import { getChallengeDate } from "@/lib/challengeDate";
import { getChallengeWeekDates } from "@/lib/challengeWeek";
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
import type { AnswerChoice, Division } from "@/types/question";

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

interface ChallengeStatisticsRow {
  current_streak: number;
  longest_streak: number;
  total_completed: number;
  total_correct: number;
}

const CHALLENGE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ANSWER_CHOICES: AnswerChoice[] = ["A", "B", "C", "D", "E"];

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
  return getChallengeDate(now);
}

export async function getChallengeByDate(
  date: string, division: Division = "Mu"
): Promise<DailyChallenge | null> {
  const challengeDate = validateChallengeDate(date);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_challenges")
    .select("challenge_date, question_id")
    .eq("challenge_date", challengeDate)
    .eq("division", division)
    .maybeSingle<DailyChallengeRow>();

  if (error) {
    throw new Error(
      `Unable to load the challenge for ${challengeDate}: ${error.message}`
    );
  }
  if (!data) return null;

  const questionId = data.question_id as ChallengeQuestionId;
  const question = requireDailyQuestionById(questionId);
  if (question.division !== division) throw new Error("The daily question's division does not match its assignment.");
  return {
    date: data.challenge_date,
    questionId,
    question,
  };
}

export async function getTodayChallenge(division: Division = "Mu"): Promise<DailyChallenge | null> {
  return getChallengeByDate(getCurrentChallengeDate(), division);
}

export async function getTodayChallengeQuestion(): Promise<
  ChallengeQuestion | null
> {
  return (await getTodayChallenge())?.question ?? null;
}

export async function getUserChallengeAttempt(questionId?: ChallengeQuestionId): Promise<
  ChallengeAttempt | null
> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  let query = supabase
    .from("challenge_attempts")
    .select(
      "id, user_id, challenge_date, question_id, selected_answer, correct, submitted_at"
    )
    .eq("user_id", authData.user.id)
    .eq("challenge_date", getCurrentChallengeDate());
  if (questionId) query = query.eq("question_id", questionId);
  const { data, error } = await query.order("submitted_at", { ascending: false }).limit(1).maybeSingle<ChallengeAttemptRow>();

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

  const requestedQuestion = requireDailyQuestionById(input.questionId);
  const dailyChallenge = await getChallengeByDate(today, requestedQuestion.division);
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
    throw new Error("You have already submitted this division’s Challenge today.");
  }
  if (error) {
    throw new Error("Unable to submit the Challenge right now.");
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
  const today = getCurrentChallengeDate();
  const weekStart = getChallengeWeekDates(today)[0];
  // These are calendar keys, not instants; do not apply New York's offset twice.
  const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const emptyStatistics: ChallengeUserStatistics = {
    asOfDate: today,
    completedDates: [],
    currentStreak: 0,
    longestStreak: 0,
    totalChallenges: 0,
    correctChallenges: 0,
    accuracy: 0,
  };

  if (!authData.user) return emptyStatistics;

  const [{ data: statistics, error: statisticsError }, { data: recentAttempts, error: attemptError }] =
    await Promise.all([
      supabase
        .from("challenge_user_statistics")
        .select("current_streak, longest_streak, total_completed, total_correct")
        .eq("user_id", authData.user.id)
        .maybeSingle<ChallengeStatisticsRow>(),
      supabase
        .from("challenge_attempts")
        .select("challenge_date")
        .eq("user_id", authData.user.id)
        // Include Sunday on Mondays to preserve the existing streak grace day.
        .gte("challenge_date", weekStart < yesterday ? weekStart : yesterday)
        .lte("challenge_date", today)
        .order("challenge_date", { ascending: false })
        .limit(24)
        .returns<{ challenge_date: string }[]>(),
    ]);

  if (statisticsError || attemptError) {
    throw new Error(
      `Unable to load Challenge statistics: ${
        statisticsError?.message ?? attemptError?.message
      }`
    );
  }
  // A saved answer in any division completes the day; correctness still controls streaks.
  const completedDates = [...new Set((recentAttempts ?? [])
    .map(attempt => attempt.challenge_date).filter(date => date >= weekStart && date <= today))];
  if (!statistics) return { ...emptyStatistics, completedDates };
  const latestAttempt = recentAttempts?.[0];
  const currentStreak =
    latestAttempt && latestAttempt.challenge_date >= yesterday
      ? statistics.current_streak
      : 0;

  return {
    asOfDate: today,
    completedDates,
    currentStreak,
    longestStreak: statistics.longest_streak,
    totalChallenges: statistics.total_completed,
    correctChallenges: statistics.total_correct,
    accuracy:
      statistics.total_completed === 0
        ? 0
        : (statistics.total_correct / statistics.total_completed) * 100,
  };
}

export async function getChallengeLeaderboard(): Promise<
  ChallengeLeaderboardEntry[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_challenge_leaderboard");

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
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase.rpc(
    "get_my_challenge_leaderboard_position"
  );

  if (error) {
    throw new Error(`Unable to load your Challenge rank: ${error.message}`);
  }

  const entry = (data?.[0] ?? null) as ChallengeLeaderboardRow | null;
  return entry
    ? {
        userId: entry.user_id,
        username: entry.username,
        currentStreak: entry.current_streak,
        longestStreak: entry.longest_streak,
        rank: Number(entry.rank),
      }
    : null;
}

export async function hasCompletedToday(): Promise<boolean> {
  return (await getUserChallengeAttempt()) !== null;
}

export async function getChallengeOverview(division: Division = "Mu"): Promise<ChallengeOverview> {
  const dailyChallenge = await getTodayChallenge(division);
  const scheduledQuestionId = dailyChallenge?.questionId;
  const [
    attempt,
    statistics,
    leaderboard,
    userLeaderboardEntry,
  ] = await Promise.all([
    scheduledQuestionId ? getUserChallengeAttempt(scheduledQuestionId) : Promise.resolve(null),
    getChallengeStatistics(),
    getChallengeLeaderboard(),
    getUserLeaderboardPosition(),
  ]);

  return {
    dailyChallenge,
    attempt,
    statistics,
    leaderboard,
    userLeaderboardEntry,
  };
}
