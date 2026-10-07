// Run after npm run build -- --webpack. No real accounts or data writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = resolve(import.meta.dirname, "..");
const screenshots = await mkdtemp(join(tmpdir(), "division-picker-"));
const probe = createServer();
await new Promise(resolve => probe.listen(0, "127.0.0.1", resolve));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: "https://example.invalid", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public", SUPABASE_SECRET_KEY: "fixture-server" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Local server did not become ready")), 30000);
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Server exited: ${code}`)); });
    child.stdout.on("data", data => { if (/Ready in/.test(String(data))) { clearTimeout(timeout); resolve(); } });
    child.stderr.on("data", () => {});
  });
  browser = await chromium.launch({ headless: true });
  const errors = [], writes = [];
  let originalCounts;
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, colorScheme: width === 320 ? "dark" : "light" });
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", route => {
      const request = route.request();
      if (!request.url().startsWith(`${origin}/`)) return route.abort();
      if (!["GET", "HEAD"].includes(request.method())) { writes.push(request.method()); return route.abort(); }
      return route.continue();
    });
    await page.goto(`${origin}/practice/question-bank`);
    const heading = page.getByRole("heading", { name: "Choose your division", exact: true });
    await heading.waitFor();
    const cards = page.locator('a:has(canvas)');
    assert.equal(await cards.count(), 3);
    assert.deepEqual(await cards.locator("h2").allTextContents(), ["MU", "ALPHA", "THETA"]);
    assert.deepEqual(await cards.locator('span[aria-hidden="true"]').allTextContents(), ["Μ", "Α", "Θ"]);
    const counts = await cards.evaluateAll(cards => cards.map(card => card.textContent.match(/\d+ questions/)[0]));
    originalCounts ??= counts;
    assert.deepEqual(counts, originalCounts);
    const watermark = heading.locator("../..").locator('img[aria-hidden="true"]');
    await watermark.evaluate(image => image.decode());
    assert.ok(await watermark.evaluate(image => image.naturalWidth > 0));
    await page.waitForFunction(() => [...document.querySelectorAll('a canvas')].every(canvas => {
      const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      return data.some((value, index) => index % 4 === 3 && value > 0);
    }));
    for (const [index, card] of (await cards.all()).entries()) {
      assert.equal(await card.getAttribute("href"), `/practice/question-bank/${["mu", "alpha", "theta"][index]}`);
      assert.ok(await card.evaluate(el => el.scrollWidth <= el.clientWidth));
      await page.mouse.move(0, 0);
      const before = await cards.locator("canvas").evaluateAll(canvases => canvases.map(canvas => canvas.toDataURL()));
      await card.hover();
      await page.waitForTimeout(300);
      const after = await cards.locator("canvas").evaluateAll(canvases => canvases.map(canvas => canvas.toDataURL()));
      assert.notEqual(after[index], before[index], "Hovered card must animate");
      for (let other = 0; other < 3; other++) if (other !== index) assert.equal(after[other], before[other], "Other cards must stay still");
      await page.mouse.move(0, 0);
    }
    await cards.first().focus();
    assert.equal(await cards.first().evaluate(el => getComputedStyle(el).outlineStyle), "solid");
    await page.keyboard.press("Tab");
    assert.equal(await cards.nth(1).evaluate(el => el === document.activeElement), true);
    await cards.nth(1).blur();
    await page.emulateMedia({ reducedMotion: "reduce" });
    const staticPlot = await cards.first().locator("canvas").evaluate(canvas => canvas.toDataURL());
    await cards.first().hover();
    await page.waitForTimeout(250);
    assert.equal(await cards.first().locator("canvas").evaluate(canvas => canvas.toDataURL()), staticPlot);
    assert.equal(await cards.first().evaluate(el => getComputedStyle(el).transform), "none");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(screenshots, `${width}.png`), fullPage: true });
    await cards.first().click();
    await page.waitForURL(`${origin}/practice/question-bank/mu`);
    await page.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(writes, []);
  console.log("PASS: unchanged destinations/counts, uppercase division order, rendered logo and canvases, independent animations, keyboard focus, reduced motion, desktop/mobile/dark-mode layouts, and no data writes.");
  console.log(`Screenshots: ${screenshots}`);
} finally {
  await browser?.close();
  if (child.exitCode === null) { const exited = once(child, "exit"); child.kill("SIGTERM"); await exited; }
}
