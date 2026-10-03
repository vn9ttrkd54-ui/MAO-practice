const MAX_MATCH_PLAYERS = 30;
const MIN_CORRECT_POINTS = 1000;
const ORDER_RESERVE = MAX_MATCH_PLAYERS;
const SPEED_POINT_RANGE = 500 - ORDER_RESERVE;

export function calculateMultiplayerCorrectPoints({
  answerTimeMs,
  questionDurationMs,
  earlierCorrectAnswers,
  scoringVersion = 2,
}: {
  answerTimeMs: number;
  questionDurationMs: number;
  earlierCorrectAnswers?: number;
  scoringVersion?: 1 | 2;
}) {
  const duration = Math.max(1, questionDurationMs);
  const elapsed = Math.min(duration, Math.max(0, answerTimeMs));
  const remainingRatio = (duration - elapsed) / duration;
  if (scoringVersion === 2) return MIN_CORRECT_POINTS + Math.round(500 * remainingRatio);
  const speedPoints = MIN_CORRECT_POINTS + ORDER_RESERVE
    + Math.round(SPEED_POINT_RANGE * remainingRatio);
  const orderAdjustment = Math.min(MAX_MATCH_PLAYERS - 1, Math.max(0, earlierCorrectAnswers ?? 0));

  return Math.max(MIN_CORRECT_POINTS, speedPoints - orderAdjustment);
}
