// Real challenge/submission/admin components; account services and HTTP writes are local fixtures.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const fixture = name => join(root, "tests/browserFixtures", name);
const mocks = fixture("questionSubmissionMocks.ts");
const dir = await mkdtemp(join(tmpdir(), "daily-question-submission-"));
const compiler = require("next/dist/compiled/webpack/webpack").webpack({
  mode: "development", entry: fixture("questionSubmission.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "@/lib/challenge": mocks, "@/app/challenge/actions": mocks, "@/lib/supabase/server": mocks,
    "next/navigation": mocks, "next/link": fixture("link.tsx"), "next/image": fixture("googleImage.tsx"), "@": root,
  } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => compiler.close(() =>
  error || stats.hasErrors() ? reject(error ?? Error(stats.toString())) : resolve())));
const bundle = await readFile(join(dir, "client.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  if (req.url === "/fixture-diagram.svg") {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><path d="M0 200L400 0" stroke="blue"/></svg>');
  }
  const script = req.url === "/client.js";
  res.setHeader("Content-Type", script ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(script ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [], requests = [];
  let outcome = "success", release;
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (url.pathname !== "/api/feedback" && url.pathname !== "/api/admin/feedback") return route.continue();
    requests.push(route.request().postDataJSON());
    if (outcome === "hold") await new Promise(resolve => { release = resolve; });
    if (outcome === "network") return route.abort();
    return route.fulfill(outcome === "error" ? { status: 429, json: { error: "Too many requests. Please try again later." } } : { json: { success: true } });
  });
  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/challenge`);
    const link = page.getByRole("link", { name: "Submit Question", exact: true });
    await expect(link).toBeVisible();
    assert.equal(await link.getAttribute("href"), "/challenge/submit");
    const buttons = await page.getByRole("group", { name: "Division", exact: true }).boundingBox();
    const bounds = await link.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
    if (width === 1280) assert.ok(bounds.x >= buttons.x + buttons.width, "desktop submission link is to the right of division tabs");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: join(dir, `challenge-${width}.png`), fullPage: true });
    await link.click();
    await expect(page.getByRole("heading", { name: "Submit a problem", exact: true })).toBeVisible();
    const division = page.getByLabel("Division", { exact: true });
    const message = page.getByLabel("Problem, answer, and solution", { exact: true });
    const submit = page.getByRole("button", { name: "Submit Question", exact: true });
    assert.equal(await division.inputValue(), "");
    assert.equal(await division.getAttribute("required"), "");
    await message.fill("Problem: What is 1+1? Answer: 2. Solution: Add the integers. Source: My original problem.");
    await expect(submit).toBeDisabled();
    await division.selectOption("Alpha");
    await expect(submit).toBeEnabled();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: join(dir, `submission-${width}.png`), fullPage: true });
    outcome = "error";
    await submit.click();
    await expect(page.getByRole("alert")).toContainText("Too many requests");
    assert.equal(await division.inputValue(), "Alpha");
    assert.ok((await message.inputValue()).includes("My original problem"));
    outcome = "success";
    await submit.click();
    await expect(page.getByRole("status")).toContainText("your problem was submitted");
    assert.equal(requests.at(-1).kind, "question_submission");
    assert.equal(requests.at(-1).division, "Alpha");
    assert.equal("questionId" in requests.at(-1), false);
  }
  for (const division of ["Mu", "Theta"]) {
    await page.goto(`${origin}/challenge/submit`);
    await page.getByLabel("Division", { exact: true }).selectOption(division);
    await page.getByLabel("Problem, answer, and solution", { exact: true }).fill("An original problem, its answer, detailed solution, and credit.");
    await page.getByRole("button", { name: "Submit Question", exact: true }).click();
    await expect(page.getByRole("status")).toBeVisible();
    assert.equal(requests.at(-1).division, division);
  }
  await page.goto(`${origin}/challenge/submit`);
  await page.getByLabel("Division", { exact: true }).selectOption("Mu");
  await page.getByLabel("Problem, answer, and solution", { exact: true }).fill("An original problem with a detailed solution and author credit.");
  outcome = "hold";
  await page.getByRole("button", { name: "Submit Question", exact: true }).click();
  await expect(page.getByRole("button", { name: "Submitting...", exact: true })).toBeDisabled();
  await expect(page.getByLabel("Division", { exact: true })).toBeDisabled();
  await expect(page.getByLabel("Problem, answer, and solution", { exact: true })).toBeDisabled();
  await expect.poll(() => typeof release).toBe("function");
  outcome = "success";
  release();
  await expect(page.getByRole("status")).toBeVisible();
  await page.goto(`${origin}/challenge/submit?guest=1`);
  await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
  assert.equal(await page.locator("body").getAttribute("data-destination"), "/login");
  for (const [view, kind, label] of [["suggestion", "general_suggestion", "What would you like to suggest?"], ["report", "question_report", "Explain what is wrong or what should change"]]) {
    await page.goto(`${origin}/?view=${view}`);
    assert.equal(await page.getByRole("combobox").count(), 0);
    await page.getByLabel(label, { exact: true }).fill("A useful existing feedback message.");
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await expect(page.getByRole("status")).toBeVisible();
    assert.equal(requests.at(-1).kind, kind);
  }
  await page.goto(`${origin}/?view=admin`);
  await expect(page.getByText("Question submission", { exact: true })).toBeVisible();
  await expect(page.getByText("Daily Challenge submission - Alpha", { exact: true })).toBeVisible();
  await expect(page.getByText("Question report", { exact: true })).toBeVisible();
  await expect(page.getByText("General suggestion", { exact: true })).toBeVisible();
  await page.screenshot({ path: join(dir, "admin-320.png"), fullPage: true });
  await page.getByRole("button", { name: "Resolve", exact: true }).first().click();
  await expect(page.getByText("Question submission", { exact: true })).toHaveCount(0);
  assert.deepEqual(errors, []);
  console.log(`PASS: daily submission link, four responsive layouts, required divisions, success/error/pending, sign-in guard, legacy feedback, and admin review/resolution. Screenshots: ${dir}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
