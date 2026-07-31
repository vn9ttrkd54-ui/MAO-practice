import { questions } from "@/data/questions";

import {
  getBookmarkedQuestionIds,
} from "@/lib/bookmarks";

import {
  getLevelProgress,
} from "@/lib/levels";

import {
  getMultiplayerSummary,
} from "@/lib/multiplayer";

import {
  getTrainerHistory,
} from "@/lib/trainerHistory";

import {
  calculateQuestionBankSummary,
  calculateTrainerHistorySummary,
} from "@/lib/dashboard";

export interface DashboardData {
  multiplayer: ReturnType<
    typeof getMultiplayerSummary
  >;

  trainer: ReturnType<
    typeof calculateTrainerHistorySummary
  >;

  questionBank: ReturnType<
    typeof calculateQuestionBankSummary
  >;

  level: ReturnType<
    typeof getLevelProgress
  >;

  recentTrainerSessions: ReturnType<
    typeof getTrainerHistory
  >;
}

export function getDashboardData():
  DashboardData {
  const trainerHistory =
    getTrainerHistory();

  return {
    multiplayer:
      getMultiplayerSummary(),

    trainer:
      calculateTrainerHistorySummary(
        trainerHistory
      ),

    questionBank:
      calculateQuestionBankSummary(
        questions,
        getBookmarkedQuestionIds()
      ),

    level:
      getLevelProgress(),

    recentTrainerSessions:
      trainerHistory.slice(0, 5),
  };
}