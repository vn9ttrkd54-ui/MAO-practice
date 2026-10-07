// Run against the local production build, never the hosted website. Browser
// requests cannot leave localhost and server-side credentials point to a stub.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { resolve } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { chromium } from "@playwright/test";
import { muQuestions } from "../data/questions/mu.ts";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { thetaQuestions } from "../data/questions/theta.ts";

const root = resolve(import.meta.dirname, "..");
const portProbe = createServer();
await new Promise(resolve => portProbe.listen(0, "127.0.0.1", resolve));
const port = portProbe.address().port;
await new Promise(resolve => portProbe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  // Production correctly rejects an HTTP Auth endpoint. Keep the stub on
  // loopback but use HTTPS; no guest navigation should contact it at all.
  env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: `https://127.0.0.1:${port}/blocked-supabase`, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public", SUPABASE_SECRET_KEY: "fixture-server" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Local production server did not become ready")), 30000);
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Local production server exited: ${code}`)); });
    child.stdout.on("data", data => { if (/Ready in/.test(data.toString())) { clearTimeout(timeout); resolve(); } });
  });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const unauthenticated = await page.request.get(`${origin}/api/practice/question-bank/state?owner=11111111-1111-4111-8111-111111111111&questionId=10238`);
  assert.equal(unauthenticated.status(), 401);
  assert.match(unauthenticated.headers()["cache-control"], /private, no-store/);
  assert.match(unauthenticated.headers()["server-timing"], /auth;dur=/);
  const errors = [], writes = [], documents = [], blockedExternal = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (request.isNavigationRequest()) documents.push(request.url()); });
  await page.route("**/*", route => {
    const request = route.request();
    if (!request.url().startsWith(`${origin}/`)) { blockedExternal.push(new URL(request.url()).hostname); return route.abort(); }
    if (!["GET", "HEAD"].includes(request.method())) { writes.push(request.method()); return route.abort(); }
    return route.continue();
  });

  const bank = `${origin}/practice/question-bank/mu`;
  await page.goto(bank);
  const tiles = page.getByRole("link", { name: /^Question \d+,/ });
  await tiles.first().waitFor();
  assert.equal(await tiles.count(), Math.min(muQuestions.length, 120));
  // Read-only filtering changes the URL without triggering an RSC request.
  const rsc = [];
  page.on("request", request => {
    const url = new URL(request.url());
    // Navbar link prefetches may overlap hydration; only a re-fetch of the
    // current bank page would mean filtering triggered a server navigation.
    if (url.searchParams.has("_rsc") && url.pathname === "/practice/question-bank/mu") rsc.push(request.url());
  });
  const topic = muQuestions[0].topic;
  await page.getByLabel("Topic", { exact: true }).selectOption(topic);
  const filtered = muQuestions.filter(q => q.topic === topic).sort((a, b) => a.number - b.number);
  await page.getByRole("heading", { name: `${filtered.length} ${filtered.length === 1 ? "question" : "questions"}`, exact: true }).waitFor();
  assert.equal(rsc.length, 0, "filter selection must not fetch a server page");
  const destination = await tiles.first().getAttribute("href");
  await tiles.first().click();
  await page.getByRole("heading", { name: `Question ${filtered[0].number}`, exact: true }).waitFor();
  assert.equal(new URL(page.url()).searchParams.get("sequence"), new URL(destination, origin).searchParams.get("sequence"));
  assert.equal(await page.getByRole("button", { name: "← Previous", exact: true }).isDisabled(), true);
  if (filtered.length > 1) {
    await page.getByRole("button", { name: "Next →", exact: true }).click();
    await page.getByRole("heading", { name: `Question ${filtered[1].number}`, exact: true }).waitFor();
    await page.getByRole("button", { name: "← Previous", exact: true }).click();
    await page.getByRole("heading", { name: `Question ${filtered[0].number}`, exact: true }).waitFor();
  }
  await page.getByRole("link", { name: "← Question Bank", exact: true }).click();
  await tiles.first().waitFor();
  assert.equal(await page.getByLabel("Topic", { exact: true }).inputValue(), topic);
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  if (muQuestions.length > 120) {
    await page.getByRole("button", { name: "Show more questions" }).click();
    const expanded = Math.min(muQuestions.length, 240);
    assert.equal(await tiles.count(), expanded);
    await tiles.nth(125 < expanded ? 125 : expanded - 1).click();
    await page.getByRole("button", { name: "Give Up", exact: true }).waitFor();
    await page.getByRole("link", { name: "← Question Bank", exact: true }).click();
    await tiles.first().waitFor();
    assert.equal(await tiles.count(), expanded);
  }
  // Old copied comma-list URLs still honor their original filtered order.
  const pair = [muQuestions[0], muQuestions[2]];
  await page.goto(`${origin}/practice/question-bank/${pair[0].id}?sequence=${pair.map(q => q.id).join(",")}`);
  await page.getByRole("button", { name: "Next →", exact: true }).click();
  await page.getByRole("heading", { name: `Question ${pair[1].number}`, exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Next →", exact: true }).isDisabled(), true);
  // Direct links have normal neighbors instead of interpreting empty sequence as 0.
  const ordered = [...muQuestions].sort((a, b) => a.number - b.number);
  await page.goto(`${origin}/practice/question-bank/${ordered[0].id}`);
  await page.getByRole("button", { name: "Next →", exact: true }).click();
  await page.getByRole("heading", { name: `Question ${ordered[1].number}`, exact: true }).waitFor();
  const screenshots = await mkdtemp(resolve(tmpdir(), "division-bank-"));
  for (const [division, questions, color] of [["mu", muQuestions, "rgb(37, 99, 235)"], ["alpha", alphaQuestions, "rgb(128, 67, 217)"], ["theta", thetaQuestions, "rgb(0, 143, 122)"]]) {
    for (const width of [2560, 1920, 1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/practice/question-bank/${division}`);
      await tiles.first().waitFor();
      assert.equal(await tiles.count(), Math.min(120, questions.length));
      const header = page.locator("main header");
      if (width >= 1440) {
        const bounds = await header.boundingBox();
        assert.ok(bounds.width >= width - 81, "bank should use the wide screen with modest gutters");
        assert.ok(Math.abs(bounds.x + bounds.width / 2 - width / 2) <= 1, "bank header must be centered");
        const filters = await page.getByRole("region", { name: "Question filters" }).boundingBox();
        const firstTile = await tiles.first().boundingBox();
        assert.ok(filters.width <= 248 && filters.x + filters.width < firstTile.x, "wide filters must form a compact left sidebar");
        assert.equal(firstTile.width, 48, "question tiles must not stretch");
      }
      assert.equal(await header.locator("strong").textContent(), String(questions.length));
      assert.equal(await header.evaluate(el => getComputedStyle(el).backgroundColor), color);
      await header.locator("img").evaluate(img => img.decode());
      assert.equal(await page.locator("main canvas").count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${division} must fit ${width}px`);
      for (const label of ["Topic", "Method", "Difficulty", "Progress", "Bookmarks"]) {
        const select = page.getByLabel(label, { exact: true });
        assert.equal(await select.evaluate(el => {
          const rect = el.getBoundingClientRect();
          const arrow = el.nextElementSibling.getBoundingClientRect();
          return rect.width >= 120 && rect.height >= 44 && arrow.right <= rect.right && arrow.left >= rect.left;
        }), true, `${label} select and chevron fit at ${width}px`);
      }
      await page.screenshot({ path: resolve(screenshots, `${division}-${width}.png`), fullPage: true });
      await tiles.first().click();
      await page.getByRole("heading", { name: `Question ${questions[0].number}`, exact: true }).waitFor();
      const questionHeader = page.locator("main header");
      if (width >= 1440) {
        const bounds = await questionHeader.boundingBox();
        assert.ok(bounds.width >= width - 81, "question workspace must use the wide screen with modest gutters");
        assert.ok(Math.abs(bounds.x + bounds.width / 2 - width / 2) <= 1, "question header must be centered");
      }
      assert.equal(await questionHeader.evaluate(el => getComputedStyle(el).backgroundColor), color);
      await questionHeader.locator("img").evaluate(img => img.decode());
      const choices = page.locator("main button[aria-pressed]:not([aria-label])");
      assert.equal(await choices.count(), questions[0].choices.length);
      if (width >= 1440) {
        const first = await choices.nth(0).boundingBox(), second = await choices.nth(1).boundingBox();
        assert.ok(second.x > first.x && Math.abs(second.y - first.y) <= 1, "wide answers must form two columns");
        const stats = await page.locator("main aside").first().boundingBox();
        assert.ok(stats.width <= 248, "statistics must stay compact");
      }
      await choices.nth(1).click();
      assert.equal(await choices.nth(1).getAttribute("aria-pressed"), "true");
      assert.equal(await choices.first().getAttribute("aria-pressed"), "false");
      await page.getByRole("button", { name: "Give Up", exact: true }).waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `question detail must fit ${width}px`);
      for (const choice of await choices.all()) {
        assert.equal(await choice.evaluate(el => el.getBoundingClientRect().height >= 44), true);
      }
      await page.screenshot({ path: resolve(screenshots, `question-${division}-${width}.png`), fullPage: true });
      if (width === 390) {
        await page.getByRole("button", { name: "Submit", exact: true }).click();
        await page.getByRole("button", { name: "Saved", exact: true }).waitFor();
        await page.getByRole("heading", { name: "Solution", exact: true }).waitFor();
        await page.getByRole("button", { name: "Reattempt", exact: true }).click();
        await page.getByRole("button", { name: "Give Up", exact: true }).click();
        await page.getByRole("heading", { name: "Gave Up", exact: true }).waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "solution must fit mobile");
      }
      await page.getByRole("button", { name: "Report typo / suggest change", exact: true }).click();
      await page.getByRole("dialog").waitFor();
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page.getByRole("dialog").waitFor({ state: "detached" });
    }
  }
  const longQuestion = muQuestions.find(question => question.number === 21);
  for (const width of [2560, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}/practice/question-bank/${longQuestion.id}`);
    await page.getByRole("heading", { name: "Question 21", exact: true }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "long differential-equation problem must fit");
    await page.screenshot({ path: resolve(screenshots, `long-question-${width}.png`), fullPage: true });
  }
  assert.deepEqual(writes, [], "navigation must not write any data");
  assert.deepEqual(errors, []);
  console.log(`PASS: production Next.js routing, native filter URLs without RSC reads, all divisions, filtered/legacy/direct next and previous, expanded return list, and read-only navigation (${documents.length} document requests).`);
  console.log(`PASS: division colors, available counts, logo loading, dropdown sizing, bounded centered headers, and no overflow across 18 ultrawide/desktop/mobile views. Screenshots: ${screenshots}`);
} finally {
  await browser?.close();
  if (child.exitCode === null) { const exited = once(child, "exit"); child.kill("SIGTERM"); await exited; }
}
