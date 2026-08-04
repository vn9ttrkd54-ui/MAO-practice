export {
  challengeQuestions,
  getChallengeQuestionById,
  requireChallengeQuestionById,
} from "@/data/challengeQuestions";

export {
  getChallengeByDate,
  getChallengeLeaderboard,
  getChallengeOverview,
  getChallengeStatistics,
  getCurrentChallengeDate,
  getTodayChallenge,
  getTodayChallengeQuestion,
  getUserChallengeAttempt,
  getUserLeaderboardPosition,
  hasCompletedToday,
  submitChallenge,
} from "@/lib/services/challengeService";

export type {
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
