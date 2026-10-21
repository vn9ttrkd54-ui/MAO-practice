import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, expect } from "@playwright/test";

const baseUrl = process.env.CREDITS_TEST_BASE_URL ?? "http://localhost:3000";
const screenshots = await mkdtemp(join(tmpdir(), "mathematics-daily-credits-"));
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));

  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const response = await page.goto(new URL("/credits", baseUrl).href);
    assert.equal(response.status(), 200);
    await expect(page).toHaveTitle("Credits | Mathematics Daily");

    const article = page.getByRole("article");
    assert.deepEqual(await article.getByRole("heading", { level: 2 }).allTextContents(), [
      "Developed by", "Co-developers", "Endorsements", "Question material",
    ]);
    await expect(article).toContainText("Orlando Science Mu Alpha Theta");
    await expect(article).toContainText("Participating Mu Alpha Theta National Student Delegates, for their contributions to the question bank.");
    const endorsements = article.getByRole("region", { name: "Endorsements", exact: true });
    await expect(endorsements).toContainText("Officially endorsed by");
    assert.deepEqual(await endorsements.getByRole("listitem").allTextContents(), [
      "Mu Alpha Theta National Student Delegates",
      "Florida Association of Mu Alpha Theta Student Delegates",
    ]);
    await expect(article).toContainText("These endorsements are from the student delegate groups and do not represent an endorsement by Mu Alpha Theta as an organization.");
    await expect(article).toContainText("Selected questions from Mu Alpha Theta materials are reproduced or adapted with written permission from");
    await expect(article).toContainText("Mathematics Daily is an independent educational project and is not affiliated with, sponsored by, or endorsed by Mu Alpha Theta.");
    await expect(article.getByRole("link", { name: /^Mu Alpha Theta, the National/ })).toHaveAttribute("href", "https://mualphatheta.org/");

    const logo = article.getByRole("img", { name: "Orlando Science Mu Alpha Theta logo", exact: true });
    await expect(logo).toBeVisible();
    assert.ok(await logo.evaluate(async image => {
      await image.decode();
      return image.complete && image.naturalWidth > 0;
    }));
    await expect(logo).toHaveAttribute("src", /orlando-science-mu-alpha-theta-transparent/);
    const alpha = await logo.evaluate(image => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      const sample = (x, y) => context.getImageData(x, y, 1, 1).data[3];
      return [sample(0, 0), sample(canvas.width - 1, 0), sample(0, canvas.height - 1), sample(canvas.width - 1, canvas.height - 1), sample(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2))];
    });
    assert.deepEqual(alpha.slice(0, 4), [0, 0, 0, 0], "logo corners are genuinely transparent");
    assert.ok(alpha[4] >= 250, "logo artwork remains visibly solid");
    const bounds = await logo.boundingBox();
    assert.ok(Math.abs(bounds.width / bounds.height - 1303 / 1207) < 0.01, "logo keeps its aspect ratio");
    const regions = article.getByRole("region");
    const regionBounds = await regions.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON()));
    for (let i = 1; i < regionBounds.length; i++) {
      assert.ok(regionBounds[i].top >= regionBounds[i - 1].bottom, "credit sections never overlap");
    }
    const developer = article.getByRole("region", { name: "Developed by", exact: true });
    const nameBounds = await developer.getByText("Orlando Science Mu Alpha Theta", { exact: true }).boundingBox();
    assert.ok(nameBounds.x >= bounds.x + bounds.width, "developer name stays beside the logo without overlap");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no horizontal overflow");
    assert.ok(await article.locator("h2, p, span, img").evaluateAll(elements =>
      elements.every(element => {
        const { left, right } = element.getBoundingClientRect();
        return left >= 0 && right <= innerWidth;
      })), "all credit text and the logo stay within the viewport");
    await page.screenshot({ path: join(screenshots, `credits-${width}.png`), fullPage: true });
  }

  assert.deepEqual(errors, []);
  console.log(`PASS: Credits sections, delegate endorsements, original question material and independence notice, logo transparency/aspect ratio, section spacing, and responsive layout at 1280/768/390/320px. Screenshots: ${screenshots}`);
} finally {
  await browser.close();
}
