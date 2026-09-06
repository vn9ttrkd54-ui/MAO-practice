import type { MultiplayerAnswerSubmission } from "../types/multiplayer";

export class SubmissionRejectedError extends Error {}

// Serialize once: neither a retry nor a changed selection can alter this answer.
export async function sendMultiplayerAnswer(
  answer: MultiplayerAnswerSubmission,
  options: {
    fetcher?: typeof fetch;
    wait?: (ms: number) => Promise<void>;
    timeoutMs?: number;
  } = {},
): Promise<void> {
  const fetcher = options.fetcher ?? fetch;
  const wait = options.wait ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const body = JSON.stringify({ questionId: answer.questionId, selectedAnswer: answer.selectedAnswer });
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 8_000);
    try {
      const response = await fetcher(`/api/multiplayer/rooms/${answer.roomId}/round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      });
      if (response.status === 204) return;
      if (!response.ok) {
        if (response.status === 408 || response.status === 429 || response.status >= 500) {
          throw new Error("Temporary submission failure.");
        }
        const result = await response.json();
        throw new SubmissionRejectedError(result.error ?? "This answer could not be accepted.");
      }
      const result = await response.json();
      if (result.accepted !== true) throw new Error("Missing submission confirmation.");
      return;
    } catch (error) {
      if (error instanceof SubmissionRejectedError) throw error;
      if (attempt === 3) throw new Error("Answer confirmation unavailable. Your choice is saved; retry to check it.");
    } finally {
      clearTimeout(timer);
    }
    await wait(500 * 2 ** attempt + Math.floor(Math.random() * 250));
  }
}
