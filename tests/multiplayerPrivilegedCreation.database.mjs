// Real migrations in ephemeral PostgreSQL. No hosted database or credentials.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const migration = name => readFile(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
let checks = 0;
const check = async (name, run) => { await run(); checks++; console.log(`PASS ${name}`); };
const code = () => randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
const create = (user, roomCode = code(), legacy = false) => scalar(
  `select create_private_multiplayer_room($1,$2,'unranked','Mu',1,90${legacy ? "" : ",'2-4'"})`, [user, roomCode]);
const user = async (role = "user") => {
  const id = randomUUID();
  await db.query("insert into auth.users values($1)", [id]);
  await db.query("insert into profiles(id,username,role) values($1,'Test',$2)", [id, role]);
  return id;
};
const close = (room, owner) => scalar("select close_owned_private_multiplayer_lobby($1,$2)", [room, owner]);
const rows = async () => Promise.all(["multiplayer_rooms", "multiplayer_players", "multiplayer_match_questions",
  "multiplayer_submissions", "multiplayer_match_results", "multiplayer_profiles", "multiplayer_match_history",
  "profiles", "multiplayer_room_creations"].map(async table =>
  (await db.query(`select to_jsonb(t) - 'creation_limit_exempt' as row from ${table} t order by to_jsonb(t)::text`)).rows));
const runAs = async (role, run) => {
  await db.exec(`set role ${role}`);
  try { return await run(); } finally { await db.exec("reset role"); }
};

try {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
    grant usage on schema auth to authenticated;
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create function auth.role() returns text language sql as $$ select current_setting('request.jwt.claim.role',true) $$;
    create table public.profiles(id uuid primary key, username text, role text not null default 'user' check(role in ('user','admin','owner')));
    create unique index profiles_one_owner on profiles(role) where role='owner';
    create function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=clock_timestamp(); return new; end;$$;
    create schema realtime; create table realtime.test_events(payload jsonb);
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as
    $$insert into realtime.test_events values(payload)$$;`);
  // Apply the existing real role-protection trigger without unrelated feedback fixtures.
  const roles = await migration("013_feedback_account_admin");
  await db.exec(roles.slice(roles.indexOf("create or replace function public.protect_profile_role"), roles.indexOf("create table public.feedback_requests")));
  await db.exec("select set_config('request.jwt.claim.role','service_role',false)");
  const schema = await migration("009_multiplayer_pack_m2_schema");
  await db.exec(schema.slice(0, schema.indexOf("-- Row Level Security")) + "\ncommit;");
  await db.exec(schema.slice(schema.indexOf("-- Row Level Security"), schema.indexOf("-- Realtime is limited")));
  await db.exec(`alter table multiplayer_spectators add column last_seen_at timestamptz default clock_timestamp();
    grant select on multiplayer_players to authenticated;`);
  for (const name of ["022_multiplayer_realtime_foundation", "023_multiplayer_realtime_signal_filter",
    "024_multiplayer_atomic_round_transitions", "025_fix_multiplayer_transition_timestamp",
    "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery", "028_fix_multiplayer_state_trigger",
    "029_preload_multiplayer_questions", "030_confirm_preloaded_round_before_reveal", "031_multiplayer_atomic_submissions",
    "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots", "034_multiplayer_database_worker",
    "036_multiplayer_readiness_countdown", "037_multiplayer_balanced_rp", "040_multiplayer_authoritative_scoring_clock",
    "047_multiplayer_host_account_deletion", "049_multiplayer_room_lifecycle", "051_multiplayer_confirmed_lobby_transitions",
    "059_multiplayer_room_settings", "060_multiplayer_lobby_ready", "061_multiplayer_scoring_give_up",
    "062_multiplayer_round_feedback", "063_multiplayer_lobby_recovery", "064_multiplayer_fast_handoffs"]) await db.exec(await migration(name));

  // Preserve a pre-migration lobby and a completed game with real answers/history.
  const oldUser = await user(), oldRoom = await create(oldUser);
  const doneUser = await user(), done = await create(doneUser), second = await user();
  await db.query("insert into multiplayer_players(room_id,user_id) values($1,$2)", [done, second]);
  await scalar("select start_multiplayer_lobby($1,$2,null,array[101],array[3],0)", [done, doneUser]);
  await db.query("update multiplayer_match_questions set started_at=clock_timestamp()-interval '10 seconds',ends_at=clock_timestamp()+interval '85 seconds',hard_ends_at=clock_timestamp()+interval '85 seconds' where room_id=$1", [done]);
  const players = (await db.query("select id,is_host from multiplayer_players where room_id=$1", [done])).rows;
  for (const p of players) await scalar("select accept_multiplayer_answer($1,$2,101,$3,$4)", [done, p.id, p.is_host ? "A" : null, p.is_host]);
  await scalar("select finalize_multiplayer_match($1)", [done]);
  const before = await rows();
  const definitions = async () => (await db.query(`select oid::regprocedure::text name,prosrc,proacl,prosecdef,proconfig
    from pg_proc where pronamespace='public'::regnamespace and proname <> 'create_private_multiplayer_room' order by 1`)).rows;
  const policies = async () => (await db.query("select * from pg_policies where schemaname='public' order by tablename,policyname")).rows;
  const beforeDefinitions = await definitions(), beforePolicies = await policies();
  await db.exec(await migration("065_multiplayer_privileged_creation"));

  await check("migration preserves every existing row, unrelated function, and RLS policy", async () => {
    assert.deepEqual(await rows(), before);
    assert.deepEqual(await definitions(), beforeDefinitions);
    assert.deepEqual(await policies(), beforePolicies);
    assert.equal(await scalar("select count(*)::int from multiplayer_rooms where creation_limit_exempt"), 0);
  });
  await check("ordinary users still have one active room in every active status", async () => {
    for (const status of ["waiting", "countdown", "in-progress"]) {
      await db.query("update multiplayer_rooms set status=$2 where id=$1", [oldRoom, status]);
      await assert.rejects(create(oldUser), /Close or finish/);
    }
    await db.query("update multiplayer_rooms set status='waiting',host_user_id=null where id=$1", [oldRoom]);
    await assert.rejects(create(oldUser), /Close or finish/, "legacy host memberships still block creation");
  });
  await check("ordinary users can create three closed rooms but not four in ten minutes", async () => {
    const u = await user();
    for (let i = 0; i < 3; i++) assert.equal(await close(await create(u), u), "closed");
    const before = await rows();
    await assert.rejects(create(u), /3 rooms every 10 minutes/);
    assert.deepEqual(await rows(), before, "denial leaves no partial room, player or ledger row");
    await db.query("update multiplayer_room_creations set created_at=clock_timestamp()-interval '11 minutes' where user_id=$1", [u]);
    assert.ok(await create(u));
  });
  for (const role of ["admin", "owner"]) await check(`${role} can create more than three simultaneous rooms; ownership and capacity remain`, async () => {
    const u = await user(role), ids = [];
    for (let i = 0; i < 5; i++) {
      ids.push(await runAs("service_role", () => create(u, code(), i === 4)));
      if (i < 2) await db.query("update multiplayer_rooms set status=$2 where id=$1", [ids[i], i === 0 ? "countdown" : "in-progress"]);
    }
    const result = (await db.query(`select r.id,r.capacity,r.creation_limit_exempt,r.host_user_id,p.user_id,p.is_host
      from multiplayer_rooms r join multiplayer_players p on p.id=r.host_player_id where r.id=any($1)`, [ids])).rows;
    assert.equal(result.length, 5);
    for (const room of result) {
      assert.equal(room.capacity, 30); assert.equal(room.creation_limit_exempt, true);
      assert.equal(room.host_user_id, u); assert.equal(room.user_id, u); assert.equal(room.is_host, true);
    }
    assert.equal(await scalar("select count(*)::int from multiplayer_room_creations where user_id=$1", [u]), 5);
    const others = () => scalar("select jsonb_agg(to_jsonb(r) order by id) from multiplayer_rooms r where host_user_id=$1 and id<>$2", [u, ids[2]]);
    const beforeClose = await others();
    assert.equal(await close(ids[2], u), "closed");
    assert.deepEqual(await others(), beforeClose, "closing one room leaves the host's other rooms untouched");
  });
  await check("promotion works with an existing ordinary room; demotion restores both limits without closing games", async () => {
    const u = await user(), first = await create(u);
    await db.query("update profiles set role='admin' where id=$1", [u]);
    const ids = [first, await create(u), await create(u), await create(u)];
    assert.equal(await scalar("select creation_limit_exempt from multiplayer_rooms where id=$1", [first]), false);
    await db.query("update profiles set role='user' where id=$1", [u]);
    const before = await rows();
    await assert.rejects(create(u), /Close or finish/); assert.deepEqual(await rows(), before);
    for (const id of ids) assert.equal(await close(id, u), "closed");
    await assert.rejects(create(u), /3 rooms every 10 minutes/);
    await db.query("update multiplayer_room_creations set created_at=clock_timestamp()-interval '11 minutes' where user_id=$1", [u]);
    const room = await create(u);
    assert.equal(await scalar("select creation_limit_exempt from multiplayer_rooms where id=$1", [room]), false);
  });
  await check("demoted creators cannot bypass an active exempt room by leaving its membership", async () => {
    const u = await user("admin"), room = await create(u);
    await db.query("update multiplayer_players set left_at=clock_timestamp(),connected=false where room_id=$1", [room]);
    await db.query("update profiles set role='user' where id=$1", [u]);
    await assert.rejects(create(u), /Close or finish/);
  });
  await check("ordinary-room uniqueness backstop remains and concurrent attempts cannot produce duplicates", async () => {
    const u = await user();
    const results = await Promise.allSettled([create(u), create(u)]);
    assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
    assert.match(results.find(r => r.status === "rejected").reason.message, /Close or finish/);
    await assert.rejects(db.query(`insert into multiplayer_rooms(code,visibility,mode,division,question_count,seconds_per_question,capacity,host_user_id)
      values($1,'private','unranked','Mu',1,90,30,$2)`, [code(), u]), /multiplayer_one_active_private_host/);
    const definition = await scalar("select pg_get_functiondef('create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)'::regprocedure)");
    assert.match(definition, /from public\.profiles where id = p_user_id for update/);
    // PGlite serializes on one connection; this is not a multi-server load claim.
  });
  await check("missing accounts, invalid settings and code collisions leave no partial writes", async () => {
    const u = await user("admin"), existingCode = code(); await create(u, existingCode);
    const before = await rows();
    await assert.rejects(create(randomUUID()), /Sign in/);
    await assert.rejects(create(u, existingCode), /unique/);
    await assert.rejects(scalar("select create_private_multiplayer_room($1,$2,'unranked','Mu',1,90,'1-5')", [u, code()]), /difficulty/);
    await assert.rejects(scalar("select create_private_multiplayer_room($1,$2,'unranked','Mu',31,90,'2-4')", [u, code()]), /check constraint/);
    assert.deepEqual(await rows(), before);
  });
  await check("browser roles cannot call either overload or write the exemption flag, and cannot self-promote", async () => {
    for (const signature of ["uuid,text,text,text,integer,integer", "uuid,text,text,text,integer,integer,text"]) {
      const fn = `public.create_private_multiplayer_room(${signature})`;
      assert.equal(await scalar("select prosecdef and proconfig=array['search_path=\"\"'] from pg_proc where oid=$1::regprocedure", [fn]), true);
      for (const role of ["anon", "authenticated", "service_role"]) {
        assert.equal(await scalar("select has_function_privilege($1,$2,'execute')", [role, fn]), role === "service_role");
      }
    }
    for (const role of ["anon", "authenticated"]) {
      await assert.rejects(runAs(role, () => create(oldUser)), /permission denied/);
      await assert.rejects(runAs(role, () => db.query("update multiplayer_rooms set creation_limit_exempt=true where id=$1", [oldRoom])), /permission denied/);
    }
    await db.exec("grant update(role) on profiles to authenticated; grant select on profiles to authenticated; select set_config('request.jwt.claim.role','authenticated',false)");
    await assert.rejects(runAs("authenticated", () => db.query("update profiles set role='admin' where id=$1", [oldUser])), /Only the server/);
    assert.equal(await scalar("select role from profiles where id=$1", [oldUser]), "user");
    await db.exec("select set_config('request.jwt.claim.role','service_role',false)");
  });
  await check("documented deployment checks report the actual schema and both RPC permissions", async () => {
    const doc = await readFile(new URL("../docs/multiplayer-privileged-creation.md", import.meta.url), "utf8");
    const sql = doc.match(/```sql\n([\s\S]*?)```/)[1].split("-- Run after recording")[0];
    const results = await db.exec(sql);
    assert.equal(results[0].rows.length, 1);
    assert.ok(Object.values(results[0].rows[0]).every(value => value === true));
    assert.equal(results[1].rows.length, 2);
    for (const row of results[1].rows) for (const [key, value] of Object.entries(row)) {
      if (key !== "signature") assert.equal(value, true, key);
    }
  });
  console.log(`PASS ${checks} isolated privileged-creation database checks; no hosted database changed.`);
} finally { await db.close(); }
