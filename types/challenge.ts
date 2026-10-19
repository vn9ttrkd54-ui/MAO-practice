import type { AnswerChoice, Division, QuestionIllustration, QuestionSource } from "@/types/question";

export type ChallengeQuestionId = `CH-${string}`;

export interface ChallengeQuestion {
  id: ChallengeQuestionId;
  division: Division;
  topic: string;
  difficulty: number;
  question: string;
  choices: Record<AnswerChoice, string>;
  answer: AnswerChoice;
  solution: string;
  illustration?: QuestionIllustration;
  source?: QuestionSource;
}

export interface DailyChallenge {
  date: string;
  questionId: ChallengeQuestionId;
  question: ChallengeQuestion;
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeDate: string;
  questionId: ChallengeQuestionId;
  selectedAnswer: AnswerChoice;
  correct: boolean;
  submittedAt: number;
}

export interface ChallengeUserStatistics {
  asOfDate: string;
  completedDates: string[];
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
  questionId: ChallengeQuestionId;
  selectedAnswer: AnswerChoice;
}

export interface ChallengeSubmissionResult {
  challengeDate: string;
  questionId: ChallengeQuestionId;
  selectedAnswer: AnswerChoice;
  correct: boolean;
  correctAnswer: AnswerChoice;
  solution: string;
  saved: boolean;
}
