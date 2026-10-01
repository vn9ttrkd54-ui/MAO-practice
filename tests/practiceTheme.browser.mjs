// Run after npm run build -- --webpack. Uses only localhost and no real account.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = resolve(import.meta.dirname, "..");
const screenshots = await mkdtemp(join(tmpdir(), "practice-theme-"));
const probe = createServer();
await new Promise((resolve, reject) => {
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", resolve);
});
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  env: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: `${origin}/blocked-supabase`,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public",
    SUPABASE_SECRET_KEY: "fixture-server",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Local production server did not become ready")), 30000);
    child.once("error", error => { clearTimeout(timeout); reject(error); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Local server exited: ${code}`)); });
    child.stdout.on("data", data => {
      if (/Ready in/.test(data.toString())) { clearTimeout(timeout); resolve(); }
    });
    child.stderr.on("data", () => {});
  });
  browser = await chromium.launch({ headless: true });
  const errors = [];
  const writes = [];
  for (const [name, width, height, colorScheme] of [
    ["desktop", 1440, 960, "light"],
    ["mobile", 390, 844, "light"],
    ["small-dark", 320, 740, "dark"],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, colorScheme });
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", route => {
      const request = route.request();
      if (!request.url().startsWith(`${origin}/`)) return route.abort();
      if (!["GET", "HEAD"].includes(request.method())) { writes.push(request.method()); return route.abort(); }
      return route.continue();
    });
    await page.goto(`${origin}/practice`);
    const heading = page.getByRole("heading", { name: "What do you want to practice?", exact: true });
    await heading.waitFor();
    await page.getByRole("navigation", { name: "Primary navigation" }).locator("img").waitFor();
    const bank = page.getByRole("link", { name: "Browse the question bank Choose a division and apply filters.", exact: true });
    const trainer = page.getByRole("link", { name: "Start the daily trainer Get an adaptive set selected for you.", exact: true });
    assert.equal(await bank.getAttribute("href"), "/practice/question-bank");
    assert.equal(await trainer.getAttribute("href"), "/practice/trainer");
    assert.equal(await page.getByText("Choose a mode to begin.", { exact: true }).count(), 1);
    assert.equal(await heading.evaluate(el => getComputedStyle(el).color), "rgb(255, 255, 255)");
    assert.equal(await bank.evaluate(el => getComputedStyle(el).color), "rgb(23, 32, 51)");
    assert.equal(await bank.evaluate(el => getComputedStyle(el).borderRadius), "24px");
    assert.ok(await heading.evaluate(el => getComputedStyle(el.parentElement).backgroundImage.includes("linear-gradient")));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: horizontal overflow`);
    for (const link of [bank, trainer]) {
      const box = await link.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width && box.height >= 44, `${name}: card must fit the viewport`);
      assert.ok(await link.evaluate(el => el.scrollWidth <= el.clientWidth), `${name}: card contents must fit`);
    }
    await page.screenshot({ path: join(screenshots, `${name}.png`), fullPage: true, animations: "disabled" });
    await bank.focus();
    await page.keyboard.press("Tab");
    assert.equal(await trainer.evaluate(el => el === document.activeElement), true);
    assert.equal(await trainer.evaluate(el => getComputedStyle(el).outlineStyle), "solid");
    assert.equal(await trainer.evaluate(el => getComputedStyle(el).outlineWidth), "2px");
    await page.keyboard.press("Shift+Tab");
    assert.equal(await bank.evaluate(el => el === document.activeElement), true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await bank.hover();
    assert.equal(await bank.evaluate(el => getComputedStyle(el).transform), "none");
    assert.equal(await bank.evaluate(el => getComputedStyle(el).transitionDuration), "0s");
    assert.equal(await bank.locator("svg").last().evaluate(el => getComputedStyle(el).transform), "none");
    await page.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(writes, [], "Practice page must not write data");
  console.log("PASS: Practice theme, unchanged copy and destinations, desktop/mobile layouts, OS dark-mode readability, keyboard focus, reduced motion, and no data writes.");
  console.log(`Screenshots: ${screenshots}`);
} finally {
  await browser?.close();
  if (child.exitCode === null) { const exited = once(child, "exit"); child.kill("SIGTERM"); await exited; }
}
