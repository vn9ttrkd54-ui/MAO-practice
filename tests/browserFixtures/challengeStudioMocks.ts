import type { Division } from "@/types/question";
let result: { selectedAnswer: string; correct: boolean } | null = null;
export function useRouter() {
  return {
    replace(url: string) { result = null; history.replaceState(null, "", url); window.dispatchEvent(new Event("challenge-render")); },
    refresh() { window.dispatchEvent(new Event("challenge-render")); },
  };
}
export async function getChallengeOverview(division: Division) {
  const question = { id: `CH-${division}`, division, topic: "Fixture topic", difficulty: 4, question: "Evaluate \\(\\frac{d}{dx}(x^3-2x)\\).", choices: { A: "\\(3x^2-2\\)", B: "\\(x^2-2\\)", C: "\\(3x-2\\)", D: "\\(3x^2\\)", E: "None of these" }, answer: "A", solution: "Differentiate each term: \\(3x^2-2\\)." };
  return {
    dailyChallenge: location.search.includes("empty=1") ? null : { date: "2026-10-07", questionId: question.id, question },
    attempt: result ? { challengeDate: "2026-10-07", questionId: question.id, ...result } : null,
    statistics: { currentStreak: 4, longestStreak: 12, totalChallenges: 18, correctChallenges: 15, accuracy: 83.3 },
    leaderboard: [{ userId: "fixture", username: "ricefarmer", currentStreak: 4, longestStreak: 12, rank: 2 }],
    userLeaderboardEntry: { userId: "fixture", username: "ricefarmer", currentStreak: 4, longestStreak: 12, rank: 2 },
  };
}
export async function submitDailyChallenge(input: { selectedAnswer: string; questionId: string; challengeDate: string }) {
  result = { selectedAnswer: input.selectedAnswer, correct: input.selectedAnswer === "A" };
  return { ...input, ...result, correctAnswer: "A", solution: "Differentiate each term: \\(3x^2-2\\).", saved: true };
}
