// Fixed labels only. Never pass a Request, URL, identity, payload or error here.
export const API_OPERATIONS = {
  "dashboard.read": "GET",
  "practice.attempt": "POST",
  "practice.result": "POST",
  "trainer.question": "GET",
  "multiplayer.directory": "GET",
  "multiplayer.lobby.read": "GET",
  "multiplayer.lobby.presence": "POST",
  "multiplayer.lobby.leave": "DELETE",
  "multiplayer.lobby.settings": "PATCH",
  "multiplayer.round.read": "GET",
  "multiplayer.round.submit": "POST",
  "multiplayer.ready": "POST",
  "multiplayer.delivery": "POST",
  "multiplayer.spectate.read": "GET",
  "multiplayer.spectate.leave": "DELETE",
  "multiplayer.results.ack": "POST",
} as const;

export type ApiOperation = keyof typeof API_OPERATIONS;
type Phase = "auth" | "data" | "service";
export type MeasurePhase = <T>(phase: Phase, work: () => T | PromiseLike<T>) => Promise<T>;
type Span = { duration_ms: number; calls: number; pending: boolean };
const phases: Phase[] = ["auth", "data", "service"];
const duration = (value: number) => Number.isFinite(value) ? Math.round(Math.max(0, value) * 10) / 10 : 0;
const validId = (value: unknown): value is string => typeof value === "string"
  && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export interface ApiMetric {
  event: "mao_api_metric";
  version: 1;
  operation: ApiOperation;
  method: typeof API_OPERATIONS[ApiOperation];
  request_id: string | null;
  status: number | null;
  duration_ms: number;
  phases: Partial<Record<Phase, Span>>;
  reason: "exception" | "http_error" | "slow" | "sample";
  suppressed: number;
}

/** No I/O except the supplied optional log sink. One handler call, no retries. */
export function createApiObserver(options: {
  enabled?: () => boolean;
  emit?: (line: string) => void;
  now?: () => number;
  random?: () => number;
  requestId?: () => string;
} = {}) {
  const now = () => {
    try { const value = (options.now ?? (() => performance.now()))(); return Number.isFinite(value) ? value : 0; }
    catch { return 0; }
  };
  let windowStart = now(), emitted = 0, suppressed = 0;
  return async function observeApi<T extends Response>(operation: ApiOperation, work: (measure: MeasurePhase) => T | PromiseLike<T>): Promise<T> {
    // Defensive at runtime too: an accidental dynamic label must never reach logs.
    if (!Object.hasOwn(API_OPERATIONS, operation)) return await work(async (_phase, task) => await task());
    const started = now();
    const spans = new Map<Phase, { elapsed: number; calls: number; pending: number; starts: number }>();
    let closed = false, requestId: string | null = null;
    try {
      const value = (options.requestId ?? (() => crypto.randomUUID()))();
      if (validId(value)) requestId = value;
    } catch { /* Diagnostics cannot fail a request. */ }
    const measure: MeasurePhase = async (phase, task) => {
      if (closed || !phases.includes(phase)) return await task();
      const start = now();
      const span = spans.get(phase) ?? { elapsed: 0, calls: 0, pending: 0, starts: 0 };
      spans.set(phase, span);
      span.calls++; span.pending++; span.starts += start;
      try { return await task(); }
      finally {
        if (!closed) { span.elapsed += Math.max(0, now() - start); span.pending--; span.starts -= start; }
      }
    };
    function finish(response?: T) {
      closed = true;
      const ended = now(), elapsed = duration(ended - started);
      const snapshot: Partial<Record<Phase, Span>> = {};
      for (const phase of phases) {
        const span = spans.get(phase);
        if (span) snapshot[phase] = { duration_ms: duration(span.elapsed + span.pending * ended - span.starts),
          calls: span.calls, pending: span.pending > 0 };
      }
      if (response) {
        try {
          const metrics = [`app;dur=${elapsed}`, ...phases.flatMap(phase => {
            const span = snapshot[phase];
            return span ? [`${phase};dur=${span.duration_ms}${span.pending ? ';desc="incomplete"' : ""}`] : [];
          })];
          response.headers.append("Server-Timing", metrics.join(", "));
          // Public directory responses can be served to many people by the CDN.
          // Do not imply a cached response ID identifies each viewer's request.
          if (requestId && operation !== "multiplayer.directory") response.headers.set("X-Mao-Request-Id", requestId);
        } catch { /* Preserve immutable responses, cookies, body and status. */ }
      }
      try {
        if (!options.enabled?.() || !options.emit) return;
        const status = response?.status ?? null;
        const reason = status === null ? "exception" : status >= 400 ? "http_error" : elapsed >= 1000 ? "slow" : "sample";
        if (reason === "sample" && (options.random ?? Math.random)() >= 0.01) return;
        if (ended - windowStart >= 60_000 || ended < windowStart) { windowStart = ended; emitted = 0; }
        if (emitted >= 60) { suppressed = Math.min(Number.MAX_SAFE_INTEGER, suppressed + 1); return; }
        emitted++;
        const metric: ApiMetric = { event: "mao_api_metric", version: 1, operation, method: API_OPERATIONS[operation],
          request_id: requestId, status, duration_ms: elapsed, phases: snapshot, reason, suppressed };
        suppressed = 0;
        options.emit(JSON.stringify(metric));
      } catch { /* Logging/sampling failures must not change application outcomes. */ }
    }
    let response: T;
    try { response = await work(measure); }
    catch (error) { finish(); throw error; }
    finish(response);
    return response;
  };
}
