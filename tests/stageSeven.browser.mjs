// Real Trainer UI and save services; all accounts/requests are localhost fixtures.
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
const dir = await mkdtemp(join(tmpdir(), "stage-seven-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("stageSeven.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("trainerRouter.ts"), "next/link": fixture("link.tsx"), "next/image": fixture("image.tsx"),
    "@/lib/supabase/client": fixture("trainerSupabase.ts"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
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
const question = id => ({ id, number: id - 10000, division: "Mu", topic: "Calculus", difficulty: (id - 10001) % 3 + 1,
  methods: [], question: `Fixture question ${id}`, choices: ["One", "Two"], answer: "A", solution: `Fixture solution ${id}` });
const receipt = args => ({ status: "saved", userId: args.p_expected_user_id, sessionId: args.p_session_id, recentSessions: [{
  id: args.p_session_id, endedAt: Date.parse(args.p_ended_at), questionsAnswered: args.p_results.length,
  accuracy: args.p_results.length ? Math.round(100 * args.p_results.filter(r => r.result === "correct").length / args.p_results.length) : 0,
}] });
let browser;
try {
  browser = await chromium.launch({ headless: true });
  async function open(query = "") {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
    page.setDefaultTimeout(15_000);
    const state = { reads: [], saves: [], errors: [], held: [], mode: "hold" };
    page.on("pageerror", error => state.errors.push(error.message));
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.route("**/*", route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname === "/fixture/trainer-read") {
        state.reads.push(url.searchParams.get("table"));
        return route.fulfill({ json: { data: url.searchParams.get("table") === "user_levels" ? { level: 3, progress: 4 } : [], error: null } });
      }
      if (url.pathname === "/api/practice/trainer/question") return route.fulfill({ json: { question: question(Number(url.searchParams.get("id"))) } });
      if (url.pathname === "/api/practice/attempt") return route.fulfill({ json: { attemptId: crypto.randomUUID() } });
      if (url.pathname === "/api/practice/result") {
        const isCorrect = req.postDataJSON().selectedAnswer === "A";
        return route.fulfill({ json: { progress: { attempts: 1, correct: isCorrect ? 1 : 0, times: [2], lastResult: isCorrect ? "correct" : "give-up", lastCorrectAt: null },
          levelChange: { level: 3, progress: 5, leveledUp: false }, isCorrect, tutorRevealToken: null } });
      }
      if (url.pathname === "/fixture/trainer-save") {
        const { name, args } = req.postDataJSON(); assert.equal(name, "save_trainer_session_v1");
        state.saves.push(args);
        const data = receipt(args);
        if (state.mode === "hold") { state.held.push({ route, data }); return; }
        if (state.mode === "error") return route.fulfill({ json: { data: null, error: { message: "fixture unavailable" } } });
        if (state.mode === "busy" || state.mode === "conflict") return route.fulfill({ json: { data: { status: state.mode }, error: null } });
        if (state.mode === "wrong-owner") data.userId = "second";
        if (state.mode === "malformed") data.recentSessions[0].questionsAnswered++;
        return route.fulfill({ json: { data, error: null } });
      }
      return route.continue();
    });
    await page.goto(origin + query);
    await page.getByRole("button", { name: "Start Trainer", exact: true }).waitFor();
    return { page, state };
  }
  async function start(page, answer = true) {
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    await page.getByText("Fixture question 10001", { exact: true }).waitFor();
    if (answer) {
      await page.getByRole("button", { name: "Give Up", exact: true }).click();
      await page.getByRole("heading", { name: "Gave Up", exact: true }).waitFor();
    }
  }
  async function end(page) {
    const sent = page.waitForRequest("**/fixture/trainer-save");
    await page.getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "End Session", exact: true }).evaluate(button => { button.click(); button.click(); });
    await sent;
    await page.getByRole("heading", { name: "Daily Trainer Summary", exact: true }).waitFor();
  }
  async function close(page, state) {
    for (const { route } of state.held) await route.abort().catch(() => undefined);
    assert.deepEqual(state.errors, []);
    await page.close();
  }
  {
    const { page, state } = await open();
    await start(page);
    await end(page);
    assert.equal(state.saves.length, 1, "double end sends one request");
    await page.getByText("Saving your session history…", { exact: true }).waitFor();
    for (const name of ["Start New Session", "Return to Practice"]) assert.equal(await page.getByRole("button", { name, exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole("link", { name: "Review question", exact: true }).count(), 0);
    await page.screenshot({ path: join(dir, "saving-desktop.png"), fullPage: true });
    await page.clock.runFor(12_100);
    await page.getByRole("button", { name: "Retry session save", exact: true }).waitFor();
    await page.getByRole("alert").filter({ hasText: "could not confirm" }).waitFor();
    await page.clock.runFor(60_000);
    assert.equal(state.saves.length, 1, "ambiguous writes never retry automatically");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: join(dir, "retry-mobile.png"), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const retry = page.waitForRequest("**/fixture/trainer-save");
    await page.getByRole("button", { name: "Retry session save", exact: true }).evaluate(button => { button.click(); button.click(); });
    await retry;
    assert.equal(state.saves.length, 2);
    assert.deepEqual(state.saves[0], state.saves[1], "retry freezes UUID, time, levels and results");
    // A response to the cancelled first save must not confirm the current retry.
    await state.held[0].route.fulfill({ json: { data: state.held[0].data, error: null } }).catch(() => undefined);
    await page.getByText("Saving your session history…", { exact: true }).waitFor();
    await state.held[1].route.fulfill({ json: { data: state.held[1].data, error: null } });
    await page.getByText("Session history saved.", { exact: true }).waitFor();
    assert.deepEqual(state.reads.sort(), ["question_progress", "user_levels"], "finishing never downloads lifetime history");
    assert.equal(await page.getByRole("link", { name: "Review question", exact: true }).getAttribute("href"), "/practice/question-bank/10001");
    await page.screenshot({ path: join(dir, "saved-mobile.png"), fullPage: true });
    await page.getByRole("button", { name: "Start New Session", exact: true }).click();
    await start(page, false);
    state.mode = "saved";
    await end(page);
    await page.getByText("Session history saved.", { exact: true }).waitFor();
    assert.notEqual(state.saves[0].p_session_id, state.saves[2].p_session_id);
    assert.equal(state.saves[2].p_results.length, 0, "empty sessions still receive confirmation");
    await close(page, state);
  }
  for (const mode of ["error", "busy", "conflict", "wrong-owner", "malformed"]) {
    const { page, state } = await open(); state.mode = mode;
    await start(page);
    await end(page);
    await page.getByRole("button", { name: "Retry session save", exact: true }).waitFor();
    assert.equal(await page.getByText("Session history saved.", { exact: true }).count(), 0);
    await page.clock.runFor(30_000);
    assert.equal(state.saves.length, 1);
    state.mode = "saved";
    await page.getByRole("button", { name: "Retry session save", exact: true }).click();
    await page.getByText("Session history saved.", { exact: true }).waitFor();
    assert.deepEqual(state.saves[0], state.saves[1]);
    await close(page, state);
  }
  for (const action of ["account", "unmount", "same-owner"]) {
    const { page, state } = await open();
    await start(page);
    await end(page);
    if (action === "unmount") await page.getByRole("button", { name: "Unmount Trainer", exact: true }).click();
    else await page.evaluate(owner => window.dispatchEvent(new CustomEvent("trainer-account", { detail: owner })), action === "account" ? "second" : "first");
    await state.held[0].route.fulfill({ json: { data: state.held[0].data, error: null } }).catch(() => undefined);
    if (action === "same-owner") await page.getByText("Session history saved.", { exact: true }).waitFor();
    else {
      await page.getByText(action === "account" ? "Your account changed" : "Unmounted", { exact: true }).waitFor();
      assert.equal(await page.getByText("Session history saved.", { exact: true }).count(), 0);
    }
    assert.equal(state.saves.length, 1);
    await close(page, state);
  }
  {
    const { page, state } = await open("?single"); state.mode = "saved";
    await start(page);
    await page.getByRole("button", { name: "Next Question", exact: true }).click();
    await page.getByText("Session history saved.", { exact: true }).waitFor();
    assert.equal(state.saves.length, 1, "running out of eligible questions uses the same atomic finalization");
    assert.equal(state.saves[0].p_results.length, 1);
    await close(page, state);
  }
  console.log(`PASS: single-flight finalization, frozen timeout retries, malformed/error/busy/conflict recovery, account and unmount isolation, empty sessions, automatic end, no history reads, mobile width. Screenshots: ${dir}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
