export const DEFAULT_REQUEST_TIMEOUT_MS = 12_000;

/** Bound the entire operation, including response-body reads. Never retry writes here. */
export async function withRequestTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  options: { timeoutMs?: number; signal?: AbortSignal; message?: string } = {},
): Promise<T> {
  const controller = new AbortController();
  const parent = options.signal;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cancel: () => void = () => undefined;
  const interrupted = new Promise<never>((_, reject) => {
    cancel = () => {
      const reason = parent?.reason ?? new DOMException("Request cancelled", "AbortError");
      controller.abort(reason);
      reject(reason);
    };
    if (parent?.aborted) { cancel(); return; }
    parent?.addEventListener("abort", cancel, { once: true });
    timer = setTimeout(() => {
      const error = new Error(options.message ?? "The connection is taking too long. Please try again.");
      controller.abort(error);
      reject(error);
    }, options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS);
  });
  try {
    // Defer starting so an already-cancelled caller never sends a request.
    return await Promise.race([
      interrupted,
      Promise.resolve().then(() => {
        controller.signal.throwIfAborted();
        return operation(controller.signal);
      }),
    ]);
  } finally {
    clearTimeout(timer);
    parent?.removeEventListener("abort", cancel);
  }
}
