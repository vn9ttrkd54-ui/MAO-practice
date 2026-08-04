import type { AnswerChoice, Division } from "@/types/question";

export interface ChallengeQuestion {
  id: number;
  division: Division;
  question: string;
  choices: Record<AnswerChoice, string>;
  answer: AnswerChoice;
  solution: string;
}

export interface DailyChallenge {
  date: string;
  questionId: number;
  question: ChallengeQuestion;
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeDate: string;
  questionId: number;
  selectedAnswer: AnswerChoice;
  correct: boolean;
  submittedAt: number;
}

export interface ChallengeUserStatistics {
  currentStreak: number;
  longestStreak: number;
  totalChallenges: number;
  correctChallenges: number;
  accuracy: number;
}

export interface ChallengeLeaderboardEntry {
  userId: string;
  username: string;
  currentStreak: number;
  longestStreak: number;
  rank: number;
}

export interface ChallengeOverview {
  dailyChallenge: DailyChallenge | null;
  attempt: ChallengeAttempt | null;
  statistics: ChallengeUserStatistics;
  leaderboard: ChallengeLeaderboardEntry[];
  userLeaderboardEntry: ChallengeLeaderboardEntry | null;
}

export interface SubmitChallengeInput {
  challengeDate: string;
  questionId: number;
  selectedAnswer: AnswerChoice;
}
