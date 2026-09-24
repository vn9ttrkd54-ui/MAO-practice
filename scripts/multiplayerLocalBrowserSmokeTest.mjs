import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

if (process.env.LIVE_MULTIPLAYER_SMOKE !== "1") {
  throw new Error("Set LIVE_MULTIPLAYER_SMOKE=1 to run the isolated browser test.");
}

const appUrl = (process.env.TARGET_URL ?? "http://localhost:3000").replace(/\/$/, "");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const marker = randomBytes(4).toString("hex");
const username = `smoke_${marker}`;
const password = randomBytes(24).toString("base64url");
let userId;
let roomId;
let browser;

function checked(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message} (${result.error.code ?? "unknown"})`);
  return result.data;
}

let testError;
try {
  const user = checked(await db.auth.admin.createUser({
    email: `${username}@example.invalid`, password, email_confirm: true,
    user_metadata: { username },
  }), "Create test account").user;
  assert.ok(user?.id);
  userId = user.id;

  browser = await chromium.launch({ headless: true });
  const host = await browser.newPage();
  const guest = await browser.newPage();

  await host.goto(`${appUrl}/multiplayer/create`);
  assert.ok(await host.getByText("Sign in to host a private room.", { exact: false }).isVisible());
  assert.equal(await host.getByRole("button", { name: "Create Room" }).count(), 0);
  console.log("PASS signed-out visitor cannot host");

  await host.goto(`${appUrl}/login`);
  await host.getByLabel("Username").fill(username);
  await host.getByLabel("Password").fill(password);
  await host.getByRole("button", { name: "Log in" }).click();
  await host.waitForURL(`${appUrl}/dashboard`, { timeout: 30_000 });
  await host.goto(`${appUrl}/multiplayer/create`);
  await host.getByRole("button", { name: "Create Room" }).click();
  await host.waitForURL(/\/multiplayer\/room\/[0-9a-f-]+$/, { timeout: 30_000 });
  roomId = new URL(host.url()).pathname.split("/").at(-1);
  assert.match(roomId, /^[0-9a-f-]{36}$/i);
  const room = checked(await db.from("multiplayer_rooms")
    .select("code,host_user_id").eq("id", roomId).single(), "Read browser-created room");
  assert.equal(room.host_user_id, userId);
  console.log("PASS local app creates an account-owned room");

  await host.goto(`${appUrl}/multiplayer/create`);
  await host.getByRole("button", { name: "Create Room" }).click();
  await host.getByRole("alert").getByText("Close or finish your current room", { exact: false }).waitFor({ timeout: 30_000 });
  console.log("PASS browser displays the active-room limit");

  await guest.goto(`${appUrl}/multiplayer`);
  await guest.getByLabel("Room code").fill(room.code);
  await guest.getByLabel("Guest nickname").fill("SmokeGuest");
  await guest.getByRole("button", { name: "Join Room" }).click();
  await guest.waitForURL(`${appUrl}/multiplayer/room/${roomId}`, { timeout: 30_000 });
  console.log("PASS signed-out guest joins the room");

  checked(await db.from("multiplayer_rooms").update({
    status: "completed", started_at: new Date().toISOString(), completed_at: new Date().toISOString(),
  }).eq("id", roomId), "Complete browser test room");
  checked(await db.rpc("finalize_multiplayer_match", { p_room_id: roomId }), "Finalize browser test room");
  const resultUrl = `${appUrl}/multiplayer/room/${roomId}/results`;
  await host.goto(resultUrl);
  await guest.goto(resultUrl);
  await host.getByRole("heading", { name: /You placed #/ }).waitFor({ timeout: 20_000 });
  await guest.getByRole("heading", { name: /You placed #/ }).waitFor({ timeout: 20_000 });

  let deleted = false;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const { data } = await db.from("multiplayer_rooms").select("id").eq("id", roomId).maybeSingle();
    if (!data) { deleted = true; break; }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(deleted, "Room should be deleted after both results are delivered");
  assert.ok(await host.getByRole("heading", { name: /You placed #/ }).isVisible());
  assert.ok(await guest.getByRole("heading", { name: /You placed #/ }).isVisible());
  assert.equal(checked(await db.from("multiplayer_match_history")
    .select("room_id").eq("room_id", roomId).eq("user_id", userId), "Read retained result").length, 1);
  const reopened = await host.goto(resultUrl);
  const resultReopened = await host.getByRole("heading", { name: /You placed #/ }).count();
  const notFoundVisible = await host.getByText(/could not be found|not found/i).count() > 0;
  assert.equal(resultReopened, 0, "A fresh visit must not render the old result page");
  assert.ok(reopened?.status() === 404 || notFoundVisible, "A fresh visit must show a not-found page");
  console.log("PASS result tabs survive deletion, history remains, and the URL cannot reopen");
} catch (error) {
  testError = error;
  console.error("FAIL", error.message);
} finally {
  if (browser) await browser.close();
  const cleanupErrors = [];
  if (roomId) {
    const { error } = await db.from("multiplayer_rooms").delete().eq("id", roomId);
    if (error) cleanupErrors.push(`Room ${roomId}: ${error.message}`);
  }
  if (userId) {
    const { error } = await db.auth.admin.deleteUser(userId);
    if (error) cleanupErrors.push(`Account ${userId}: ${error.message}`);
  }
  if (cleanupErrors.length) {
    console.error("TEST CLEANUP NEEDS ATTENTION", cleanupErrors.join("; "));
    process.exitCode = 1;
  } else {
    console.log("Temporary browser test data cleaned up.");
  }
  if (testError) process.exitCode = 1;
}
