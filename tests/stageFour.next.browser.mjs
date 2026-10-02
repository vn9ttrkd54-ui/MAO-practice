// Production Next routing, real public catalog endpoint, guest-only sessions.
// The browser cannot leave localhost; server credentials point to a local stub.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { muQuestions } from "../data/questions/mu.ts";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { thetaQuestions } from "../data/questions/theta.ts";

const root = resolve(import.meta.dirname, "..");
const probe = createServer();
await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(0, "127.0.0.1", resolve); });
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root, env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: `${origin}/blocked-supabase`, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public", SUPABASE_SECRET_KEY: "fixture-server" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Local production server did not become ready")), 30000);
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Local server exited: ${code}`)); });
    child.stdout.on("data", data => { if (/Ready in/.test(data.toString())) { clearTimeout(timeout); resolve(); } });
    child.stderr.on("data", () => {});
  });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [], writes = [], deliveries = [], scripts = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (request.url().includes("/api/practice/trainer/question?")) deliveries.push(request.url());
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.route("**/*", route => {
    const request = route.request();
    if (!request.url().startsWith(`${origin}/`)) return route.abort();
    if (!["GET", "HEAD"].includes(request.method())) { writes.push(request.method()); return route.abort(); }
    return route.continue();
  });
  await page.goto(`${origin}/practice/trainer`);
  await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
  assert.equal(deliveries.length, 0, "setup must not fetch full questions");

  for (const [division, catalog] of [["Mu", muQuestions], ["Alpha", alphaQuestions], ["Theta", thetaQuestions]]) {
    await page.getByLabel("Division", { exact: true }).selectOption(division);
    const responsePromise = page.waitForResponse(response => response.url().includes("/api/practice/trainer/question?"));
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    const response = await responsePromise;
    assert.equal(response.status(), 200);
    assert.equal(response.headers()["cache-control"], "no-store");
    const { question } = await response.json();
    assert.deepEqual(question, catalog.find(item => item.id === question.id));
    await page.getByRole("button", { name: "Give Up", exact: true }).waitFor();
    const scriptCount = scripts.length;
    await page.getByRole("button", { name: "Give Up", exact: true }).click();
    await page.getByRole("heading", { name: "Gave Up", exact: true }).waitFor();
    assert.equal(scripts.length, scriptCount, "guest checking must not download the full catalog");
    const nextPromise = page.waitForResponse(response => response.url().includes("/api/practice/trainer/question?"));
    await page.getByRole("button", { name: "Next Question", exact: true }).click();
    const { question: next } = await (await nextPromise).json();
    assert.equal(next.division, division);
    assert.notEqual(next.id, question.id);
    await page.getByRole("button", { name: "Give Up", exact: true }).waitFor();
    await page.getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("heading", { name: "Daily Trainer Summary", exact: true }).waitFor();
    assert.equal(await page.getByRole("link", { name: "Review question", exact: true }).getAttribute("href"), `/practice/question-bank/${question.id}`);
    await page.getByRole("button", { name: "Start New Session", exact: true }).click();
    await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
  }
  assert.equal(deliveries.length, 6, "one public question response per start/next action");
  assert.deepEqual(writes, [], "guest sessions must not write hosted data");
  assert.deepEqual(errors, []);
  console.log("PASS: production Trainer start/give-up/next/summary/new session across Mu, Alpha and Theta; exact catalog delivery; no guest writes or answer-time catalog download.");
} finally {
  await browser?.close();
  if (child.exitCode === null) { const exited = once(child, "exit"); child.kill("SIGTERM"); await exited; }
}
