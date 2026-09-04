import { randomUUID } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !publishableKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required.");
}

function readInteger(name, fallback, minimum, maximum) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return value;
}

const roomCount = readInteger("LOAD_TEST_ROOMS", 2, 1, 10);
const playersPerRoom = readInteger("LOAD_TEST_PLAYERS_PER_ROOM", 5, 1, 20);
const eventsPerRoom = readInteger("LOAD_TEST_EVENTS_PER_ROOM", 3, 1, 10);
const connectionCount = roomCount * playersPerRoom;

if (connectionCount > 200) {
  throw new Error("The load test is capped at 200 simultaneous connections.");
}

const runId = randomUUID();
const clients = [];
const channelsByRoom = Array.from({ length: roomCount }, () => []);
const deliveries = new Map();
const latencies = [];

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function subscribe(channel) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("A Realtime connection timed out.")), 15_000);
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);
        resolve();
      } else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
        clearTimeout(timeout);
        reject(new Error(`Realtime connection failed with status ${status}.`));
      }
    });
  });
}

async function waitForDeliveries(expected, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (deliveries.size < expected && Date.now() < deadline) await sleep(50);
}

console.log(`Opening ${connectionCount} isolated Realtime connections across ${roomCount} rooms...`);

try {
  for (let roomIndex = 0; roomIndex < roomCount; roomIndex += 1) {
    const topic = `multiplayer-load-test:${runId}:room-${roomIndex + 1}`;
    for (let playerIndex = 0; playerIndex < playersPerRoom; playerIndex += 1) {
      const client = createClient(supabaseUrl, publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false },
        realtime: { params: { eventsPerSecond: 5 } },
      });
      const receiverId = `${roomIndex}:${playerIndex}`;
      const channel = client
        .channel(topic, { config: { broadcast: { self: true } } })
        .on("broadcast", { event: "probe" }, ({ payload }) => {
          const deliveryId = `${receiverId}:${payload.sequence}`;
          if (deliveries.has(deliveryId)) return;
          deliveries.set(deliveryId, true);
          latencies.push(Date.now() - payload.sentAt);
        });

      clients.push(client);
      channelsByRoom[roomIndex].push(channel);
      await subscribe(channel);
      await sleep(60);
    }
  }

  console.log("All test players connected. Sending synchronized room events...");
  for (let sequence = 1; sequence <= eventsPerRoom; sequence += 1) {
    for (const channels of channelsByRoom) {
      const response = await channels[0].send({
        type: "broadcast",
        event: "probe",
        payload: { sequence, sentAt: Date.now() },
      });
      if (response !== "ok") throw new Error(`A test broadcast failed: ${response}`);
    }
    await sleep(500);
  }

  const expectedDeliveries = roomCount * playersPerRoom * eventsPerRoom;
  await waitForDeliveries(expectedDeliveries, 10_000);
  const receivedDeliveries = deliveries.size;
  const deliveryRate = expectedDeliveries === 0 ? 100 : receivedDeliveries / expectedDeliveries * 100;
  const sortedLatencies = [...latencies].sort((a, b) => a - b);
  const percentile95 = sortedLatencies[Math.max(0, Math.ceil(sortedLatencies.length * 0.95) - 1)] ?? 0;
  const maximumLatency = sortedLatencies.at(-1) ?? 0;

  console.log(`Connections: ${connectionCount}/${connectionCount}`);
  console.log(`Deliveries: ${receivedDeliveries}/${expectedDeliveries} (${deliveryRate.toFixed(1)}%)`);
  console.log(`Realtime latency: p95 ${percentile95}ms, maximum ${maximumLatency}ms`);

  if (deliveryRate < 99) process.exitCode = 1;
} finally {
  await Promise.all(clients.map(async (client) => {
    await client.removeAllChannels();
    client.realtime.disconnect();
  }));
}
