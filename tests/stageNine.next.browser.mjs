// Real production routes + guest Trainer; provider reads are local stubs.
// Both browser and server fetches are prevented from contacting hosted services.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { muQuestions } from "../data/questions/mu.ts";

const root = resolve(import.meta.dirname, "..");
const probe = createServer();
await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(0, "127.0.0.1", resolve); });
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const origin = `http://localhost:${port}`;
const metrics = [], errors = []; let output = "";
const child = spawn(process.execPath, ["--require", "./tests/browserFixtures/localApiFetch.cjs",
  "node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root, env: { ...process.env, MAO_API_METRICS: "1", MAO_LOCAL_API_FIXTURE: "1",
    NEXT_PUBLIC_SUPABASE_URL: `${origin}/blocked-supabase`, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public", SUPABASE_SECRET_KEY: "fixture-server" },
  stdio: ["ignore", "pipe", "pipe"],
});
child.stdout.on("data", chunk => {
  output += chunk.toString(); let index;
  while ((index = output.indexOf("\n")) >= 0) {
    const line = output.slice(0, index); output = output.slice(index + 1);
    try { const record = JSON.parse(line); if (record.event === "mao_api_metric") metrics.push(record); } catch { /* Startup text. */ }
  }
});
child.stderr.on("data", () => {});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Local production server did not become ready")), 30000);
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Local server exited: ${code}`)); });
    child.stdout.on("data", data => { if (/Ready in/.test(data.toString())) { clearTimeout(timeout); resolve(); } });
  });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.goto(`${origin}/practice/trainer`);
  const questionResponse = page.waitForResponse(response => response.url().includes("/api/practice/trainer/question?"));
  await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
  const delivered = await questionResponse;
  assert.equal(delivered.status(), 200);
  assert.match(delivered.headers()["server-timing"], /^app;dur=[\d.]+/);
  assert.match(delivered.headers()["x-mao-request-id"], /^[0-9a-f-]{36}$/);
  const { question } = await delivered.json();
  assert.deepEqual(question, muQuestions.find(item => item.id === question.id));
  await page.getByRole("button", { name: "Give Up", exact: true }).click();
  await page.getByRole("heading", { name: "Gave Up", exact: true }).waitFor();

  const canary = "DO_NOT_LOG_this_query_or_payload";
  const checks = [
    ["/api/dashboard?owner=invalid", "GET", 400, "dashboard.read"],
    ["/api/dashboard?owner=00000000-0000-4000-8000-000000000001", "GET", 401, "dashboard.read"],
    ["/api/practice/trainer/question?id=invalid", "GET", 400, "trainer.question"],
    ["/api/practice/attempt", "POST", 400, "practice.attempt"],
    ["/api/practice/result", "POST", 400, "practice.result"],
    ["/api/multiplayer/rooms/invalid/lobby", "GET", 400, "multiplayer.lobby.read"],
    ["/api/multiplayer/rooms/invalid/ready", "POST", 400, "multiplayer.ready"],
    ["/api/multiplayer/public-rooms", "GET", 200, "multiplayer.directory"],
  ];
  const expectedIds = [];
  for (const [path, method, status, operation] of checks) {
    const result = await page.evaluate(async ({ path, method, canary }) => {
      const response = await fetch(`${path}${path.includes("?") ? "&" : "?"}secret=${canary}`, {
        method, cache: "no-store", headers: { "Content-Type": "application/json", "X-Mao-Request-Id": canary },
        ...(method === "GET" ? {} : { body: JSON.stringify({ private: canary }) }),
      });
      return { status: response.status, headers: Object.fromEntries(response.headers), body: await response.json() };
    }, { path, method, canary });
    assert.equal(result.status, status, operation);
    assert.match(result.headers["server-timing"], /^app;dur=[\d.]+/);
    assert.equal(result.headers["set-cookie"], undefined);
    if (operation === "multiplayer.directory") {
      assert.equal(result.headers["x-mao-request-id"], undefined);
      assert.deepEqual(result.body, []);
      assert.equal(result.headers["cache-control"], "public, max-age=0, s-maxage=1, must-revalidate");
    } else {
      assert.match(result.headers["x-mao-request-id"], /^[0-9a-f-]{36}$/);
      assert.ok(result.body.error); expectedIds.push([operation, result.headers["x-mao-request-id"], status]);
    }
  }
  // Let the local stdout pipe deliver the completed handlers' log lines.
  const deadline = Date.now() + 3000;
  while (expectedIds.some(([, id]) => !metrics.some(record => record.request_id === id)) && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  for (const [operation, id, status] of expectedIds) {
    const matches = metrics.filter(record => record.request_id === id);
    assert.equal(matches.length, 1, operation); assert.equal(matches[0].operation, operation); assert.equal(matches[0].status, status);
  }
  assert.ok(!JSON.stringify(metrics).includes(canary)); assert.deepEqual(errors, []);
  console.log(`PASS: production timing headers, ${expectedIds.length} correlated error logs, unchanged guest Trainer/content, cacheable stub directory, no reflected request IDs or private payloads. No hosted requests.`);
} finally {
  await browser?.close();
  if (child.exitCode === null) { const exited = once(child, "exit"); child.kill("SIGTERM"); await exited; }
}
