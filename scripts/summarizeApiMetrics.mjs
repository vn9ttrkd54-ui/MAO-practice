// Offline only: consumes JSONL on stdin, never contacts the app or a log provider.
import { pathToFileURL } from "node:url";
import { StringDecoder } from "node:string_decoder";
import { API_OPERATIONS } from "../lib/apiMetrics.ts";

const phases = ["auth", "data", "service"];
const reasons = ["sample", "slow", "http_error", "exception"];
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const finite = value => typeof value === "number" && Number.isFinite(value) && value >= 0;
const integer = value => Number.isSafeInteger(value) && value >= 0;
const round = value => Math.round(value * 10) / 10;
function validMetric(value) {
  if (!object(value) || value.event !== "mao_api_metric" || value.version !== 1
    || !Object.hasOwn(API_OPERATIONS, value.operation) || value.method !== API_OPERATIONS[value.operation]
    || !finite(value.duration_ms) || value.duration_ms > 86_400_000 || !integer(value.suppressed)
    || !reasons.includes(value.reason) || !object(value.phases)) return false;
  if (value.reason === "exception") { if (value.status !== null) return false; }
  else if (!Number.isInteger(value.status) || value.status < 100 || value.status > 599) return false;
  if (value.reason === "http_error" && value.status < 400) return false;
  if (["sample", "slow"].includes(value.reason) && value.status >= 400) return false;
  if (value.reason === "sample" && value.duration_ms >= 1000) return false;
  if (value.reason === "slow" && value.duration_ms < 1000) return false;
  return Object.entries(value.phases).every(([phase, span]) => phases.includes(phase) && object(span)
    && finite(span.duration_ms) && span.duration_ms <= 86_400_000
    && integer(span.calls) && span.calls > 0 && typeof span.pending === "boolean");
}

export async function summarizeApiMetrics(input) {
  let accepted = 0, ignored = 0, bytes = 0, lineCount = 0, buffer = "";
  const groups = new Map();
  function consume(line) {
    if (++lineCount > 100_000 || line.length > 16_384) throw new Error("Input limit exceeded; use a smaller JSONL export.");
    if (!line.trim()) return;
    let record;
    try {
      record = JSON.parse(line);
      // Supports plain metric lines and exported log entries with a JSON message.
      if (object(record) && typeof record.message === "string") record = JSON.parse(record.message);
    } catch { ignored++; return; }
    if (!validMetric(record)) { ignored++; return; }
    if (++accepted > 50_000) throw new Error("Record limit exceeded; use a smaller JSONL export.");
    const key = `${record.operation}:${record.reason}`;
    const group = groups.get(key) ?? { operation: record.operation, reason: record.reason,
      durations: [], statuses: {}, phases: {}, suppressed: 0 };
    groups.set(key, group);
    group.durations.push(record.duration_ms);
    const status = record.status === null ? "unknown_exception" : String(record.status);
    group.statuses[status] = (group.statuses[status] ?? 0) + 1;
    group.suppressed = Math.min(Number.MAX_SAFE_INTEGER, group.suppressed + record.suppressed);
    for (const phase of phases) {
      const span = record.phases[phase]; if (!span) continue;
      const aggregate = group.phases[phase] ?? { total: 0, records: 0, pending: 0 };
      group.phases[phase] = aggregate;
      aggregate.total += span.duration_ms; aggregate.records++; aggregate.pending += Number(span.pending);
    }
  }
  const decoder = new StringDecoder("utf8");
  for await (const chunk of input) {
    const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += data.length;
    if (bytes > 16 * 1024 * 1024) throw new Error("Input exceeds 16 MiB; use a smaller JSONL export.");
    buffer += decoder.write(data);
    let index;
    while ((index = buffer.indexOf("\n")) >= 0) { consume(buffer.slice(0, index)); buffer = buffer.slice(index + 1); }
    if (buffer.length > 16_384) throw new Error("Log line too large; export metric messages only.");
  }
  buffer += decoder.end(); if (buffer) consume(buffer);
  return {
    coverage: "Sampled and capped origin-handler logs, grouped by selection reason. These are NOT whole-traffic percentiles, browser latency, throughput, error rates or proof of 200-user capacity.",
    accepted, ignored,
    groups: [...groups.values()].sort((a, b) => a.operation.localeCompare(b.operation) || a.reason.localeCompare(b.reason)).map(group => {
      const values = group.durations.sort((a, b) => a - b);
      const percentile = p => values[Math.max(0, Math.ceil(values.length * p) - 1)];
      return { operation: group.operation, selection_reason: group.reason, logged_requests: values.length,
        statuses: group.statuses, logged_p50_ms: percentile(0.5), logged_p95_ms: percentile(0.95), logged_max_ms: values.at(-1),
        phases: Object.fromEntries(Object.entries(group.phases).map(([phase, data]) => [phase, {
          mean_logged_ms: round(data.total / data.records), records: data.records, incomplete_records: data.pending,
        }])),
        // Suppression is global to the emitting process, not attributable to this operation.
        process_suppression_notices: group.suppressed,
      };
    }),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--help")) {
    console.log("Usage: npm run --silent metrics:summary < /absolute/path/to/metric-messages.jsonl\nOffline JSONL summary only. No network requests or load tests.");
  } else {
    try { console.log(JSON.stringify(await summarizeApiMetrics(process.stdin), null, 2)); }
    catch (error) { console.error(error instanceof Error ? error.message : "Unable to summarize metrics."); process.exitCode = 1; }
  }
}
