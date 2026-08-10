import { questions } from "@/data/questions";
import {
  calculateQuestionBankSummary,
  calculateTrainerHistorySummary,
} from "@/lib/dashboard";
import { getLevelProgress } from "@/lib/services/levelService";
import { getTrainerHistory } from "@/lib/services/trainerHistoryService";
import { getMultiplayerSummary } from "@/lib/multiplayerSummary";
import { createClient } from "@/lib/supabase/client";

import type { AttemptResult } from "@/types/progress";
import type { Division } from "@/types/question";

export type DashboardActivity =
  | {
      id: string;
      type: "question";
      occurredAt: number;
      questionId: number;
      questionNumber: number;
      result: AttemptResult;
    }
  | {
      id: string;
      type: "bookmark";
      occurredAt: number;
      questionId: number;
      questionNumber: number;
    }
  | {
      id: string;
      type: "trainer-session";
      occurredAt: number;
      division: Division;
      questionsAnswered: number;
      accuracy: number;
    };

export interface DashboardData {
  username: string;
  isAdmin: boolean;
  multiplayer: ReturnType<typeof getMultiplayerSummary>;
  trainer: ReturnType<typeof calculateTrainerHistorySummary>;
  questionBank: ReturnType<typeof calculateQuestionBankSummary>;
  challenge: {
    currentStreak: number;
    longestStreak: number;
  };
  level: Awaited<ReturnType<typeof getLevelProgress>>;
  recentTrainerSessions: Awaited<
    ReturnType<typeof getTrainerHistory>
  >;
  recentActivity: DashboardActivity[];
}

interface ProgressRow {
  question_id: number;
  last_result: AttemptResult | null;
  last_attempted_at: string | null;
}

interface BookmarkRow {
  question_id: number;
  created_at: string;
}

interface ProfileRow {
  username: string;
  role: "user" | "admin";
}

interface ChallengeStatisticsRow {
  current_streak: number;
  longest_streak: number;
}

interface ChallengeAttemptDateRow {
  challenge_date: string;
}

interface MultiplayerProfileRow { rp: number; ranked_matches_played: number; ranked_wins: number; }
interface MultiplayerResultRow { placement: number; }

export async function getDashboardData():
  Promise<DashboardData> {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session?.user) {
    throw new Error("A signed-in user is required.");
  }

  const userId = session.user.id;

  const [
    level,
    trainerHistory,
    progressResponse,
    bookmarksResponse,
    profileResponse,
    challengeStatisticsResponse,
    latestChallengeAttemptResponse,
    multiplayerProfileResponse,
    multiplayerResultsResponse,
  ] = await Promise.all([
    getLevelProgress(),
    getTrainerHistory(),
    supabase
      .from("question_progress")
      .select(
        "question_id, last_result, last_attempted_at"
      )
      .eq("user_id", userId),
    supabase
      .from("bookmarks")
      .select("question_id, created_at")
      .eq("user_id", userId),
    supabase
      .from("profiles")
      .select("username, role")
      .eq("id", userId)
      .single<ProfileRow>(),
    supabase
      .from("challenge_user_statistics")
      .select("current_streak, longest_streak")
      .eq("user_id", userId)
      .maybeSingle<ChallengeStatisticsRow>(),
    supabase
      .from("challenge_attempts")
      .select("challenge_date")
      .eq("user_id", userId)
      .order("challenge_date", { ascending: false })
      .limit(1)
      .maybeSingle<ChallengeAttemptDateRow>(),
    supabase.from("multiplayer_profiles").select("rp, ranked_matches_played, ranked_wins").eq("user_id", userId).maybeSingle<MultiplayerProfileRow>(),
    supabase.from("multiplayer_match_results").select("placement").eq("user_id", userId).eq("ranked", true).order("finalized_at", { ascending: false }),
  ]);

  if (progressResponse.error) {
    throw new Error(progressResponse.error.message);
  }

  if (bookmarksResponse.error) {
    throw new Error(bookmarksResponse.error.message);
  }

  if (profileResponse.error) {
    throw new Error(profileResponse.error.message);
  }

  if (challengeStatisticsResponse.error) {
    throw new Error(challengeStatisticsResponse.error.message);
  }

  if (latestChallengeAttemptResponse.error) {
    throw new Error(latestChallengeAttemptResponse.error.message);
  }
  if (multiplayerProfileResponse.error || multiplayerResultsResponse.error) {
    throw new Error("Unable to load multiplayer dashboard statistics.");
  }

  const challengeStatistics = challengeStatisticsResponse.data;
  const latestChallengeAttempt = latestChallengeAttemptResponse.data;
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const activeCurrentStreak =
    challengeStatistics &&
    latestChallengeAttempt &&
    latestChallengeAttempt.challenge_date >= yesterday
      ? challengeStatistics.current_streak
      : 0;

  const progressRows =
    (progressResponse.data ?? []) as ProgressRow[];
  const bookmarkRows =
    (bookmarksResponse.data ?? []) as BookmarkRow[];

  const progressByQuestionId = new Map<
    number,
    AttemptResult | null
  >(
    progressRows.map((row) => [
      row.question_id,
      row.last_result,
    ])
  );

  const bookmarkedQuestionIds = bookmarkRows.map(
    (row) => row.question_id
  );

  const questionNumberById = new Map(
    questions.map((question) => [
      question.id,
      question.number,
    ])
  );

  const questionActivity: DashboardActivity[] =
    progressRows.flatMap((row) => {
      const questionNumber =
        questionNumberById.get(row.question_id);

      if (
        !row.last_result ||
        !row.last_attempted_at ||
        questionNumber === undefined
      ) {
        return [];
      }

      return [
        {
          id: `question-${row.question_id}-${row.last_attempted_at}`,
          type: "question" as const,
          occurredAt: new Date(
            row.last_attempted_at
          ).getTime(),
          questionId: row.question_id,
          questionNumber,
          result: row.last_result,
        },
      ];
    });

  const bookmarkActivity: DashboardActivity[] =
    bookmarkRows.flatMap((row) => {
      const questionNumber =
        questionNumberById.get(row.question_id);

      if (questionNumber === undefined) {
        return [];
      }

      return [
        {
          id: `bookmark-${row.question_id}-${row.created_at}`,
          type: "bookmark" as const,
          occurredAt: new Date(row.created_at).getTime(),
          questionId: row.question_id,
          questionNumber,
        },
      ];
    });

  const trainerActivity: DashboardActivity[] =
    trainerHistory.map((trainerSession) => {
      const questionsAnswered =
        trainerSession.results.length;
      const correct = trainerSession.results.filter(
        (result) => result.result === "correct"
      ).length;

      return {
        id: `trainer-${trainerSession.id}`,
        type: "trainer-session" as const,
        occurredAt: trainerSession.endedAt,
        division: trainerSession.division,
        questionsAnswered,
        accuracy:
          questionsAnswered > 0
            ? Math.round(
                (correct / questionsAnswered) * 100
              )
            : 0,
      };
    });

  const recentActivity = [
    ...questionActivity,
    ...bookmarkActivity,
    ...trainerActivity,
  ]
    .sort(
      (first, second) =>
        second.occurredAt - first.occurredAt
    )
    .slice(0, 10);

  return {
    username: profileResponse.data.username,
    isAdmin: profileResponse.data.role === "admin",
    multiplayer: getMultiplayerSummary({
      rp: multiplayerProfileResponse.data?.rp ?? 0,
      rankedMatchesPlayed: multiplayerProfileResponse.data?.ranked_matches_played ?? 0,
      rankedWins: multiplayerProfileResponse.data?.ranked_wins ?? 0,
      placements: ((multiplayerResultsResponse.data ?? []) as MultiplayerResultRow[]).map((result) => result.placement),
    }),
    trainer:
      calculateTrainerHistorySummary(trainerHistory),
    questionBank: calculateQuestionBankSummary(
      questions,
      progressByQuestionId,
      bookmarkedQuestionIds
    ),
    challenge: {
      currentStreak: activeCurrentStreak,
      longestStreak: challengeStatistics?.longest_streak ?? 0,
    },
    level,
    recentTrainerSessions: trainerHistory.slice(0, 5),
    recentActivity,
  };
}
