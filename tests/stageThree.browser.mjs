// Local component regression only: fixture data and mocked reads, no live credentials.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "stage-three-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("stageThree.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("bankRouter.ts"), "next/link": fixture("bankLink.tsx"),
    "@/lib/supabase/client": fixture("bankSupabase.ts"), "@/lib/supabase/browserOwnerHint": fixture("bankSupabase.ts"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }] },
});
const stats = await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(() => resolve(stats))));
assert.ok(!stats.toJson({ modules: true }).modules.some(module => /data\/questions\//.test(module.name)), "listing must not bundle the full catalog");
const bundle = await readFile(join(dir, "client.js"));
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : '<div id="root"></div><script src="/client.js"></script>');
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  async function open(query = "") {
    const page = await browser.newPage();
    const state = { fail: false, stall: false, reads: [], stalled: [], errors: [] };
    page.on("pageerror", error => state.errors.push(error.message));
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.route("**/*", route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname !== "/api/practice/question-bank/state") return route.continue();
      assert.equal(route.request().method(), "GET");
      state.reads.push(url.searchParams);
      if (state.stall) { state.stalled.push(route); return; }
      const id = url.searchParams.get("owner") === "first" ? 10001 : 10002;
      return route.fulfill({ status: state.fail ? 503 : 200, json: state.fail ? { code: "42501" } : { userId: url.searchParams.get("owner"), statuses: { [id]: "solved" }, bookmarkedQuestionIds: [id] } });
    });
    await page.goto(`${origin}/practice/question-bank/mu${query}`);
    await page.getByRole("heading", { name: "Question Bank", exact: true }).waitFor();
    return { page, state };
  }
  {
    const { page, state } = await open();
    await page.getByRole("status").waitFor({ state: "detached" });
    const tiles = page.getByRole("link", { name: /^Question \d+,/ });
    assert.equal(await tiles.count(), 120);
    assert.equal(state.reads.length, 1);
    assert.equal(await tiles.first().getAttribute("data-prefetch"), "off");
    const initial = new URL(await tiles.first().getAttribute("href"), origin);
    assert.equal(initial.searchParams.has("sequence"), false);
    assert.ok(initial.href.length < 180);
    await tiles.first().focus();
    assert.equal(await tiles.first().getAttribute("data-prefetch"), "on");
    await page.getByLabel("Topic", { exact: true }).selectOption("Calculus");
    await page.getByRole("heading", { name: "200 questions", exact: true }).waitFor();
    assert.equal(state.reads.length, 1, "changing metadata filters must not reread private data");
    const filtered = new URL(await tiles.first().getAttribute("href"), origin);
    assert.equal(filtered.searchParams.get("sequence"), "10001-10200");
    await page.getByRole("button", { name: "Show more questions" }).click();
    assert.equal(await tiles.count(), 200);
    assert.match(new URL(await tiles.first().getAttribute("href"), origin).searchParams.get("returnTo"), /shown=200/);
    await page.getByRole("button", { name: "Reset filters" }).click();
    await page.getByRole("heading", { name: "275 questions", exact: true }).waitFor();
    assert.equal(await tiles.count(), 120);
    // A focus/pageshow burst shares one API read, not dozens of concurrent reads.
    await page.clock.runFor(2100);
    await page.evaluate(() => { for (let i = 0; i < 100; i++) { window.dispatchEvent(new Event("focus")); window.dispatchEvent(new Event("pageshow")); } });
    await page.getByRole("status").waitFor({ state: "detached" });
    assert.equal(state.reads.length, 2);
    // Failed refresh retains same-account saved progress/bookmarks.
    state.fail = true;
    await page.clock.runFor(2100);
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await page.getByRole("alert").waitFor();
    await page.getByLabel("Progress", { exact: true }).selectOption("solved");
    await page.getByRole("heading", { name: "1 question", exact: true }).waitFor();
    assert.equal(await tiles.count(), 1);
    assert.match(await tiles.first().getAttribute("aria-label"), /Question 1,/);
    // Switching accounts clears the prior snapshot, including during a failed read.
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("bank-account", { detail: "second" })));
    await page.clock.runFor(1);
    await page.getByRole("heading", { name: "Saved progress needed" }).waitFor();
    await page.getByRole("alert").waitFor();
    assert.equal(await tiles.count(), 0);
    state.fail = false;
    await page.getByRole("button", { name: "Retry progress" }).click();
    await page.getByRole("heading", { name: "1 question", exact: true }).waitFor();
    assert.match(await tiles.first().getAttribute("aria-label"), /Question 2,/);
    await page.getByRole("button", { name: "Unmount bank" }).click();
    const count = state.reads.length;
    await page.clock.runFor(5000);
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    assert.equal(state.reads.length, count);
    assert.deepEqual(state.errors, []);
    await page.close();
  }
  {
    const { page, state } = await open("?shown=240");
    await page.getByRole("status").waitFor({ state: "detached" });
    assert.equal(await page.getByRole("link", { name: /^Question \d+,/ }).count(), 240);
    await page.getByLabel("Method", { exact: true }).selectOption("Direct");
    assert.equal(await page.getByRole("link", { name: /^Question \d+,/ }).count(), 120);
    assert.equal(new URL(page.url()).searchParams.has("shown"), false);
    state.stall = true;
    await page.clock.runFor(2100);
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await page.clock.runFor(12100);
    await page.getByRole("alert").waitFor();
    assert.equal(state.reads.length, 2);
    assert.match(await page.getByRole("alert").innerText(), /Showing your last loaded progress/);
    state.stall = false;
    await page.getByRole("button", { name: "Retry progress" }).click();
    await page.getByRole("alert").waitFor({ state: "detached" });
    assert.equal(state.reads.length, 3);
    for (const route of state.stalled) await route.abort().catch(() => undefined);
    assert.deepEqual(state.errors, []);
    await page.close();
  }
  console.log("PASS: metadata-only listing, 120-tile initial render, compact filter URLs, expanded-list return, intent-only prefetch, local filtering, coalesced reads, timeout/retry, account isolation, and unmount cancellation.");
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
