import type { DashboardData } from "@/types/dashboard";

export const dashboardOwner = "00000000-0000-4000-8000-000000000001";
export function dashboardFixture(userId = dashboardOwner): DashboardData {
  return {
    version: 1, userId, username: "fixture_student", isAdmin: false,
    level: { level: 7, progress: 11 },
    trainer: {
      sessionsCompleted: 1105, questionsAnswered: 2000, correct: 1200, incorrect: 500, giveUps: 300,
      accuracy: 60, score: 400, averageQuestionsPerSession: 1.8, averageSessionDurationSeconds: 90,
      bestSessionAccuracy: 100, bestSessionCorrect: 20,
      recentSessionAccuracy: [{ id: "recent", endedAt: 1780000000000, accuracy: 60, questionsAnswered: 10 }],
      sessionsByDivision: [{ division: "Mu", sessions: 505 }, { division: "Alpha", sessions: 300 }, { division: "Theta", sessions: 300 }],
    },
    questionBank: { totalQuestions: 1010, solved: 550, attempted: 100, newQuestions: 360, bookmarked: 50 },
    multiplayer: { status: "active", rank: "Diamond", rating: 1050, matchesPlayed: 1107, wins: 1106, averagePlacement: 1, currentStreak: 1106 },
    challenge: { currentStreak: 3, longestStreak: 9 },
    recentTrainerSessions: [{ id: "recent", division: "Mu", endedAt: 1780000000000,
      startingLevel: { level: 6, progress: 29 }, endingLevel: { level: 7, progress: 5 },
      stats: { questionsAnswered: 10, correct: 6, incorrect: 3, giveUps: 1, accuracy: 60 } }],
    recentActivity: [{ id: "q-42", type: "question", occurredAt: 1780000000000, questionId: 42, questionNumber: 7, result: "correct" }],
  };
}
