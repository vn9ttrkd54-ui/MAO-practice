import { chromium } from "@playwright/test";

const roomCode = process.argv[2]?.trim().toUpperCase();
const playerCount = Number(process.argv[3] ?? 15);
const baseUrl = (process.env.TARGET_URL ?? "http://localhost:3000").replace(/\/$/, "");
const joinTimeoutMs = 45_000;
const matchTimeoutMs = 20 * 60_000;

if (!roomCode || !/^[A-Z0-9]{8}$/.test(roomCode)) {
  console.error("Usage: npm run test:multiplayer-browser -- ROOMCODE [PLAYER_COUNT]");
  process.exit(1);
}
if (!Number.isInteger(playerCount) || playerCount < 1 || playerCount > 30) {
  console.error("PLAYER_COUNT must be between 1 and 30.");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const players = [];
const failures = [];
const startedAt = Date.now();

function elapsed() {
  return `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;
}

async function joinPlayer(index) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const name = `LoadTest${String(index + 1).padStart(2, "0")}`;
  page.on("pageerror", (error) => failures.push(`${name}: page error: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 500) failures.push(`${name}: HTTP ${response.status()} from ${response.url()}`);
  });

  await page.goto(`${baseUrl}/multiplayer`, { waitUntil: "domcontentloaded", timeout: joinTimeoutMs });
  await page.getByLabel("Room code").fill(roomCode);
  await page.getByLabel("Guest nickname").fill(name);
  await page.getByRole("button", { name: "Join Room" }).click();
  await page.waitForURL(/\/multiplayer\/room\//, { timeout: joinTimeoutMs });
  players.push({ context, page, name, questionLoads: [] });
  console.log(`[${elapsed()}] ${name} joined`);
}

async function runPlayer(player) {
  const { page, name } = player;
  let lastQuestion = 0;
  const deadline = Date.now() + matchTimeoutMs;

  while (Date.now() < deadline) {
    const results = page.getByRole("heading", { name: /You placed|Final results/ });
    if (await results.isVisible().catch(() => false)) {
      console.log(`[${elapsed()}] ${name} reached final results`);
      return;
    }

    const heading = page.getByRole("heading", { name: /Question \d+ of \d+/ });
    if (await heading.isVisible().catch(() => false)) {
      const text = await heading.textContent();
      const questionNumber = Number(text?.match(/Question (\d+)/)?.[1] ?? 0);
      if (questionNumber > lastQuestion) {
        lastQuestion = questionNumber;
        const timer = await page.getByText(/^\d+s$/).first().textContent().catch(() => "unknown");
        player.questionLoads.push({ questionNumber, timer, atMs: Date.now() - startedAt });
        console.log(`[${elapsed()}] ${name} loaded question ${questionNumber} at ${timer}`);

        const answer = page.getByRole("button", { name: /^A(?:\.|\s)/ }).first();
        await answer.waitFor({ state: "visible", timeout: 15_000 });
        await answer.click();
        const submissionResponse = page.waitForResponse((response) =>
          response.request().method() === "POST"
            && response.url().includes(`/api/multiplayer/rooms/`)
            && response.url().endsWith("/round"),
        { timeout: 30_000 });
        await page.getByRole("button", { name: "Submit Answer" }).click();
        const response = await submissionResponse;
        if (!response.ok()) {
          const responseText = await response.text().catch(() => "No response details");
          throw new Error(`Question ${questionNumber} submission returned HTTP ${response.status()}: ${responseText}`);
        }
        console.log(`[${elapsed()}] ${name} submitted question ${questionNumber}`);
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error("Timed out before reaching final results.");
}

try {
  console.log(`Opening ${playerCount} isolated players at ${baseUrl} for room ${roomCode}.`);
  for (let index = 0; index < playerCount; index += 1) {
    await joinPlayer(index);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\nAll simulated players joined. Start the game from your host window.\n`);
  const outcomes = await Promise.allSettled(players.map(runPlayer));
  outcomes.forEach((outcome, index) => {
    if (outcome.status === "rejected") failures.push(`${players[index].name}: ${outcome.reason?.message ?? outcome.reason}`);
  });

  console.log(`\nCompleted players: ${outcomes.filter((outcome) => outcome.status === "fulfilled").length}/${playerCount}`);
  console.log("Question delivery summary:");
  const questionNumbers = [...new Set(players.flatMap((player) => player.questionLoads.map((load) => load.questionNumber)))];
  for (const questionNumber of questionNumbers) {
    const loads = players.flatMap((player) => player.questionLoads.filter((load) => load.questionNumber === questionNumber));
    const timers = loads.map((load) => Number.parseInt(load.timer, 10)).filter(Number.isFinite);
    const timerRange = timers.length > 0 ? `${Math.min(...timers)}s-${Math.max(...timers)}s` : "unknown";
    console.log(`Question ${questionNumber}: ${loads.length}/${playerCount} loaded; timer range ${timerRange}`);
  }
  if (failures.length > 0) {
    console.error(`Failures (${failures.length}):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log("No browser or server failures detected.");
  }
} finally {
  await Promise.all(players.map(({ context }) => context.close()));
  await browser.close();
}
