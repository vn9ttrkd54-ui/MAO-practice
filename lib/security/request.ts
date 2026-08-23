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

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T> {
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (!Number.isFinite(declaredSize) || declaredSize > maxBytes) {
    throw new RequestBodyError("Request is too large.", 413);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    throw new RequestBodyError("Request is too large.", 413);
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new RequestBodyError("Invalid request.", 400);
  }
}

export class RequestBodyError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}
