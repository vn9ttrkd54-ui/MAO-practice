import { withRequestTimeout } from "./requestTimeout";

export type TutorChatMessage = { role: "user" | "assistant"; content: string };
type TutorRequest = {
  questionId: number;
  message: string;
  history: TutorChatMessage[];
  revealToken: string | null;
};

export const TUTOR_MAX_ATTEMPTS = 4;
const ATTEMPT_TIMEOUT_MS = 60_000; // Includes the existing 45-second provider deadline plus server work.
const TOTAL_TIMEOUT_MS = 90_000;
const MAX_WAIT_MS = 15_000;
const UNCERTAIN_MESSAGE = "I couldn't confirm the reply. It may still be processing and may use a request. Your question is saved below; wait a moment before sending again.";
const BUSY_MESSAGE = "The tutor is still busy. Your question is saved below. Please try sending it again in a little while.";

export class TutorRequestError extends Error {
  readonly code: string;
  readonly messagesRemaining?: number;

  constructor(message: string, code: string, messagesRemaining?: number) {
    super(message);
    this.name = "TutorRequestError";
    this.code = code;
    this.messagesRemaining = messagesRemaining;
  }
}

function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid tutor response");
  return value as Record<string, unknown>;
}

function remaining(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 15 ? value : undefined;
}

/** Respect server minimums. Stop instead of retrying early if the requested wait is too long. */
export function tutorRetryDelay(attempt: number, hint: unknown, retryAfter: string | null): number | null {
  const headerSeconds = retryAfter?.trim() && /^\d+(\.\d+)?$/.test(retryAfter.trim()) ? Number(retryAfter) : 0;
  const bodyMs = typeof hint === "number" && Number.isFinite(hint) && hint >= 0 ? hint : 0;
  const serverMs = Math.max(bodyMs, headerSeconds * 1_000);
  if (serverMs > MAX_WAIT_MS) return null;
  const base = Math.max(Math.min(3_000 * 2 ** attempt, 12_000), serverMs);
  return Math.min(MAX_WAIT_MS, Math.ceil(base + Math.random() * base * 0.25));
}

export function waitForTutorRetry(delayMs: number, signal: AbortSignal): Promise<void> {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    function cancel() {
      clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
      reject(signal.reason);
    }
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, delayMs);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

export async function readTutorAllowance(signal: AbortSignal): Promise<number> {
  return withRequestTimeout(async (requestSignal) => {
    try {
      const response = await fetch("/api/tutor", { signal: requestSignal, cache: "no-store" });
      if (response.status === 401) throw new TutorRequestError("Sign in to use the Llama Tutor.", "authentication");
      const data = objectBody(await response.json());
      const count = remaining(data.messagesRemaining);
      if (!response.ok || count === undefined) throw new Error("Invalid allowance");
      return count;
    } catch (error) {
      requestSignal.throwIfAborted();
      if (error instanceof TutorRequestError) throw error;
      throw new Error("Couldn't check your daily limit. Please try again.");
    }
  }, { signal, message: "Checking your daily limit took too long. Please try again." });
}

export async function sendTutorRequest(input: TutorRequest, options: {
  signal: AbortSignal;
  onWaiting: (waiting: boolean) => void;
}): Promise<{ message: string; messagesRemaining: number }> {
  // Freeze one payload for this send. Never automatically replay an ambiguous
  // network/5xx/timeout outcome: each accepted POST can incur a new paid request.
  const body = JSON.stringify({ ...input, history: input.history.slice(-6) });
  try {
    return await withRequestTimeout(async (signal) => {
      for (let attempt = 0; attempt < TUTOR_MAX_ATTEMPTS; attempt++) {
        signal.throwIfAborted();
        options.onWaiting(false);
        const { response, data } = await withRequestTimeout(async (requestSignal) => {
          const response = await fetch("/api/tutor", {
            method: "POST", headers: { "Content-Type": "application/json" }, body, signal: requestSignal,
          });
          return { response, data: objectBody(await response.json()) };
        }, { signal, timeoutMs: ATTEMPT_TIMEOUT_MS });
        signal.throwIfAborted();

        // The route guarantees this explicit denial has not started paid work.
        if (response.status === 429 && data.code === "busy") {
          const delay = tutorRetryDelay(attempt, data.retryAfterMs, response.headers.get("Retry-After"));
          if (attempt === TUTOR_MAX_ATTEMPTS - 1 || delay === null) {
            throw new TutorRequestError(BUSY_MESSAGE, "busy");
          }
          options.onWaiting(true);
          await waitForTutorRetry(delay, signal);
          continue;
        }
        const count = remaining(data.messagesRemaining);
        if (!response.ok) {
          const code = typeof data.code === "string" ? data.code : "unavailable";
          const message = code === "unavailable" || typeof data.error !== "string" ? UNCERTAIN_MESSAGE : data.error;
          throw new TutorRequestError(message, code, count);
        }
        if (typeof data.message !== "string" || !data.message.trim() || count === undefined) {
          throw new Error("Invalid tutor response");
        }
        return { message: data.message, messagesRemaining: count };
      }
      throw new TutorRequestError(BUSY_MESSAGE, "busy");
    }, { signal: options.signal, timeoutMs: TOTAL_TIMEOUT_MS });
  } catch (error) {
    options.signal.throwIfAborted();
    if (error instanceof TutorRequestError) throw error;
    throw new TutorRequestError(UNCERTAIN_MESSAGE, "unavailable");
  }
}
