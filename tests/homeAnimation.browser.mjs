// Run against a local production server: HOME_TEST_URL=http://127.0.0.1:3107 node tests/homeAnimation.browser.mjs
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const url = process.env.HOME_TEST_URL ?? "http://127.0.0.1:3107";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 850 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url);
    const main = page.locator("main");
    const heading = main.getByRole("heading", { name: "Mathematics Daily", exact: true });
    const play = main.getByRole("link", { name: "Play", exact: true });
    const logo = main.getByRole("img", { name: "Mathematics Daily logo" });
    await logo.waitFor();
    assert.equal(await play.getAttribute("href"), "/multiplayer");
    assert.equal(await main.getByText("Practice math. Improve skills. Compete.", { exact: true }).count(), 1);
    // The unchanged logo still uses its original SVG path and moving ball.
    assert.equal(await logo.locator("path").getAttribute("d"), "M45.5 54H18.8L31.2 35.5 19 17H49");
    await page.waitForTimeout(2900);
    assert.equal(await heading.evaluate(el => getComputedStyle(el).opacity), "1");
    assert.equal(await play.evaluate(el => getComputedStyle(el).opacity), "1");
    assert.equal(await logo.locator("path").evaluate(el => el.style.strokeDashoffset), "0");
    assert.equal(await logo.locator("circle").getAttribute("cx"), "49");
    const traces = main.locator('[aria-hidden="true"] path, [aria-hidden="true"] circle, [aria-hidden="true"] ellipse');
    assert.ok(await traces.count() >= 5);
    for (const trace of await traces.all()) assert.equal(await trace.evaluate(el => getComputedStyle(el).opacity), "0");
    const before = await heading.boundingBox();
    await page.waitForTimeout(300);
    assert.deepEqual(await heading.boundingBox(), before, "No layout swap after entrance");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await play.click({ trial: true });
    assert.deepEqual(errors, []);
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(url);
  const main = page.locator("main");
  const play = main.getByRole("link", { name: "Play", exact: true });
  assert.equal(await play.evaluate(el => getComputedStyle(el).animationName), "none");
  assert.equal(await play.evaluate(el => getComputedStyle(el).opacity), "1");
  assert.equal(await main.getByRole("heading").evaluate(el => getComputedStyle(el).animationName), "none");
  await play.click({ trial: true });
  await page.close();
  console.log("PASS: desktop/mobile entrance, unchanged content and Play target, original logo completion, dissolved decorations, stable final layout, reduced motion, and no browser errors.");
} finally {
  await browser.close();
}
