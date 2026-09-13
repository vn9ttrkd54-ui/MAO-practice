import "server-only";

export function isTrustedMutationRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function readJsonBody<T extends object>(request: Request, maxBytes: number): Promise<T> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError("The request body limit must be a nonnegative safe integer.");
  }

  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  const cancelRead = () => {
    // Cancellation must not delay the error response if the sender never settles it.
    if (reader) void reader.cancel().catch(() => {});
  };

  try {
    const lengthHeader = request.headers.get("content-length");
    const declaredSize = lengthHeader === null ? null : Number(lengthHeader);
    if (lengthHeader !== null && (!/^\d+$/.test(lengthHeader) || !Number.isSafeInteger(declaredSize))) {
      throw new RequestBodyError("Invalid request.", 400);
    }
    if (declaredSize !== null && declaredSize > maxBytes) {
      throw new RequestBodyError("Request is too large.", 413);
    }
    if (!request.body || request.bodyUsed || request.signal.aborted) {
      throw new RequestBodyError("Invalid request.", 400);
    }

    reader = request.body.getReader();
    request.signal.addEventListener("abort", cancelRead, { once: true });
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const textChunks: string[] = [];
    let receivedBytes = 0;

    while (true) {
      if (request.signal.aborted) throw new RequestBodyError("Invalid request.", 400);
      const { done, value } = await reader.read();
      if (request.signal.aborted) throw new RequestBodyError("Invalid request.", 400);
      if (done) break;
      if (value.byteLength > maxBytes - receivedBytes) {
        throw new RequestBodyError("Request is too large.", 413);
      }
      receivedBytes += value.byteLength;
      if (declaredSize !== null && receivedBytes > declaredSize) {
        throw new RequestBodyError("Invalid request.", 400);
      }
      const text = decoder.decode(value, { stream: true });
      if (text) textChunks.push(text);
    }

    if (declaredSize !== null && receivedBytes !== declaredSize) {
      throw new RequestBodyError("Invalid request.", 400);
    }
    textChunks.push(decoder.decode());
    const body: unknown = JSON.parse(textChunks.join(""));
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      throw new RequestBodyError("Invalid request.", 400);
    }
    return body as T;
  } catch (error) {
    if (reader) {
      cancelRead();
    } else if (request.body && !request.body.locked) {
      void request.body.cancel().catch(() => {});
    }
    if (error instanceof RequestBodyError) throw error;
    throw new RequestBodyError("Invalid request.", 400);
  } finally {
    request.signal.removeEventListener("abort", cancelRead);
    reader?.releaseLock();
  }
}

export class RequestBodyError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}
