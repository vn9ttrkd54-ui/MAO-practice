// Real Trainer components/services, mocked local data. No live account or writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";

const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "stage-four-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("stageFour.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("trainerRouter.ts"), "next/link": fixture("link.tsx"), "next/image": fixture("image.tsx"),
    "@/lib/supabase/client": fixture("trainerSupabase.ts"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }, { test: /\.png$/i, type: "asset/inline" }] },
});
const stats = await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(() => resolve(stats))));
const initialIds = new Set(stats.toJson({ chunks: true }).chunks.filter(chunk => chunk.initial).map(chunk => chunk.id));
assert.ok(!stats.toJson({ modules: true }).modules.some(module => /data\/questions\//.test(module.name) && module.chunks.some(id => initialIds.has(id))), "initial Trainer graph must not contain the catalog");
const bundle = await readFile(join(dir, "client.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
const question = (id, math) => ({ id, number: id - 10000, division: "Mu", topic: id < 10007 ? "Calculus" : "Geometry", difficulty: (id - 10001) % 3 + 1,
  methods: [], question: `Fixture question ${id}` + (math ? String.raw` \(x_{${id}} + 1\)` : ""),
  choices: ["One", math ? String.raw`Two \(2\)` : "Two"], answer: "A",
  solution: `Fixture solution ${id}` + (math ? String.raw` \(x_{${id}} = 0\)` : "") });
let browser;
try {
  browser = await chromium.launch({ headless: true });
  async function open({ math = false } = {}) {
    const page = await browser.newPage();
    const state = { reads: [], deliveries: [], attempts: [], saves: [], errors: [], scripts: [], stall: null, held: [], failSave: false };
    page.on("pageerror", error => state.errors.push(error.message));
    page.on("request", request => { if (request.resourceType() === "script") state.scripts.push(request.url()); });
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.route("**/*", route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname === "/fixture/trainer-read") {
        state.reads.push(url.searchParams.get("table"));
        if (state.stall === "progress") { state.held.push(route); return; }
        return route.fulfill({ json: { data: url.searchParams.get("table") === "user_levels" ? { level: 3, progress: 4 } : [], error: null } });
      }
      if (url.pathname === "/api/practice/trainer/question") {
        const id = Number(url.searchParams.get("id")); state.deliveries.push(id);
        if (state.stall === "question") { state.held.push(route); return; }
        return route.fulfill({ json: { question: question(id, math) } });
      }
      if (url.pathname === "/api/practice/attempt") {
        const body = req.postDataJSON(); state.attempts.push(body);
        return route.fulfill({ json: { attemptId: crypto.randomUUID() } });
      }
      if (url.pathname === "/api/practice/result") {
        const body = req.postDataJSON(); state.saves.push(body);
        if (state.failSave) return route.fulfill({ status: 503, json: { error: "Fixture interrupted save. Please retry." } });
        return route.fulfill({ json: { progress: { attempts: 1, correct: 1, times: [2], lastResult: "correct", lastCorrectAt: Date.now() },
          levelChange: { level: 3, progress: 5, leveledUp: false }, isCorrect: true, tutorRevealToken: null } });
      }
      return route.continue();
    });
    await page.goto(origin);
    await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    return { page, state };
  }
  async function close(page, state) {
    for (const route of state.held) await route.abort().catch(() => undefined);
    assert.deepEqual(state.errors, []);
    await page.close();
  }
  {
    const { page, state } = await open();
    assert.deepEqual(state.reads, [], "setup must not read progress/level");
    state.stall = "progress";
    await page.getByRole("button", { name: "Start Trainer", exact: true }).evaluate(button => { button.click(); button.click(); });
    await expect(page.getByRole("button", { name: "Loading Trainer...", exact: true })).toBeDisabled();
    const divisions = page.getByRole("group", { name: "Division", exact: true }).getByRole("radio");
    await expect(divisions).toHaveCount(3);
    for (const radio of await divisions.all()) await expect(radio).toBeDisabled();
    await expect(page.getByLabel("Starting difficulty", { exact: true })).toBeDisabled();
    await page.waitForFunction(() => document.querySelector("button[aria-busy=true]") !== null);
    await page.clock.runFor(12_100);
    await page.getByRole("alert").filter({ hasText: "took too long" }).waitFor();
    assert.equal(state.reads.length, 2, "double start shares one progress read and one level read");
    state.stall = null;
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    await page.getByText("Fixture question 10001", { exact: true }).waitFor();
    assert.equal(state.reads.length, 4);
    await page.getByRole("button", { name: "A One", exact: true }).click();
    await page.clock.runFor(2_000);
    state.failSave = true;
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await page.getByRole("button", { name: "Retry save", exact: true }).waitFor();
    assert.equal(await page.getByRole("heading", { name: "Solution", exact: true }).count(), 0);
    assert.equal(await page.getByRole("button", { name: "Next Question", exact: true }).count(), 0);
    state.failSave = false;
    await page.getByRole("button", { name: "Retry save", exact: true }).click();
    await page.getByRole("heading", { name: "Correct!", exact: true }).waitFor();
    assert.deepEqual(state.saves[0], state.saves[1], "retry preserves original answer, elapsed time and attempt ID");
    state.stall = "question";
    await page.getByRole("button", { name: "Next Question", exact: true }).evaluate(button => { button.click(); button.click(); });
    await page.getByRole("button", { name: "Loading question…" }).waitFor();
    await page.clock.runFor(12_100);
    await page.getByRole("alert").filter({ hasText: "took too long" }).waitFor();
    assert.equal(state.reads.length, 5, "next adds one progress read and no level read");
    await page.getByText("Fixture question 10001", { exact: true }).waitFor();
    await page.getByText("Fixture solution 10001", { exact: true }).waitFor();
    state.stall = null;
    await page.getByRole("button", { name: "Next Question", exact: true }).click();
    await page.getByText("Fixture question 10004", { exact: true }).waitFor();
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("trainer-account", { detail: "second" })));
    await page.getByRole("heading", { name: "Your account changed" }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Give Up", exact: true }).count(), 0);
    assert.equal(await page.getByText("Fixture question 10004", { exact: true }).count(), 0);
    await close(page, state);
  }
  {
    const { page, state } = await open();
    state.stall = "question";
    const delivery = page.waitForRequest("**/api/practice/trainer/question*");
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    await delivery;
    await page.getByRole("button", { name: "Unmount Trainer", exact: true }).click();
    await page.getByText("Unmounted", { exact: true }).waitFor();
    await page.clock.runFor(20_000);
    assert.equal(state.attempts.length, 0, "late question delivery must not prepare an attempt after unmount");
    await close(page, state);
  }
  {
    const { page, state } = await open();
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("trainer-account", { detail: null })));
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    await page.getByText("Fixture question 10001", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Give Up", exact: true }).click();
    await page.getByRole("heading", { name: "Gave Up", exact: true }).waitFor();
    await page.getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("heading", { name: "Daily Trainer Summary", exact: true }).waitFor();
    assert.ok(await page.getByText("Calculus", { exact: true }).count() > 0);
    assert.equal(await page.getByRole("link", { name: "Review question", exact: true }).getAttribute("href"), "/practice/question-bank/10001");
    assert.deepEqual(state.reads, []);
    assert.deepEqual(state.saves, []);
    assert.deepEqual(state.attempts, []);
    assert.equal(state.scripts.length, 1, "guest save/summary must not lazy-load the full catalog");
    await page.getByRole("button", { name: "Start New Session", exact: true }).click();
    await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    await close(page, state);
  }
  {
    const { page, state } = await open({ math: true });
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    const formulas = page.locator(".katex-mathml annotation");
    await expect(formulas).toHaveText(["x_{10001} + 1", "2"]);
    await expect.poll(() => state.attempts.length).toBe(1);
    const renders = () => page.evaluate(() => window.__trainerMathRenders.length);
    const initialRenders = await renders();
    assert.ok(initialRenders >= 2, "the real math renderer must be exercised");
    const reads = [...state.reads];
    const draft = await page.evaluate(() => sessionStorage.getItem("mao.trainer.active.v1"));
    assert.ok(draft);

    await page.clock.runFor(5_000);
    await expect(page.getByLabel("Question time 0:05", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Session time 0:05", { exact: true })).toBeVisible();
    assert.equal(await renders(), initialRenders, "clock ticks must not re-render unchanged math");
    assert.deepEqual(state.reads, reads, "clock ticks must not fetch progress or level");
    assert.deepEqual(state.deliveries, [10001]);
    assert.equal(state.attempts.length, 1);
    assert.deepEqual(state.saves, []);
    assert.equal(await page.evaluate(() => sessionStorage.getItem("mao.trainer.active.v1")), draft, "clock ticks must not rewrite the recovery draft");

    await page.getByRole("button", { name: "A One", exact: true }).click();
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await page.getByRole("heading", { name: "Correct!", exact: true }).waitFor();
    await expect(formulas).toHaveText(["x_{10001} + 1", "2", "x_{10001} = 0"]);
    assert.equal(state.saves[0].elapsedSeconds, 5);
    const answeredRenders = await renders();
    assert.ok(answeredRenders > initialRenders, "answering must still render the solution");
    await page.clock.runFor(3_000);
    await expect(page.getByLabel("Question time 0:05", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Session time 0:08", { exact: true })).toBeVisible();
    assert.equal(await renders(), answeredRenders, "the frozen question and solution must not re-render on session ticks");

    await page.getByRole("button", { name: "Next Question", exact: true }).click();
    await expect(formulas).toHaveText(["x_{10004} + 1", "2"]);
    await expect(page.getByLabel("Question time 0:00", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Session time 0:08", { exact: true })).toBeVisible();
    const nextRenders = await renders();
    assert.ok(nextRenders > answeredRenders, "changing questions must render the new math");
    await page.clock.runFor(2_000);
    await expect(page.getByLabel("Question time 0:02", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Session time 0:10", { exact: true })).toBeVisible();
    assert.equal(await renders(), nextRenders);
    await page.getByRole("button", { name: "Unmount Trainer", exact: true }).click();
    await page.clock.runFor(5_000);
    assert.equal(await page.getByLabel("Trainer statistics", { exact: true }).count(), 0);
    assert.equal(await renders(), nextRenders);
    await close(page, state);
  }
  console.log("PASS: Trainer batching, no setup reads, single-flight start/next, deadlines/retry, original save identity, current-question retention, account isolation, unmount, guest summary without catalog loading, and isolated timer ticks without repeated math work.");
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
