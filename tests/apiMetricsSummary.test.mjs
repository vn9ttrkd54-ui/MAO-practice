import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";
import { summarizeApiMetrics } from "../scripts/summarizeApiMetrics.mjs";

const metric = overrides => ({ event: "mao_api_metric", version: 1, operation: "dashboard.read", method: "GET",
  request_id: "private-id-not-in-report", status: 200, duration_ms: 10, phases: {}, reason: "sample", suppressed: 0, ...overrides });
const read = lines => summarizeApiMetrics(Readable.from(lines.map(line => `${typeof line === "string" ? line : JSON.stringify(line)}\n`)));
test("offline report separates biased selection groups and never prints identities or raw logs", async () => {
  const result = await read([
    ...[10, 20, 30, 40].map(duration_ms => metric({ duration_ms })),
    { message: JSON.stringify(metric({ duration_ms: 1200, reason: "slow", phases: { auth: { calls: 1, pending: false, duration_ms: 1100 } } })) },
    metric({ status: 503, reason: "http_error", duration_ms: 12000, phases: { data: { calls: 1, pending: true, duration_ms: 11900 } }, suppressed: 9 }),
    metric({ status: null, reason: "exception", duration_ms: 100 }),
    'private unrelated message: token=secret', { message: 'private malformed JSON' },
  ]);
  assert.equal(result.accepted, 7); assert.equal(result.ignored, 2);
  assert.equal(result.groups.length, 4); assert.match(result.coverage, /NOT whole-traffic/);
  const sample = result.groups.find(group => group.selection_reason === "sample");
  assert.equal(sample.logged_requests, 4); assert.equal(sample.logged_p50_ms, 20); assert.equal(sample.logged_p95_ms, 40);
  const failed = result.groups.find(group => group.selection_reason === "http_error");
  assert.deepEqual(failed.statuses, { 503: 1 }); assert.equal(failed.phases.data.incomplete_records, 1);
  assert.equal(failed.process_suppression_notices, 9);
  assert.ok(!JSON.stringify(result).includes("private")); assert.ok(!JSON.stringify(result).includes("secret"));
});
test("unknown labels, invalid fields and inconsistent reasons cannot enter an aggregate", async () => {
  const invalid = [
    { operation: "/api/user/private" }, { operation: "constructor" }, { method: "SECRET" }, { version: 2 },
    { duration_ms: -1 }, { duration_ms: "1" }, { duration_ms: 1e100 }, { reason: "secret" }, { suppressed: -1 },
    { status: null }, { status: 700 }, { reason: "slow", duration_ms: 5 }, { status: 500 },
    { reason: "http_error", status: 200 }, { reason: "exception", status: 500 },
    { phases: { secret: { duration_ms: 1, calls: 1, pending: false } } },
    { phases: { auth: { duration_ms: 1, calls: 0, pending: false } } },
    { phases: { auth: { duration_ms: 1, calls: 1, pending: "true" } } },
    { phases: null },
  ];
  const result = await read(invalid.map(overrides => metric(overrides)));
  assert.equal(result.accepted, 0); assert.equal(result.ignored, invalid.length); assert.deepEqual(result.groups, []);
});
test("stream parsing handles chunk boundaries and enforces input, line and record limits", async () => {
  const line = JSON.stringify(metric());
  const chunks = [line.slice(0, 5), line.slice(5, 40), line.slice(40)];
  assert.equal((await summarizeApiMetrics(Readable.from(chunks))).accepted, 1);
  await assert.rejects(summarizeApiMetrics(Readable.from(["x".repeat(16385)])), /line too large/);
  await assert.rejects(summarizeApiMetrics(Readable.from([Buffer.alloc(16 * 1024 * 1024 + 1)])), /16 MiB/);
  async function* manyRecords() { for (let i = 0; i < 50_001; i++) yield `${line}\n`; }
  await assert.rejects(summarizeApiMetrics(manyRecords()), /Record limit/);
  async function* manyLines() { for (let i = 0; i < 100_001; i++) yield "\n"; }
  await assert.rejects(summarizeApiMetrics(manyLines()), /Input limit/);
});
