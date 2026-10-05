import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const dir = await mkdtemp(join(tmpdir(), "podium-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = require("next/dist/compiled/webpack/webpack").webpack({
  mode: "development", entry: fixture("results.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "next/link": fixture("link.tsx"), "next/image": fixture("image.tsx"), "@": resolve(import.meta.dirname, "..") } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript" : "text/html");
  res.end(req.url === "/client.js" ? bundle : '<style>body{margin:0;font-family:Arial}.sr-only{position:absolute;clip:rect(0,0,0,0)}</style><div id="root"></div><script src="/client.js"></script>');
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [], reports = [];
  page.on("pageerror", e => errors.push(e.message));
  let fail = true;
  await page.route("**/api/feedback", async route => {
    reports.push(route.request().postDataJSON());
    if (fail) { fail = false; return route.abort(); }
    return route.fulfill({ json: { success: true } });
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForTimeout(200);
  assert.deepEqual(errors, []);
  assert.equal(await page.getByText("Final totals, with the last question’s result below each player.", { exact: true }).count(), 0);
  await page.getByRole("heading", { name: "Final leaderboard", exact: true }).waitFor();
  for (const number of [1, 2]) await page.getByText(`Report an error · Question ${number}`, { exact: true }).click();
  const boxes = page.getByRole("textbox");
  assert.equal(await boxes.count(), 2);
  assert.notEqual(await boxes.nth(0).getAttribute("id"), await boxes.nth(1).getAttribute("id"));
  await boxes.nth(0).fill("The solution has an incorrect calculation.");
  await page.getByRole("button", { name: "Submit", exact: true }).nth(0).click();
  await page.getByText("Unable to submit feedback. Please check your connection and try again.").waitFor();
  await page.getByRole("button", { name: "Submit", exact: true }).nth(0).click();
  await page.getByText("Thank you—your feedback was submitted.").waitFor();
  await boxes.last().fill("This question has an unclear answer choice.");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll("textarea").length === 0);
  assert.equal(reports.length, 3);
  assert.equal(reports[0].questionId, reports[1].questionId);
  assert.notEqual(reports[1].questionId, reports[2].questionId);
  assert.ok(reports.every(r => r.kind === "question_report" && r.division));
  assert.deepEqual(errors, []);
  console.log("PASS: each reviewed question has its own report box, distinct question IDs and labels, network-failure retry, and successful confirmation.");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
