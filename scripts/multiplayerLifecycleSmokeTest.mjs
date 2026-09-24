import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

if (process.env.LIVE_MULTIPLAYER_SMOKE !== "1") {
  throw new Error("Set LIVE_MULTIPLAYER_SMOKE=1 to run the isolated hosted test.");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Supabase URL and secret key are required.");

const db = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const marker = randomBytes(4).toString("hex");
const createdUsers = [];
const createdRooms = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const code = () => randomBytes(4).toString("hex").toUpperCase();

function checked(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message} (${result.error.code ?? "unknown"})`);
  return result.data;
}

async function createUser(suffix) {
  const data = checked(await db.auth.admin.createUser({
    email: `smoke_${marker}_${suffix}@example.invalid`,
    password: randomBytes(24).toString("base64url"),
    email_confirm: true,
    user_metadata: { username: `smoke_${marker}_${suffix}` },
  }), "Create test account");
  assert.ok(data.user?.id);
  createdUsers.push(data.user.id);
  return data.user.id;
}

async function createRoom(userId) {
  const roomId = checked(await db.rpc("create_private_multiplayer_room", {
    p_user_id: userId,
    p_code: code(),
    p_mode: "unranked",
    p_division: "Mu",
    p_question_count: 5,
    p_seconds_per_question: 60,
  }), "Create test room");
  assert.match(roomId, /^[0-9a-f-]{36}$/i);
  createdRooms.push(roomId);
  return roomId;
}

async function readRoom(roomId) {
  return checked(await db.from("multiplayer_rooms").select("id,host_player_id,status").eq("id", roomId).maybeSingle(), "Read test room");
}

let testError;
try {
  const [hostId, secondUserId] = [await createUser("a"), await createUser("b")];
  const roomId = await createRoom(hostId);
  const hostPlayerId = (await readRoom(roomId)).host_player_id;
  assert.ok(hostPlayerId);

  const duplicate = await db.rpc("create_private_multiplayer_room", {
    p_user_id: hostId,
    p_code: code(),
    p_mode: "unranked",
    p_division: "Mu",
    p_question_count: 5,
    p_seconds_per_question: 60,
  });
  assert.equal(duplicate.error?.code, "P0001", "A second active hosted room must be refused");
  console.log("PASS one active hosted room per account");

  const secondPlayer = checked(await db.from("multiplayer_players")
    .insert({ room_id: roomId, user_id: secondUserId }).select("id").single(), "Join second account");
  const playerIds = [hostPlayerId, secondPlayer.id];
  for (let index = 1; index <= 28; index += 1) {
    const player = checked(await db.from("multiplayer_players").insert({
      room_id: roomId,
      guest_nickname: `Smoke${index}`,
      reconnect_token_hash: `smoke-${marker}-${index}`,
    }).select("id").single(), `Join guest ${index}`);
    playerIds.push(player.id);
  }
  const extra = await db.from("multiplayer_players").insert({
    room_id: roomId, guest_nickname: "ExtraSmoke", reconnect_token_hash: `smoke-${marker}-extra`,
  });
  assert.equal(extra.error?.code, "P0001", "Player 31 must be refused");
  console.log("PASS 30-player capacity and player 31 rejection");

  checked(await db.from("multiplayer_rooms").update({
    status: "completed",
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  }).eq("id", roomId), "Complete test room");
  checked(await db.rpc("finalize_multiplayer_match", { p_room_id: roomId }), "Finalize test room");
  const results = checked(await db.from("multiplayer_match_results")
    .select("player_id,user_id").eq("room_id", roomId), "Read finalized results");
  assert.equal(results.length, 30);
  const history = checked(await db.from("multiplayer_match_history")
    .select("user_id").eq("room_id", roomId), "Read retained history");
  assert.equal(history.length, 2);
  console.log("PASS 30 finalized results and compact account history");

  for (let index = 0; index < playerIds.length; index += 1) {
    assert.equal(checked(await db.rpc("acknowledge_multiplayer_result", {
      p_room_id: roomId, p_player_id: playerIds[index],
    }), `Acknowledge player ${index + 1}`), true);
    if (index === playerIds.length - 2) assert.ok(await readRoom(roomId));
  }
  assert.equal(await readRoom(roomId), null);
  assert.equal(checked(await db.from("multiplayer_match_history")
    .select("user_id").eq("room_id", roomId), "Read history after room deletion").length, 2);
  console.log("PASS room deleted after final receipt; account history retained");

  for (let attempt = 2; attempt <= 3; attempt += 1) {
    const nextRoom = await createRoom(hostId);
    checked(await db.from("multiplayer_rooms").delete().eq("id", nextRoom), "Close test room");
  }
  const limited = await db.rpc("create_private_multiplayer_room", {
    p_user_id: hostId,
    p_code: code(),
    p_mode: "unranked",
    p_division: "Mu",
    p_question_count: 5,
    p_seconds_per_question: 60,
  });
  assert.equal(limited.error?.code, "P0001", "Fourth creation in ten minutes must be refused");
  console.log("PASS three creations per rolling ten minutes");

  const staleRoom = await createRoom(secondUserId);
  checked(await db.from("multiplayer_players").update({ connected: false }).eq("room_id", staleRoom), "Disconnect stale test host");
  checked(await db.from("multiplayer_rooms").update({
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  }).eq("id", staleRoom), "Age stale test room");
  let expired = false;
  for (let attempt = 0; attempt < 18; attempt += 1) {
    if ((await readRoom(staleRoom)) === null) { expired = true; break; }
    await sleep(5_000);
  }
  assert.ok(expired, "The scheduled cleanup did not remove the stale room within 90 seconds");
  console.log("PASS scheduled cleanup of an abandoned private room");
} catch (error) {
  testError = error;
  console.error("FAIL", error.message);
} finally {
  const cleanupErrors = [];
  for (const roomId of createdRooms) {
    const { error } = await db.from("multiplayer_rooms").delete().eq("id", roomId);
    if (error) cleanupErrors.push(`Room ${roomId}: ${error.message}`);
  }
  for (const userId of createdUsers) {
    const { error } = await db.auth.admin.deleteUser(userId);
    if (error) cleanupErrors.push(`Account ${userId}: ${error.message}`);
  }
  if (cleanupErrors.length) {
    console.error("TEST CLEANUP NEEDS ATTENTION", cleanupErrors.join("; "));
    process.exitCode = 1;
  } else {
    console.log("Temporary test rooms and accounts cleaned up.");
  }
  if (testError) process.exitCode = 1;
}
