// Real tutor UI/transport; local mocked API/auth only. No paid calls or live data.
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
const dir = await mkdtemp(join(tmpdir(), "stage-five-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("stageFive.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/image": fixture("image.tsx"), "@/lib/supabase/client": fixture("trainerSupabase.ts"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const pet = await readFile(join(root, "public/llama-pet.png"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  if (req.url === "/llama-pet.png") { res.setHeader("Content-Type", "image/png"); res.end(pet); return; }
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  async function open(options = {}) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const state = { posts: [], gets: 0, errors: [], held: [], mode: "success", getMode: "success", remaining: 14, ...options };
    page.on("pageerror", error => state.errors.push(error.message));
    await page.clock.install(); await page.clock.pauseAt(new Date());
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.route("**/*", route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname !== "/api/tutor") return route.continue();
      if (request.method() === "GET") {
        state.gets++;
        if (state.getMode === "hold") { state.held.push(route); return; }
        if (state.getMode === "fail") return route.fulfill({ status: 503, json: { error: "Unavailable" } });
        return route.fulfill({ json: { messagesRemaining: state.remaining } });
      }
      state.posts.push(request.postDataJSON());
      if (state.mode === "hold") { state.held.push(route); return; }
      if (state.mode === "busy") return route.fulfill({ status: 429, headers: { "Retry-After": "3" }, json: { code: "busy", retryAfterMs: 3000 } });
      if (state.mode === "fail") return route.fulfill({ status: 503, json: { code: "unavailable" } });
      return route.fulfill({ json: { message: "Try drawing the tangent first.", messagesRemaining: state.remaining } });
    });
    await page.goto(origin);
    await page.getByRole("button", { name: "Open Llama Tutor", exact: true }).waitFor().catch(async error => {
      throw new Error(`${error.message}\nBrowser errors: ${JSON.stringify(state.errors)}\nBody: ${await page.locator("body").innerText()}`);
    });
    assert.equal(state.gets, 0, "closed tutor makes no allowance request");
    await page.getByRole("button", { name: "Open Llama Tutor", exact: true }).click();
    await expect.poll(() => state.gets).toBe(1);
    if (state.getMode === "success") await expect(page.getByLabel("Message Llama Tutor")).toBeEnabled();
    return { page, state };
  }
  async function send(page, message = "How do I start?") {
    await page.getByLabel("Message Llama Tutor").fill(message);
    await page.getByRole("button", { name: "Send message", exact: true }).evaluate(button => { button.click(); button.click(); });
  }
  async function close(page, state) {
    for (const route of state.held) await route.abort().catch(() => undefined);
    assert.deepEqual(state.errors, []);
    await page.close();
  }
  {
    const { page, state } = await open({ mode: "busy" });
    await send(page);
    await page.getByLabel("Waiting for tutor", { exact: true }).waitFor();
    assert.equal(state.posts.length, 1, "synchronous double clicks must send once");
    assert.equal(await page.locator(".pet[data-state=thinking] .thought").count(), 2);
    await page.screenshot({ path: join(dir, "tutor-waiting.png") });
    for (const [delay, count] of [[3000, 2], [6000, 3], [12000, 4]]) {
      await page.clock.runFor(delay);
      await expect.poll(() => state.posts.length).toBe(count);
      if (count < 4) await page.getByLabel("Waiting for tutor", { exact: true }).waitFor();
    }
    await page.getByRole("alert").filter({ hasText: "still busy" }).waitFor();
    await expect(page.getByLabel("Message Llama Tutor")).toHaveValue("How do I start?");
    await page.clock.runFor(180_000);
    assert.equal(state.posts.length, 4);
    assert.equal(new Set(state.posts.map(body => JSON.stringify(body))).size, 1);
    await page.screenshot({ path: join(dir, "tutor-busy.png") });
    state.mode = "success"; state.remaining = 0;
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await page.getByText("Try drawing the tangent first.", { exact: true }).waitFor();
    assert.deepEqual(state.posts[4].history, [], "manual retry must not duplicate the failed user message");
    assert.equal(await page.locator(".pet[data-state=sleeping]").count(), 2);
    await expect(page.getByLabel("Message Llama Tutor")).toBeDisabled();
    await page.getByText("0 requests left today", { exact: true }).waitFor();
    await close(page, state);
  }
  {
    const { page, state } = await open({ getMode: "hold" });
    await expect(page.getByLabel("Message Llama Tutor")).toBeDisabled();
    await page.clock.runFor(12_000);
    await page.getByRole("alert").filter({ hasText: "took too long" }).waitFor();
    await page.getByText("Daily limit unavailable", { exact: true }).waitFor();
    assert.equal(state.posts.length, 0);
    state.getMode = "success";
    await page.getByRole("button", { name: "Check limit again" }).click();
    await expect(page.getByLabel("Message Llama Tutor")).toBeEnabled();
    assert.equal(state.gets, 2);
    await close(page, state);
  }
  for (const mode of ["hold", "fail"]) {
    const { page, state } = await open({ mode });
    await send(page); await expect.poll(() => state.posts.length).toBe(1);
    if (mode === "hold") await page.clock.runFor(60_000);
    await page.getByRole("alert").filter({ hasText: "may use a request" }).waitFor();
    await expect(page.getByLabel("Message Llama Tutor")).toHaveValue("How do I start?");
    await page.clock.runFor(180_000); assert.equal(state.posts.length, 1);
    await close(page, state);
  }
  for (const action of ["close", "account", "question", "unmount", "hidden", "pagehide"]) {
    const { page, state } = await open({ mode: "busy" });
    await send(page); await page.getByLabel("Waiting for tutor", { exact: true }).waitFor();
    if (action === "close") await page.getByRole("button", { name: "Close tutor", exact: true }).click();
    if (action === "question") await page.getByRole("button", { name: "Next fixture question" }).click();
    if (action === "unmount") await page.getByRole("button", { name: "Unmount tutor" }).click();
    if (action === "account") {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("trainer-account", { detail: "first" })));
      await expect(page.getByLabel("Waiting for tutor", { exact: true })).toBeVisible();
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("trainer-account", { detail: "second" })));
    }
    if (action === "hidden") await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    if (action === "pagehide") await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
    await expect(page.locator("#llama-tutor-panel")).toHaveCount(0);
    await page.clock.runFor(180_000);
    assert.equal(state.posts.length, 1, `${action} must cancel retries`);
    if (action !== "unmount") {
      state.mode = "success";
      await page.getByRole("button", { name: "Open Llama Tutor", exact: true }).click();
      await expect(page.getByLabel("Message Llama Tutor")).toBeEnabled();
      await expect(page.getByLabel("Message Llama Tutor")).toHaveValue("");
      assert.equal(await page.getByRole("alert").count(), 0);
      await send(page, "A fresh question");
      await page.getByText("Try drawing the tangent first.", { exact: true }).waitFor();
      assert.deepEqual(state.posts[1].history, []);
      assert.equal(state.posts[1].questionId, action === "question" ? 43 : 42);
    }
    await close(page, state);
  }
  {
    const { page, state } = await open({ mode: "hold" });
    await send(page); await expect.poll(() => state.posts.length).toBe(1);
    await page.getByRole("button", { name: "Close tutor", exact: true }).click();
    await page.getByRole("button", { name: "Open Llama Tutor", exact: true }).click();
    await expect(page.getByLabel("Message Llama Tutor")).toBeEnabled();
    await state.held[0].fulfill({ json: { message: "Stale answer", messagesRemaining: 0 } }).catch(() => undefined);
    state.held = [];
    await page.clock.runFor(90_000);
    assert.equal(await page.getByText("Stale answer", { exact: true }).count(), 0);
    assert.equal(await page.getByRole("alert").count(), 0);
    await expect(page.getByLabel("Message Llama Tutor")).toBeEnabled();
    await close(page, state);
  }
  console.log("PASS: tutor bounded busy retries, single-flight send, restored drafts, allowance/post deadlines, no ambiguous resends, sleep/thought bubbles, cancellation, account/question changes, and stale response isolation.");
  console.log(`Screenshots: ${join(dir, "tutor-waiting.png")} and ${join(dir, "tutor-busy.png")}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
