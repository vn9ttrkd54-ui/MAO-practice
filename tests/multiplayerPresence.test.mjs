import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../lib/services/multiplayerService.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const now = Date.parse("2026-09-30T12:00:00Z");
const timestamp = (age) => new Date(now - age).toISOString();
const player = (id, age = 0, connected = true) => ({
  id, room_id: "room", user_id: id, connected, updated_at: timestamp(age),
  joined_at: timestamp(60_000), left_at: null, guest_nickname: null, is_host: false,
  score: 0, placement: null, has_submitted_current_question: false,
});

function fixture({ players = [player("me", 60_000)], status = "waiting", capacity = 20, race = false, fail = null } = {}) {
  const room = {
    id: "room", visibility: "public", mode: "ranked", division: "Mu", code: null,
    question_count: 5, seconds_per_question: 60, status, capacity, host_player_id: null,
    countdown_ends_at: timestamp(-60_000), created_at: timestamp(120_000), started_at: status === "in-progress" ? timestamp(5_000) : null,
    current_question_number: 1, state_version: 1,
  };
  const tables = {
    multiplayer_rooms: [room], multiplayer_players: players,
    profiles: players.map(p => ({ id: p.user_id, username: p.id })),
    multiplayer_profiles: players.map(p => ({ user_id: p.user_id, rp: 0 })),
  };
  const calls = [];
  let raced = false;
  const admin = { from(table) {
    const filters = [];
    let values, columns, head = false;
    const matches = row => filters.every(([op, key, value]) => {
      if (op === "eq" || op === "is") return row[key] === value;
      if (op === "in") return value.includes(row[key]);
      if (op === "lt") return row[key] < value;
      if (op === "gte") return row[key] >= value;
      throw new Error(`Unknown filter ${op}`);
    });
    function execute(single = false) {
      const call = { table, values, columns, head, filters };
      calls.push(call);
      if (fail?.(call)) return { error: { message: "Test database failure" }, data: null, count: null };
      if (race && !raced && table === "multiplayer_players" && values?.connected === true) {
        raced = true;
        players[0].updated_at = timestamp(0);
      }
      const rows = tables[table].filter(matches);
      if (values) for (const row of rows) Object.assign(row, values, { updated_at: timestamp(0) });
      return { data: head ? null : single ? rows[0] ?? null : rows, count: rows.length, error: null };
    }
    const query = {
      select(next, options) { columns = next; head = options?.head ?? false; return query; },
      update(next) { values = next; return query; },
      order() { return query; },
      maybeSingle() { return Promise.resolve(execute(true)); },
      single() { return Promise.resolve(execute(true)); },
      then(resolve, reject) { return Promise.resolve(execute()).then(resolve, reject); },
    };
    for (const op of ["eq", "is", "in", "lt", "gte"]) query[op] = (key, value) => { filters.push([op, key, value]); return query; };
    return query;
  } };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    Date: class extends Date { static now() { return now; } },
    require(name) {
      if (name === "server-only") return {};
      if (name === "@/lib/auth/publicNames") return { isPublicNameAllowed: () => true, PUBLIC_NAME_ERROR: "Name is not allowed." };
      if (name === "next/headers") return { cookies: async () => ({ get: () => undefined }) };
      if (name === "@/data/questions") return { questions: [] };
      if (name === "@/lib/security/request") return { RequestBodyError: class extends Error {} };
      if (name === "@/lib/multiplayerTiming") return { QUESTION_PREPARATION_TIMEOUT_MS: 15_000 };
      if (name === "@/lib/supabase/admin") return { createAdminClient: () => admin };
      if (name === "@/lib/supabase/server") return { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "me" } } }) } }) };
      return require(name);
    },
  });
  return { service: exports, calls, players, room };
}

// Atomic expiry, capacity and racing transitions are tested against PostgreSQL
// in multiplayerLobby.database.mjs, rather than simulated by this query mock.

test("public directory and personal lobby list use the same freshness window", async () => {
  const f = fixture({ players: [player("me", 60_000), player("fresh", 15_000)] });
  const rooms = await f.service.listPublicRooms();
  assert.equal(rooms[0].playerCount, 1);
  assert.equal(rooms[0].players[0].playerId, "fresh");
  assert.equal((await f.service.listMyActiveMultiplayerRooms()).length, 0);
});

test("active matches retain stale members and remain rejoinable", async () => {
  const f = fixture({ status: "in-progress" });
  assert.equal((await f.service.listMyActiveMultiplayerRooms()).length, 1);
  assert.equal(f.calls.some(c => c.values), false);
});
