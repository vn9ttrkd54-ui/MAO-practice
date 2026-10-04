export const FIRST_QUESTION_READY_MS = 5_000;
export const FIRST_QUESTION_PREPARATION_MS = 3_000;
export const QUESTION_PREPARATION_TIMEOUT_MS = 15_000;

export function countdownSeconds(startsAt: number, now: number | null, questionNumber: number) {
  if (!startsAt || now === null) return null;
  const remaining = Math.max(0, Math.ceil((startsAt - now) / 1000));
  // First round: 3s preparation then 5s countdown. Later-round timing is unchanged.
  return remaining > (questionNumber === 1 ? FIRST_QUESTION_READY_MS / 1000 : 5) ? null : remaining;
}

export function questionDisplayDeadline(round: {
  questionStartedAt: number;
  questionEndsAt: number;
  questionDurationSeconds: number;
}) {
  return Math.min(round.questionEndsAt, round.questionStartedAt + round.questionDurationSeconds * 1000);
}

// Anchor to a monotonic clock so changing the computer clock cannot reset a round.
export class MultiplayerClock {
  private anchorTime: number;
  private anchorTick: number;
  private bestDelay = Infinity;

  constructor(wallTime: number, tick: number) {
    this.anchorTime = wallTime;
    this.anchorTick = tick;
  }

  now(tick: number) {
    return this.anchorTime + tick - this.anchorTick;
  }

  synchronize(sentTick: number, receivedTick: number, serverReceivedAt: number, serverSentAt: number) {
    if (![sentTick, receivedTick, serverReceivedAt, serverSentAt].every(Number.isFinite)
      || receivedTick < sentTick || serverSentAt < serverReceivedAt) return false;
    const delay = Math.max(0, receivedTick - sentTick - (serverSentAt - serverReceivedAt));
    if (delay >= this.bestDelay) return false;
    this.bestDelay = delay;
    this.anchorTime = serverSentAt + delay / 2;
    this.anchorTick = receivedTick;
    return true;
  }
}
