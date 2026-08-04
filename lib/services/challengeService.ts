import type {
  ChallengeAttempt,
  ChallengeLeaderboardEntry,
  ChallengeOverview,
  ChallengeUserStatistics,
  DailyChallenge,
  SubmitChallengeInput,
} from "@/types/challenge";

function notImplemented(): never {
  throw new Error("Challenge service is not implemented yet.");
}

export async function getTodayChallenge(): Promise<DailyChallenge | null> {
  return notImplemented();
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
