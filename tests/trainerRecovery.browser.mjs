// Real Trainer, recovery, attempt and session-save code. Synthetic localhost only.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "trainer-recovery-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("trainerRecovery.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("trainerRouter.ts"), "next/link": fixture("link.tsx"), "next/image": fixture("image.tsx"),
    "@/lib/supabase/client": fixture("trainerSupabase.ts"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }, { test: /\.png$/, type: "asset/inline" }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
const key = "mao.trainer.active.v1";
const question = id => ({ id, number: id - 10000, division: "Mu", topic: "Calculus", difficulty: (id - 10001) % 5 + 1,
  methods: [], question: `Fixture question ${id}`, choices: ["One", "Two"], answer: "A", solution: `Fixture solution ${id}` });
const savedSession = args => ({ status: "saved", userId: args.p_expected_user_id, sessionId: args.p_session_id, recentSessions: [{
  id: args.p_session_id, endedAt: Date.parse(args.p_ended_at), questionsAnswered: args.p_results.length,
  accuracy: args.p_results.length ? Math.round(100 * args.p_results.filter(r => r.result === "correct").length / args.p_results.length) : 0,
}] });
let browser;
try {
  browser = await chromium.launch({ headless: true });
  async function open(query = "", blockedStorage = false) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    const state = { attempts: [], results: [], saves: [], questions: [], reads: [], errors: [], held: [],
      starts: new Map(), commits: new Map(), holdAttempt: false, holdResult: false, holdSession: false, failQuestion: false };
    page.on("pageerror", error => state.errors.push(error.message));
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.addInitScript(blocked => {
      Math.random = () => 0;
      if (blocked) Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
    }, blockedStorage);
    await page.route("**/*", route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname === "/fixture/trainer-read") {
        state.reads.push(url.searchParams.get("table"));
        return route.fulfill({ json: {
          data: url.searchParams.get("table") === "user_levels" ? { level: 3, progress: 4 } : [], error: null,
        } });
      }
      if (url.pathname === "/api/practice/trainer/question") {
        state.questions.push(Number(url.searchParams.get("id")));
        return state.failQuestion ? route.fulfill({ status: 503, json: {} }) : route.fulfill({ json: { question: question(state.questions.at(-1)) } });
      }
      if (url.pathname === "/api/practice/attempt") {
        const body = req.postDataJSON(); state.attempts.push(body);
        if (!state.starts.has(body.requestId)) state.starts.set(body.requestId, crypto.randomUUID());
        const json = { attemptId: state.starts.get(body.requestId) };
        if (state.holdAttempt) { state.held.push({ route, json }); return; }
        return route.fulfill({ json });
      }
      if (url.pathname === "/api/practice/result") {
        const body = req.postDataJSON(); state.results.push(body);
        if (!state.commits.has(body.attemptId)) {
          const correct = body.selectedAnswer === "A";
          state.commits.set(body.attemptId, { body, json: {
            progress: { attempts: 1, correct: correct ? 1 : 0, times: [body.elapsedSeconds], lastResult: correct ? "correct" : "give-up", lastCorrectAt: null },
            levelChange: { level: 3, progress: 4 + state.commits.size + 1, leveledUp: false }, isCorrect: correct, tutorRevealToken: null,
          } });
        }
        const saved = state.commits.get(body.attemptId);
        assert.deepEqual(body, saved.body, "a retry must preserve attempt, answer and time");
        if (state.holdResult) { state.held.push({ route, json: saved.json }); return; }
        return route.fulfill({ json: saved.json });
      }
      if (url.pathname === "/fixture/trainer-save") {
        const { args } = req.postDataJSON(); state.saves.push(args);
        const json = { data: savedSession(args), error: null };
        if (state.holdSession) { state.held.push({ route, json }); return; }
        return route.fulfill({ json });
      }
      return route.continue();
    });
    await page.goto(origin + query);
    await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    return { page, state };
  }
  const draft = page => page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), key);
  async function start(page) {
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    await page.getByText("Fixture question 10001", { exact: true }).waitFor();
  }
  async function reload(page, id = 10001) {
    await page.reload();
    await page.getByText(`Fixture question ${id}`, { exact: true }).waitFor();
  }
  async function answer(page) {
    await page.getByRole("button", { name: "A One", exact: true }).click();
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await page.getByRole("heading", { name: "Correct!", exact: true }).waitFor();
  }
  async function end(page) {
    await page.getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("heading", { name: "Daily Trainer Summary", exact: true }).waitFor();
  }
  async function close(page, state) {
    for (const { route } of state.held) await route.abort().catch(() => undefined);
    assert.deepEqual(state.errors, []);
    await page.context().close();
  }
  for (const guest of [false, true]) for (const difficulty of [1, 2, 3, 4, 5]) {
    const { page, state } = await open(guest ? "?guest" : "");
    const selector = page.getByLabel("Starting difficulty", { exact: true });
    assert.equal(await selector.inputValue(), "auto");
    await selector.selectOption(String(difficulty));
    if (difficulty === 5 && !guest) {
      await page.screenshot({ path: join(dir, "setup-desktop.png"), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: join(dir, "setup-mobile.png"), fullPage: true });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    const id = 10000 + difficulty;
    await page.getByText(`Fixture question ${id}`, { exact: true }).waitFor();
    const before = await draft(page);
    assert.equal(before.adaptiveState.difficulty, difficulty);
    assert.deepEqual(before.startingLevelProgress, guest ? { level: 1, progress: 0 } : { level: 3, progress: 4 });
    assert.equal(state.questions.length, 1, "starting difficulty adds no question fetches");
    assert.deepEqual(state.reads.sort(), guest ? [] : ["question_progress", "user_levels"]);
    await reload(page, id);
    assert.deepEqual(await draft(page), before, "chosen difficulty survives active-session recovery");
    await answer(page);
    assert.equal((await draft(page)).adaptiveState.difficulty, difficulty);
    await page.getByRole("button", { name: "Next Question", exact: true }).click();
    await page.getByText(`Fixture question ${id + 5}`, { exact: true }).waitFor();
    assert.equal((await draft(page)).adaptiveState.difficulty, difficulty);
    await close(page, state);
  }
  {
    const { page, state } = await open();
    await start(page);
    await page.clock.runFor(5000);
    await page.getByRole("button", { name: "B Two", exact: true }).click();
    const before = await draft(page);
    await reload(page);
    assert.deepEqual(await draft(page), before, "question, answer, session identity and timing survive refresh");
    const otherTab = await page.context().newPage();
    await otherTab.goto(origin);
    await otherTab.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    assert.equal(await draft(otherTab), null, "another tab cannot overwrite this tab's session");
    await otherTab.close();
    await page.getByLabel("Question time 0:05", { exact: true }).waitFor();
    await page.getByLabel("Session time 0:05", { exact: true }).waitFor();
    assert.equal(state.starts.size, 1, "refresh alone does not create an attempt");
    await answer(page);
    const answered = await draft(page);
    await reload(page);
    await page.getByRole("heading", { name: "Correct!", exact: true }).waitFor();
    assert.deepEqual(await draft(page), answered);
    assert.equal(state.commits.size, 1);
    await page.getByRole("button", { name: "Next Question", exact: true }).click();
    const next = await page.getByText(/Fixture question 1000[2-9]/).textContent();
    const nextId = Number(next.match(/\d+/)[0]);
    const nextDraft = await draft(page);
    assert.notEqual(nextDraft.requestId, before.requestId);
    await reload(page, nextId);
    assert.deepEqual(await draft(page), nextDraft);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: join(dir, "resumed-mobile.png"), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await end(page);
    await page.getByText("Session history saved.", { exact: true }).waitFor();
    assert.equal(state.saves[0].p_session_id, before.id);
    assert.equal(state.saves[0].p_results.length, 1);
    assert.equal(await draft(page), null, "only confirmed completion clears the draft");
    await page.reload();
    await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    assert.equal(state.saves.length, 1);
    await close(page, state);
  }
  for (const mode of ["holdAttempt", "holdResult"]) {
    const { page, state } = await open(); state[mode] = true;
    await start(page);
    await page.clock.runFor(2000);
    await page.getByRole("button", { name: "Give Up", exact: true }).click();
    const before = await draft(page);
    await reload(page);
    await page.getByRole("button", { name: "Retry save", exact: true }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Give Up", exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole("heading", { name: "Solution", exact: true }).count(), 0);
    state[mode] = false;
    await page.getByRole("button", { name: "Retry save", exact: true }).click();
    await page.getByRole("heading", { name: "Gave Up", exact: true }).waitFor();
    assert.equal(state.starts.size, 1);
    assert.equal(state.commits.size, 1);
    assert.equal((await draft(page)).requestId, before.requestId);
    assert.equal((await draft(page)).results.length, 1);
    for (const { route, json } of state.held) await route.fulfill({ json }).catch(() => undefined);
    await close(page, state);
  }
  {
    const { page, state } = await open();
    await start(page); await answer(page);
    state.holdSession = true;
    await end(page);
    await page.getByText("Saving your session history…", { exact: true }).waitFor();
    await page.reload();
    await page.getByRole("button", { name: "Retry session save", exact: true }).waitFor();
    assert.equal(state.saves.length, 1, "no automatic write on recovery");
    assert.equal(await page.getByRole("button", { name: "Start New Session", exact: true }).isDisabled(), true);
    state.holdSession = false;
    await page.getByRole("button", { name: "Retry session save", exact: true }).click();
    await page.getByText("Session history saved.", { exact: true }).waitFor();
    assert.deepEqual(state.saves[0], state.saves[1]);
    assert.equal(await draft(page), null);
    await close(page, state);
  }
  {
    const { page, state } = await open();
    await start(page);
    const before = await draft(page);
    state.failQuestion = true;
    await page.reload();
    await page.getByRole("button", { name: "Retry session recovery", exact: true }).waitFor();
    assert.deepEqual(await draft(page), before, "failed recovery keeps the draft");
    assert.equal(await page.getByRole("button", { name: "Start Trainer", exact: true }).count(), 0);
    state.failQuestion = false;
    await page.getByRole("button", { name: "Retry session recovery", exact: true }).click();
    await page.getByText("Fixture question 10001", { exact: true }).waitFor();
    assert.deepEqual(await draft(page), before);
    await close(page, state);
  }
  for (const change of ["?second", "?guest", "event", "corrupt", "expired"]) {
    const { page, state } = await open();
    await start(page);
    if (change === "event") {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("trainer-account", { detail: "second" })));
      await page.getByRole("heading", { name: "Your account changed", exact: true }).waitFor();
    } else if (change.startsWith("?")) {
      await page.goto(origin + change);
      await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    } else {
      await page.evaluate(({ key, change }) => {
        const d = JSON.parse(sessionStorage.getItem(key));
        if (change === "expired") d.sessionStartedAt = Date.now() - 86400000;
        sessionStorage.setItem(key, change === "corrupt" ? "{broken" : JSON.stringify(d));
      }, { key, change });
      await page.reload();
      await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    }
    assert.equal(await draft(page), null);
    assert.equal(state.results.length, 0);
    assert.equal(state.saves.length, 0);
    await close(page, state);
  }
  {
    const { page, state } = await open("?guest");
    await start(page); await answer(page);
    await reload(page);
    await page.getByRole("heading", { name: "Correct!", exact: true }).waitFor();
    assert.equal((await draft(page)).levelProgress.progress, 1);
    await page.getByRole("button", { name: "Next Question", exact: true }).click();
    await page.getByText(/Fixture question 1000[2-9]/).waitFor();
    await answer(page);
    assert.equal((await draft(page)).levelProgress.progress, 2, "guest level does not reset after recovery");
    assert.deepEqual([state.attempts, state.results, state.saves], [[], [], []]);
    await end(page);
    await page.getByText("Session kept for this visit. Sign in before your next session to save history to an account.", { exact: true }).waitFor();
    assert.equal(await draft(page), null);
    await close(page, state);
  }
  {
    const { page, state } = await open("", true);
    await page.getByRole("alert").filter({ hasText: "blocking session recovery" }).waitFor();
    await start(page); await answer(page); await end(page);
    await page.getByText("Session history saved.", { exact: true }).waitFor();
    await close(page, state);
  }
  console.log(`PASS: Starting difficulties 1-5 for accounts/guests without extra reads, unchanged earned levels, adaptive continuation and refresh recovery; Strict Mode recovery for active/answered/pending/finalizing sessions, identical retries without duplicate scoring, timer and answer retention, recovery retry, account/guest isolation, corrupted/expired drafts, guest levels, blocked storage, completed cleanup and mobile width. Screenshots: ${dir}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
