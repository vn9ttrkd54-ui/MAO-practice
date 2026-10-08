import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

test("operator guest removal against actual multiplayer PostgreSQL schema", async t => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to a local PGlite dist/index.js");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const file = path => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const quote = value => `'${value.replaceAll("'", "''")}'`;
  const template = await file("docs/sql/guest-player-removal.sql");
  const preview = await file("docs/sql/guest-player-removal-preview.sql");
  const childTables = ["multiplayer_submissions", "multiplayer_match_results",
    "multiplayer_question_deliveries", "multiplayer_question_readiness", "multiplayer_result_receipts"];
  const script = (target, commit = false) => {
    let sql = template
      .replace("target_room_id uuid := null;", `target_room_id uuid := ${quote(target.room)};`)
      .replace("target_player_id uuid := null;", `target_player_id uuid := ${quote(target.guest)};`)
      .replace("target_room_code text := 'REPLACE_ROOM_CODE';", `target_room_code text := ${quote(target.code)};`)
      .replace("target_guest_nickname text := 'REPLACE_GUEST_NICKNAME';", `target_guest_nickname text := ${quote(target.nickname)};`);
    if (commit) sql = sql.replace(/rollback;\s*$/, "commit;");
    return sql;
  };
  const identity = target => scalar("select multiplayer_lobby_player_id($1,null,$2)", [target.room, target.hash]);
  const childCount = (table, player) => scalar(`select count(*)::int from ${table} where player_id=$1`, [player]);
  const survivor = async target => ({
    player: (await db.query("select * from multiplayer_players where id=$1", [target.accountPlayer])).rows,
    children: await Promise.all(childTables.map(table => db.query(`select * from ${table} where player_id=$1`, [target.accountPlayer]).then(result => result.rows))),
    history: (await db.query("select * from multiplayer_match_history where user_id=$1", [target.user])).rows,
    questions: (await db.query("select * from multiplayer_match_questions where room_id=$1 order by question_number", [target.room])).rows,
  });
  const setup = async (status = "waiting", host = false) => {
    const target = { room: randomUUID(), guest: randomUUID(), accountPlayer: randomUUID(), user: randomUUID(),
      code: randomUUID().slice(0, 8).toUpperCase(), nickname: "ReportedGuest", hash: randomUUID() };
    await db.query("insert into auth.users values($1)", [target.user]);
    await db.query("insert into profiles(id,username) values($1,'OtherPlayer')", [target.user]);
    await db.query(`insert into multiplayer_rooms(id,code,visibility,mode,division,question_count,seconds_per_question,capacity)
      values($1,$2,'private','unranked','Mu',5,90,30)`, [target.room, target.code]);
    await db.query(`insert into multiplayer_players(id,room_id,guest_nickname,reconnect_token_hash,is_host)
      values($1,$2,$3,$4,$5)`, [target.guest, target.room, target.nickname, target.hash, host]);
    await db.query("insert into multiplayer_players(id,room_id,user_id,is_host) values($1,$2,$3,$4)",
      [target.accountPlayer, target.room, target.user, !host]);
    await db.query("update multiplayer_rooms set host_player_id=$1 where id=$2", [host ? target.guest : target.accountPlayer, target.room]);
    await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,started_at,ends_at,hard_ends_at)
      values($1,1,101,3,clock_timestamp()-interval '10 seconds',clock_timestamp()+interval '80 seconds',clock_timestamp()+interval '85 seconds')`, [target.room]);
    for (const [index, player] of [target.guest, target.accountPlayer].entries()) {
      await db.query(`insert into multiplayer_submissions(room_id,question_number,question_id,player_id,selected_answer,correct,answer_time_ms,points_earned)
        values($1,1,101,$2,'A',true,1000,1000)`, [target.room, player]);
      await db.query(`insert into multiplayer_match_results(room_id,player_id,user_id,placement,final_score,ranked,completion_factor)
        values($1,$2,$3,$4,1000,false,1)`, [target.room, player, index === 0 ? null : target.user, index + 1]);
      for (const table of ["multiplayer_question_deliveries", "multiplayer_question_readiness"]) {
        await db.query(`insert into ${table}(room_id,question_number,player_id) values($1,1,$2)`, [target.room, player]);
      }
      await db.query("insert into multiplayer_result_receipts(room_id,player_id) values($1,$2)", [target.room, player]);
    }
    await db.query(`update multiplayer_rooms set status=$1,started_at=clock_timestamp(),current_question_number=1,
      countdown_ends_at=case when $1='countdown' then clock_timestamp()+interval '10 seconds' end,
      completed_at=case when $1='completed' then clock_timestamp() end,
      results_finalized_at=case when $1='completed' then clock_timestamp() end where id=$2`, [status, target.room]);
    return target;
  };
  const rejected = async (sql, pattern) => {
    await assert.rejects(db.exec(sql), pattern);
    await db.exec("rollback; reset role;");
  };
  try {
    await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
      create schema auth; create table auth.users(id uuid primary key);
      grant usage on schema auth to authenticated;
      create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      create table public.profiles(id uuid primary key,username text,role text default 'user');
      create function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=clock_timestamp(); return new; end;$$;
      create schema realtime; create table realtime.test_events(payload jsonb);
      create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as
      $$insert into realtime.test_events values(payload)$$;`);
    const schema = await file("supabase/migrations/009_multiplayer_pack_m2_schema.sql");
    await db.exec(schema.slice(0, schema.indexOf("-- Row Level Security")) + "\ncommit;");
    await db.exec(schema.slice(schema.indexOf("-- Row Level Security"), schema.indexOf("-- Realtime is limited")));
    await db.exec("alter table multiplayer_spectators add column last_seen_at timestamptz default clock_timestamp()");
    for (const name of ["022_multiplayer_realtime_foundation", "023_multiplayer_realtime_signal_filter",
      "024_multiplayer_atomic_round_transitions", "025_fix_multiplayer_transition_timestamp",
      "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery", "028_fix_multiplayer_state_trigger",
      "029_preload_multiplayer_questions", "030_confirm_preloaded_round_before_reveal", "031_multiplayer_atomic_submissions",
      "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots", "034_multiplayer_database_worker",
      "036_multiplayer_readiness_countdown", "037_multiplayer_balanced_rp", "040_multiplayer_authoritative_scoring_clock",
      "047_multiplayer_host_account_deletion", "049_multiplayer_room_lifecycle", "051_multiplayer_confirmed_lobby_transitions",
      "059_multiplayer_room_settings", "060_multiplayer_lobby_ready", "061_multiplayer_scoring_give_up",
      "062_multiplayer_round_feedback", "063_multiplayer_lobby_recovery", "064_multiplayer_fast_handoffs",
      "065_multiplayer_privileged_creation", "067_multiplayer_submission_signals"]) {
      await db.exec(await file(`supabase/migrations/${name}.sql`));
    }
    const otherRoom = await setup("completed");
    const otherRoomBefore = await survivor(otherRoom);
    await t.test("untouched placeholders fail closed, and lookup is read-only with no token output", async () => {
      await rejected(template, /Fill all four targets/);
      const lookup = preview.replace("'REPLACE_ROOM_CODE'", quote(otherRoom.code))
        .replace("'REPLACE_GUEST_NICKNAME'", quote(otherRoom.nickname));
      const results = await db.exec(lookup);
      const rows = results.flatMap(result => result.rows ?? []);
      assert.equal(rows.length, 1);
      assert.equal(rows[0].player_id, otherRoom.guest);
      assert.equal(rows[0].answers, 1);
      assert.doesNotMatch(JSON.stringify(rows), /reconnect_token|hash/);
      assert.deepEqual(await survivor(otherRoom), otherRoomBefore);
    });
    await t.test("default rehearsal restores all rows, token access and room state", async () => {
      const target = await setup("in-progress");
      const before = await survivor(target);
      const room = (await db.query("select * from multiplayer_rooms where id=$1", [target.room])).rows;
      await db.exec(script(target));
      assert.equal(await identity(target), target.guest);
      for (const table of childTables) assert.equal(await childCount(table, target.guest), 1);
      assert.deepEqual(await survivor(target), before);
      assert.deepEqual((await db.query("select * from multiplayer_rooms where id=$1", [target.room])).rows, room);
    });
    for (const status of ["waiting", "countdown", "in-progress", "completed", "cancelled"]) {
      await t.test(`committed ${status} guest removal cascades, revokes access and preserves everyone else`, async () => {
        const target = await setup(status);
        const before = await survivor(target);
        const version = await scalar("select state_version from multiplayer_rooms where id=$1", [target.room]);
        await db.exec(script(target, true));
        assert.equal(await scalar("select count(*)::int from multiplayer_players where id=$1", [target.guest]), 0);
        assert.equal(await identity(target), null);
        assert.equal(await scalar("select read_multiplayer_lobby($1,null,$2)", [target.room, target.hash]), null);
        assert.equal(await scalar("select read_multiplayer_snapshot($1,$2,-1)", [target.room, target.guest]), null);
        await assert.rejects(db.query("select accept_multiplayer_answer($1,$2,101,'A',true)", [target.room, target.guest]));
        for (const table of childTables) assert.equal(await childCount(table, target.guest), 0, table);
        assert.deepEqual(await survivor(target), before);
        assert.equal(await scalar("select status from multiplayer_rooms where id=$1", [target.room]), status);
        assert.ok(await scalar("select state_version from multiplayer_rooms where id=$1", [target.room]) > version);
        assert.equal(await identity(otherRoom), otherRoom.guest);
        assert.deepEqual(await survivor(otherRoom), otherRoomBefore);
        await rejected(script(target, true), /Guest does not match/);
        assert.deepEqual(await survivor(target), before);
      });
    }
    await t.test("legacy guest hosts detach safely without erasing other players or running matches", async () => {
      for (const status of ["waiting", "countdown", "in-progress", "completed", "cancelled"]) {
        const target = await setup(status, true);
        const before = await survivor(target);
        await db.exec(script(target, true));
        const room = (await db.query("select status,host_player_id,countdown_ends_at from multiplayer_rooms where id=$1", [target.room])).rows[0];
        assert.equal(room.host_player_id, null);
        assert.equal(room.status, ["waiting", "countdown"].includes(status) ? "cancelled" : status);
        assert.equal(room.countdown_ends_at, null);
        assert.deepEqual(await survivor(target), before);
      }
    });
    await t.test("wrong room, code, nickname, missing player and account targets cannot delete", async () => {
      const target = await setup();
      const before = await survivor(target);
      for (const [change, pattern] of [
        [{ room: randomUUID() }, /Private room does not match/],
        [{ code: "WRONG000" }, /Private room does not match/],
        [{ nickname: "WrongGuest" }, /Guest does not match/],
        [{ guest: randomUUID() }, /Guest does not match/],
        [{ guest: otherRoom.guest }, /Guest does not match/],
        [{ guest: target.accountPlayer }, /no account deletion/],
      ]) await rejected(script({ ...target, ...change }, true), pattern);
      assert.equal(await identity(target), target.guest);
      assert.deepEqual(await survivor(target), before);
      for (const table of childTables) assert.equal(await childCount(table, target.guest), 1);
    });
    await t.test("missing host safeguard and changed dependencies require review before any deletion", async () => {
      const target = await setup();
      await db.exec("alter table multiplayer_players disable trigger multiplayer_players_detach_deleted_host");
      await rejected(script(target, true), /host-detach safeguard/);
      await db.exec("alter table multiplayer_players enable trigger multiplayer_players_detach_deleted_host");
      await db.exec("create table extra_guest_data(player_id uuid references multiplayer_players(id) on delete set null)");
      await rejected(script(target, true), /Guest dependencies changed/);
      await db.exec("drop table extra_guest_data");
      await db.exec("alter table multiplayer_result_receipts drop constraint multiplayer_result_receipts_room_id_player_id_fkey");
      await rejected(script(target, true), /Guest dependencies changed/);
      await db.exec(`alter table multiplayer_result_receipts add foreign key(room_id,player_id)
        references multiplayer_players(room_id,id) on delete cascade`);
      assert.equal(await identity(target), target.guest);
    });
    await t.test("ordinary browser roles cannot run the operator deletion", async () => {
      const target = await setup();
      for (const role of ["anon", "authenticated"]) {
        await db.exec(`set role ${role}`);
        await rejected(script(target, true), /permission denied/);
        assert.equal(await identity(target), target.guest);
      }
    });
  } finally { await db.close(); }
});
