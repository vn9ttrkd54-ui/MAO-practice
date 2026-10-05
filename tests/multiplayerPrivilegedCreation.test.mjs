import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const userId = "11111111-1111-4111-8111-111111111111";
const roomId = "22222222-2222-4222-8222-222222222222";
const settings = { division: "Mu", questionCount: 5, secondsPerQuestion: 90, mode: "unranked", difficultyBand: "2-4" };
function compile(file, dependencies = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, require: name => name in dependencies ? dependencies[name] : require(name) });
  return exports;
}
function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
function content(tree) {
  if (tree == null || typeof tree === "boolean") return "";
  if (Array.isArray(tree)) return tree.map(content).join("");
  return typeof tree === "object" ? content(tree.props?.children) : String(tree);
}
async function page({ role = "user", signedIn = true, roleError = false, roomsError = false,
  rooms = [{ id: roomId, visibility: "private", isHost: true, status: "waiting" }] } = {}) {
  const calls = [];
  const query = {
    select: column => { calls.push(["select", column]); return query; },
    eq: (column, value) => { calls.push(["eq", column, value]); return query; },
    maybeSingle: async () => ({ data: role === null ? null : { role }, error: roleError ? { message: "offline" } : null }),
  };
  const Page = compile("../app/multiplayer/create/page.tsx", {
    "next/link": { default: "test-link" }, "next/navigation": { unstable_rethrow() {} },
    "lucide-react": Object.fromEntries(["ArrowUpRight", "Hash", "Layers", "LockKeyhole", "Timer", "Trophy", "Users"].map(name => [name, "test-icon"])),
    "@/app/multiplayer/actions": { createPrivateRoomAction() {} },
    "@/components/multiplayer/PendingSubmitButton": { default: "pending-submit" },
    "@/components/multiplayer/PrivateRoomRecovery": { default: "recovery" },
    "@/components/multiplayer/RankTheme": { rankPageClass: () => "rank-novice" },
    "@/lib/auth/roles": compile("../lib/auth/roles.ts"),
    "@/lib/supabase/server": { createClient: async () => ({
      auth: { getUser: async () => ({ data: { user: signedIn ? { id: userId, user_metadata: { role: "owner" } } : null } }) },
      from: table => { calls.push(["from", table]); return query; },
    }) },
    "@/lib/services/multiplayerService": { getMultiplayerProfile: async () => null,
      listMyActiveMultiplayerRooms: async () => { if (roomsError) throw new Error("offline"); return rooms; } },
    "./create.module.css": { default: {} },
  }).default;
  const tree = await Page({ searchParams: Promise.resolve({}) });
  return { tree, calls, button: nodes(tree).find(n => n.type === "pending-submit") };
}

test("admins and owners can create while hosting a waiting, countdown, or running game", async () => {
  for (const role of ["admin", "owner"]) for (const status of ["waiting", "countdown", "in-progress"]) {
    const f = await page({ role, rooms: [{ id: roomId, visibility: "private", isHost: true, status }] });
    assert.equal(f.button.props.disabled, false);
    assert.match(content(f.tree), /unlimited rooms, including multiple active private rooms/);
    assert.deepEqual(f.calls, [["from", "profiles"], ["select", "role"], ["eq", "id", userId]]);
    assert.equal(nodes(f.tree).find(n => n.type === "recovery").props.rooms.length, 1);
    if (status === "in-progress") assert.match(content(f.tree), /Rejoin Game/);
  }
});
test("normal, missing and unknown roles remain limited; metadata cannot claim exemption", async () => {
  for (const role of ["user", null, "moderator", "ADMIN"]) {
    const f = await page({ role });
    assert.equal(f.button.props.disabled, true);
    assert.doesNotMatch(content(f.tree), /unlimited rooms/);
    assert.match(content(f.tree), /3 rooms every 10 minutes/);
  }
  assert.equal((await page({ rooms: [] })).button.props.disabled, false);
  assert.equal((await page({ rooms: [{ visibility: "private", isHost: false }] })).button.props.disabled, false);
  assert.equal((await page({ rooms: [{ visibility: "public", isHost: true }] })).button.props.disabled, false);
});
test("role lookup errors fail closed and room lookup errors keep the retry guard", async () => {
  assert.equal((await page({ role: "owner", roleError: true })).button.props.disabled, true);
  const f = await page({ role: "admin", roomsError: true });
  assert.equal(f.button.props.disabled, true);
  assert.match(content(f.tree), /Unable to check your existing rooms/);
  const anon = await page({ signedIn: false });
  assert.equal(anon.button, undefined); assert.deepEqual(anon.calls, []);
});
test("creation action never forwards a browser-supplied role, exemption, or user ID", async () => {
  const calls = [];
  const action = compile("../app/multiplayer/actions.ts", {
    "next/navigation": { redirect: url => { throw new Error(`REDIRECT ${url}`); } },
    "next/cache": { revalidatePath() {} },
    "@/lib/services/multiplayerService": { createPrivateRoom: async input => { calls.push(input); return { id: roomId }; } },
  });
  const form = new FormData();
  for (const [key, value] of Object.entries({ ...settings, userId: "another-account", role: "owner", creation_limit_exempt: "true" })) form.set(key, value);
  await assert.rejects(action.createPrivateRoomAction(form), /REDIRECT/);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [{ settings }]);
});

function service({ signedIn = true, rpcError = null } = {}) {
  const calls = [];
  const admin = { rpc: async (name, args) => { calls.push({ name, args }); return { data: roomId, error: rpcError }; },
    from: () => { const q = { select: () => q, eq: () => q, single: async () => ({ data: {
      id: roomId, created_at: new Date().toISOString(), capacity: 30, visibility: "private",
      creation_limit_exempt: true, host_user_id: userId,
    }, error: null }) }; return q; } };
  return { calls, api: compile("../lib/services/multiplayerService.ts", {
    "server-only": {}, "next/headers": {}, "@/lib/auth/publicNames": {}, "@/lib/security/request": {},
    "@/data/questions": { questions: Array.from({ length: 5 }, (_, id) => ({ id, division: "Mu", difficulty: 3 })) },
    "@/lib/supabase/admin": { createAdminClient: () => admin },
    "@/lib/supabase/server": { createClient: async () => ({ auth: { getUser: async () => ({ data: {
      user: signedIn ? { id: userId, user_metadata: { role: "owner" } } : null,
    } }) } }) },
  }) };
}
test("server supplies verified identity, no role override, and returns no internal exemption field", async () => {
  const f = service();
  const room = await f.api.createPrivateRoom({ settings, userId: "attacker", role: "owner", creation_limit_exempt: true });
  assert.equal(f.calls[0].name, "create_private_multiplayer_room");
  assert.equal(f.calls[0].args.p_user_id, userId);
  assert.deepEqual(Object.keys(f.calls[0].args).sort(), ["p_code", "p_difficulty_band", "p_division", "p_mode", "p_question_count", "p_seconds_per_question", "p_user_id"]);
  assert.equal(room.capacity, 30); assert.equal("creation_limit_exempt" in room, false);
  const anon = service({ signedIn: false });
  await assert.rejects(anon.api.createPrivateRoom({ settings }), /Sign in/); assert.equal(anon.calls.length, 0);
});
test("settings validation and database denials cannot be bypassed by claimed privileged roles", async () => {
  for (const overrides of [{ questionCount: 31 }, { secondsPerQuestion: 240 }, { difficultyBand: "1-5" }, { mode: "ranked", questionCount: 1 }]) {
    const f = service();
    await assert.rejects(f.api.createPrivateRoom({ settings: { ...settings, ...overrides }, role: "owner" }));
    assert.equal(f.calls.length, 0);
  }
  const f = service({ rpcError: { code: "P0001", message: "Close or finish your current room before creating another." } });
  await assert.rejects(f.api.createPrivateRoom({ settings }), /Close or finish/);
  assert.equal(f.calls.length, 1);
});
