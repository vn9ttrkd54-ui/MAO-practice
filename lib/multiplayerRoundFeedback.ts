import type { MultiplayerPlayer } from "../types/multiplayer";

export function roundFeedbackForQuestion(player: MultiplayerPlayer, questionNumber: number, closed: boolean) {
  return closed && player.roundResult?.questionNumber === questionNumber ? player.roundResult : null;
}

export function formatRoundPoints(points: number) {
  return `${points > 0 ? "+" : ""}${points}`;
}

export function formatAnswerTime(milliseconds: number | null) {
  return milliseconds === null ? "Time expired" : `${(Math.max(0, milliseconds) / 1000).toFixed(1)}s`;
}

export const roundOutcomeLabels = {
  correct: "Correct", incorrect: "Incorrect", "give-up": "Gave up", blank: "Blank",
};
