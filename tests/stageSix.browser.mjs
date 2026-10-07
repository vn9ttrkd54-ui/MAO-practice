// Real dashboard UI and transport; localhost-only API/auth fixtures, no live data.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
import { dashboardFixture, dashboardOwner } from "./browserFixtures/dashboardData.ts";

const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "stage-six-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("stageSix.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/link": fixture("link.tsx"), "next/image": fixture("image.tsx"), "@/lib/supabase/client": fixture("dashboardSupabase.ts"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => {
  if (error || stats.hasErrors()) { reject(error ?? new Error(stats.toString())); return; }
  const modules = [...stats.compilation.modules].map(module => module.resource ?? "");
  assert.ok(!modules.some(path => path.includes("/data/questions/")), "Question content must not enter the dashboard client bundle");
  compiler.close(resolve);
}));
const bundle = await readFile(join(dir, "client.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  async function open(mode = "success", options = {}) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const state = { mode, reads: 0, errors: [], held: [] };
    page.on("pageerror", error => state.errors.push(error.message));
    await page.clock.install(); await page.clock.pauseAt(new Date());
    await page.route("**/*", route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname !== "/api/dashboard") return route.continue();
      state.reads++;
      assert.equal(url.searchParams.get("owner"), dashboardOwner); assert.equal(request.method(), "GET");
      if (state.mode === "hold") { state.held.push(route); return; }
      if (state.mode === "fail") return route.fulfill({ status: 503, json: { error: "Unavailable" } });
      if (state.mode === "wrong-owner") return route.fulfill({ json: dashboardFixture("other") });
      if (state.mode === "malformed") return route.fulfill({ json: {} });
      const data = dashboardFixture();
      if (options.rank) data.multiplayer.rank = options.rank;
      if (options.admin) data.isAdmin = true;
      if (options.empty) {
        data.trainer.recentSessionAccuracy = [];
        data.trainer.sessionsByDivision.forEach(item => item.sessions = 0);
        data.trainer.sessionsCompleted = 0;
      }
      return route.fulfill({ json: data });
    });
    await page.goto(origin);
    await expect.poll(() => state.reads).toBe(1);
    return { page, state };
  }
  async function close(page, state) {
    for (const route of state.held) await route.abort().catch(() => undefined);
    assert.deepEqual(state.errors, []);
    await page.close();
  }
  const welcome = page => page.getByRole("heading", { name: "Welcome back, fixture_student" });
  {
    const { page, state } = await open();
    await expect(welcome(page)).toBeVisible();
    await expect(page.getByText("1105 saved sessions", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recent Trainer Sessions", exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Recent Activity", exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Recent Session Accuracy", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Admin feedback", exact: true })).toHaveCount(0);
    await page.screenshot({ path: join(dir, "dashboard-desktop.png"), fullPage: true });
    await page.evaluate(owner => window.dispatchEvent(new CustomEvent("dashboard-account", { detail: owner })), dashboardOwner);
    await page.clock.runFor(120_000);
    assert.equal(state.reads, 1, "No polling or reload for a same-user token refresh");
    await expect(welcome(page)).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Mobile dashboard must fit the viewport");
    await page.screenshot({ path: join(dir, "dashboard-mobile.png") });
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("dashboard-account", { detail: null })));
    await expect(page.getByRole("heading", { name: "Your account changed" })).toBeVisible();
    await expect(welcome(page)).toHaveCount(0);
    await expect(page.getByText("1105 saved sessions", { exact: true })).toHaveCount(0);
    await close(page, state);
  }
  for (const rank of ["Novice", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Legend"]) {
    const { page, state } = await open("success", { rank, admin: true });
    await expect(welcome(page)).toBeVisible();
    const rankPanel = page.locator('[aria-label="Your multiplayer rank"]');
    assert.ok(await rankPanel.evaluate((el, rank) => rank === "Novice" || el.classList.contains(rank.toLowerCase()), rank));
    assert.equal(await page.locator('.chapter').count(), 5);
    const colors = await page.locator('.chapterHeader').evaluateAll(els => els.map(el => getComputedStyle(el).backgroundColor));
    assert.equal(new Set(colors).size, 5, "Each chapter has a distinct header");
    for (const width of [2560, 1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${rank} fits ${width}px`);
      for (const title of ["Trainer Analytics", "Trainer Trends", "Challenge Streaks", "Multiplayer", "Question Bank"]) {
        await expect(page.getByRole("region", { name: title, exact: true })).toBeVisible();
      }
      if (width >= 1440) assert.ok((await page.locator('.chapter').first().boundingBox()).width >= width - 81);
      if (rank === "Silver") await page.screenshot({ path: join(dir, `chapter-bands-${width}.png`), fullPage: true });
    }
    for (const [name, href] of [["Start Training", "/practice/trainer"], ["Account settings", "/account"], ["Make a suggestion", "/suggestions/new"], ["Admin feedback", "/admin/feedback"], ["Play Multiplayer", "/multiplayer"]]) {
      assert.equal(await page.getByRole("link", { name, exact: true }).getAttribute("href"), href);
    }
    await close(page, state);
  }
  {
    const { page, state } = await open("success", { empty: true });
    await expect(page.getByText("Complete a Trainer session to start building your accuracy trend.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sessions by Division" })).toBeVisible();
    await close(page, state);
  }
  for (const mode of ["hold", "fail", "wrong-owner", "malformed"]) {
    const { page, state } = await open(mode);
    if (mode === "hold") {
      await expect(page.getByRole("main", { name: "Loading dashboard" })).toBeVisible();
      await page.clock.runFor(12_000);
    }
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(welcome(page)).toHaveCount(0);
    await expect(page.getByText("No Trainer sessions yet", { exact: true })).toHaveCount(0);
    await page.clock.runFor(120_000); assert.equal(state.reads, 1, "Failures must not auto-retry");
    if (mode === "hold") await page.screenshot({ path: join(dir, "dashboard-retry.png") });
    state.mode = "success";
    await page.getByRole("button", { name: "Retry dashboard" }).evaluate(button => { button.click(); button.click(); });
    await expect(welcome(page)).toBeVisible();
    assert.equal(state.reads, 2, "Double clicks must start only one retry");
    for (const route of state.held) await route.fulfill({ json: dashboardFixture("other") }).catch(() => undefined);
    state.held = [];
    await expect(welcome(page)).toBeVisible();
    await close(page, state);
  }
  for (const action of ["account", "unmount"]) {
    const { page, state } = await open("hold");
    if (action === "account") {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("dashboard-account", { detail: "00000000-0000-4000-8000-000000000002" })));
      await expect(page.getByRole("button", { name: "Reload dashboard" })).toBeVisible();
    } else await page.getByRole("button", { name: "Unmount dashboard" }).click();
    for (const route of state.held) await route.fulfill({ json: dashboardFixture() }).catch(() => undefined);
    state.held = [];
    await page.clock.runFor(120_000);
    assert.equal(state.reads, 1);
    await expect(welcome(page)).toHaveCount(0);
    await expect(page.getByRole("alert")).toHaveCount(0);
    await close(page, state);
  }
  console.log("PASS: real dashboard UI, one bounded read, no catalog content, timeout/manual single retry, safe failures, account isolation, stale cancellation and responsive layout.");
  console.log(`Screenshots: ${dir}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
