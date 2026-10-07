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
  cwd: root, env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: "https://example.invalid", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public", SUPABASE_SECRET_KEY: "fixture-server" },
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

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    for (const division of ["Mu", "Alpha", "Theta"]) {
      const radio = page.getByRole("radio", { name: division.toUpperCase(), exact: true });
      await radio.check();
      assert.equal(await radio.isChecked(), true);
      const canvas = page.locator("main canvas");
      await canvas.hover();
      await page.waitForTimeout(100);
      const before = await canvas.evaluate(el => el.toDataURL());
      await page.waitForTimeout(200);
      assert.notEqual(await canvas.evaluate(el => el.toDataURL()), before, "division animation must move");
      assert.ok(await canvas.evaluate(el => el.getContext("2d").getImageData(0, 0, el.width, el.height).data.some((v, i) => i % 4 === 3 && v > 0)));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.screenshot({ path: `/tmp/trainer-studio-${width}.png`, fullPage: true });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(100);
  const still = await page.locator("main canvas").evaluate(el => el.toDataURL());
  await page.locator("main canvas").hover();
  await page.waitForTimeout(200);
  assert.equal(await page.locator("main canvas").evaluate(el => el.toDataURL()), still);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  for (const [division, catalog] of [["Mu", muQuestions], ["Alpha", alphaQuestions], ["Theta", thetaQuestions]]) {
    await page.getByRole("radio", { name: division.toUpperCase(), exact: true }).check();
    const responsePromise = page.waitForResponse(response => response.url().includes("/api/practice/trainer/question?"));
    await page.getByRole("button", { name: "Start Trainer", exact: true }).click();
    const response = await responsePromise;
    assert.equal(response.status(), 200);
    assert.equal(response.headers()["cache-control"], "no-store");
    const { question } = await response.json();
    assert.deepEqual(question, catalog.find(item => item.id === question.id));
    await page.getByRole("button", { name: "Give Up", exact: true }).waitFor();
    for (const width of [2560, 1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      const header = page.locator("main header"), choices = page.locator("main button[aria-pressed]");
      assert.equal(await choices.count(), question.choices.length);
      const color = { Mu: "rgb(37, 99, 235)", Alpha: "rgb(128, 67, 217)", Theta: "rgb(0, 143, 122)" }[division];
      assert.equal(await header.evaluate(el => getComputedStyle(el).backgroundColor), color);
      await header.locator("img").evaluate(img => img.decode());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const progress = await page.getByRole("progressbar").boundingBox();
      assert.ok(progress.width <= 620, "level progress should not stretch across desktop");
      if (width >= 1440) {
        const bounds = await header.boundingBox(), a = await choices.nth(0).boundingBox(), b = await choices.nth(1).boundingBox();
        assert.ok(bounds.width >= width - 81);
        assert.ok(b.x > a.x && Math.abs(a.y - b.y) < 1, "wide trainer choices must have two columns");
        assert.ok((await page.getByRole("complementary", { name: "Trainer statistics" }).boundingBox()).width <= 248);
      }
      await choices.nth(1).click();
      assert.equal(await choices.nth(1).getAttribute("aria-pressed"), "true");
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/trainer-session-${division}-${width}.png`, fullPage: true });
    }
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
    const dialog = page.getByRole("dialog");
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      const surface = await dialog.locator(":scope > div").boundingBox();
      assert.ok(surface.width <= 460 && surface.x >= 0 && surface.x + surface.width <= width);
      assert.equal(await dialog.locator("dt").allTextContents().then(labels => labels.sort()).then(labels => labels.join(",")), "Correct,Gave Up,Incorrect,Questions");
      for (const button of await dialog.getByRole("button").all()) assert.ok(await button.evaluate(el => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().height >= 44));
      await page.screenshot({ path: `/tmp/trainer-end-dialog-${division}-${width}.png` });
    }
    await dialog.getByRole("button", { name: "Continue Session", exact: true }).click();
    await dialog.waitFor({ state: "detached" });
    await page.getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "End Session", exact: true }).click();
    await page.getByRole("heading", { name: "Daily Trainer Summary", exact: true }).waitFor();
    for (const width of [2560, 1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      const header = page.locator("main header");
      await header.locator("img").evaluate(img => img.decode());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "summary must fit every viewport");
      assert.equal(await page.getByRole("region", { name: "Session totals" }).locator(":scope > div").count(), 4);
      assert.equal(await page.getByRole("region", { name: "Session metrics" }).locator(":scope > div").count(), 6);
      if (width >= 1440) assert.ok((await header.boundingBox()).width >= width - 81, "summary should use the desktop width");
      for (const name of ["Start New Session", "Return to Practice"]) {
        assert.ok(await page.getByRole("button", { name, exact: true }).evaluate(el => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().height >= 44));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/trainer-summary-${division}-${width}.png`, fullPage: true });
    }
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
