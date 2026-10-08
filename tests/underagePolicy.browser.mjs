// Public pages only: no joining rooms, account writes, or hosted database changes.
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const origin = process.env.PUBLIC_PREVIEW_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto(origin);
    await page.getByRole("heading", { name: "Mathematics Daily", exact: true }).waitFor();
    const audience = page.getByText("For high-school math competitors, coaches, and teachers. Ages 13+.", { exact: true });
    assert.ok(await audience.isVisible());
    const bounds = await audience.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
    assert.equal(await page.getByRole("link", { name: "Play", exact: true }).getAttribute("href"), "/multiplayer");
    assert.match(await page.locator('meta[name="description"]').getAttribute("content"), /high-school.*13 and older/);
    await page.screenshot({ path: `/tmp/underage-home-${width}.png`, fullPage: true });

    await page.goto(`${origin}/contact#underage-player`);
    const reportHeading = page.getByRole("heading", { name: "Report an under-13 player", exact: true });
    await reportHeading.waitFor();
    // Wait for the streamed page's anchor scroll after hydration.
    await page.waitForFunction(() => {
      const heading = document.getElementById("underage-player");
      return heading && heading.getBoundingClientRect().top >= 90;
    });
    const report = page.getByRole("link", { name: "email an under-13 player report" });
    assert.equal(await report.getAttribute("href"), "mailto:privacy@mathematicsdaily.com?subject=Under-13%20player%20report");
    assert.ok(await page.getByText(/guest nickname and private room code or room link/).isVisible());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `/tmp/underage-contact-${width}.png`, fullPage: true });

    await page.goto(`${origin}/privacy`);
    await page.getByRole("heading", { name: "Privacy Policy", exact: true }).waitFor();
    assert.equal(await page.getByRole("link", { name: "under-13 reporting instructions" }).getAttribute("href"), "/contact#underage-player");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.goto(`${origin}/terms`);
    await page.getByRole("heading", { name: "Terms of Service", exact: true }).waitFor();
    assert.ok(await page.getByText(/Do not invite or readmit someone you know is under 13/).isVisible());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

    await page.goto(`${origin}/multiplayer/join`);
    await page.getByRole("textbox", { name: "Guest nickname" }).waitFor();
    assert.ok(await page.getByText("You must be 13 or older to play, including as a guest.", { exact: true }).isVisible());
    assert.equal(await page.getByRole("checkbox").count(), 0);
    assert.equal(await page.locator('input[type="date"]').count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    console.log(`PASS public audience, guest reporting, policies and unchanged join form at ${width}px`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
