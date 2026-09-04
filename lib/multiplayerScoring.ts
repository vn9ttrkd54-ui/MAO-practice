const MAX_MATCH_PLAYERS = 30;
const MIN_CORRECT_POINTS = 1000;
const ORDER_RESERVE = MAX_MATCH_PLAYERS;
const SPEED_POINT_RANGE = 500 - ORDER_RESERVE;

export function calculateMultiplayerCorrectPoints({
  answerTimeMs,
  questionDurationMs,
  earlierCorrectAnswers,
}: {
  answerTimeMs: number;
  questionDurationMs: number;
  earlierCorrectAnswers: number;
}) {
  const duration = Math.max(1, questionDurationMs);
  const elapsed = Math.min(duration, Math.max(0, answerTimeMs));
  const remainingRatio = (duration - elapsed) / duration;
  const speedPoints = MIN_CORRECT_POINTS + ORDER_RESERVE
    + Math.round(SPEED_POINT_RANGE * remainingRatio);
  const orderAdjustment = Math.min(MAX_MATCH_PLAYERS - 1, Math.max(0, earlierCorrectAnswers));

  return Math.max(MIN_CORRECT_POINTS, speedPoints - orderAdjustment);
}
