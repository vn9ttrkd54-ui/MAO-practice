// Actual accounting migrations in isolated PostgreSQL; no provider/network/credentials.
// PGLITE_MODULE_PATH=/existing/@electric-sql/pglite/dist/index.js node --test tests/security/tutorAccounting.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

test("durable tutor accounting", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to an existing local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const migration = async (name) => db.exec(await readFile(
    new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8"));
  let nextId = 1;
  const id = () => `00000000-0000-0000-0000-${String(nextId++).padStart(12, "0")}`;
  const user = async () => {
    const value = id();
    await db.query("insert into auth.users(id) values($1)", [value]);
    return value;
  };
  const reserve = async (uid, rid, options = {}) => (await db.query(
    "select public.reserve_ai_tutor_request_v2($1,$2,$3,$4,$5,$6,$7) result",
    [uid, rid, options.tokens ?? 500, options.daily ?? 7, options.concurrent ?? 3,
      options.perMinute ?? 3, options.globalMinute ?? 12],
  )).rows[0].result;
  const finish = async (rid, actual, count = true, charge = true) => (await db.query(
    "select public.finish_ai_tutor_request($1,$2,$3,$4) result", [rid, actual, count, charge],
  )).rows[0].result;
  const tokens = async () => Number((await db.query("select tokens_used from ai_tutor_budget where id=1")).rows[0].tokens_used);
  const scalar = async (query, args = []) => Object.values((await db.query(query, args)).rows[0])[0];
  const reset = async () => {
    await db.exec(`truncate public.ai_tutor_usage_ledger, public.ai_tutor_reservations,
      public.ai_tutor_daily_usage, auth.users;
      insert into public.ai_tutor_budget(id) values(1) on conflict do nothing;
      update public.ai_tutor_budget set tokens_used=100,token_limit=100000,safety_tokens=10,
        global_window_count=0,global_window_started_at=clock_timestamp() where id=1;`);
  };
  try {
    await db.exec(`set timezone='UTC'; create role anon; create role authenticated;
      create role service_role bypassrls; create schema auth;
      create table auth.users(id uuid primary key);`);
    await migration("021_ai_tutor_foundation");
    await db.exec("update ai_tutor_budget set tokens_used=100,token_limit=100000,safety_tokens=10");
    const legacyUser = await user();
    const expiredUser = await user();
    const legacyRequest = id();
    const expiredRequest = id();
    await db.query(`insert into ai_tutor_reservations(request_id,user_id,reserved_tokens,created_at,expires_at)
      values($1,$2,500,'2026-09-08T03:59:00Z',clock_timestamp()+interval '90 seconds'),
      ($3,$4,700,'2026-09-08T04:01:00Z',clock_timestamp()-interval '1 second')`,
    [legacyRequest, legacyUser, expiredRequest, expiredUser]);
    await migration("041_ai_tutor_durable_accounting");
    await migration("046_ai_tutor_daily_slots");

    await t.test("migration retains existing budget and holds, including expired leases", async () => {
      assert.equal(await tokens(), 1300);
      const rows = (await db.query(`select request_id,usage_date::text,daily_message_limit,reserved_tokens
        from ai_tutor_usage_ledger order by request_id`)).rows;
      assert.deepEqual(rows.map(({ usage_date, daily_message_limit, reserved_tokens }) =>
        ({ usage_date, daily_message_limit, reserved_tokens })), [
        { usage_date: "2026-09-07", daily_message_limit: 15, reserved_tokens: 500 },
        { usage_date: "2026-09-08", daily_message_limit: 15, reserved_tokens: 700 },
      ]);
      assert.equal((await finish(legacyRequest, 200)).messages_remaining, 14);
      assert.equal(await tokens(), 1000);
      await finish(expiredRequest, null, false, false);
      assert.equal(await tokens(), 1000, "unknown legacy spend remains held");
    });

    await t.test("reservation debits immediately and duplicate IDs cannot authorize more work", async () => {
      await reset();
      const uid = await user(); const rid = id();
      assert.deepEqual(await reserve(uid, rid), { status: "reserved", accounting_version: 2, daily_slot_version: 1, messages_remaining: 7 });
      assert.equal(await tokens(), 600);
      assert.equal((await reserve(uid, rid)).status, "duplicate");
      assert.equal((await reserve(await user(), rid)).status, "duplicate");
      assert.equal((await reserve(uid, id())).status, "active");
      assert.equal(await tokens(), 600);
      assert.equal(await scalar("select minute_window_count from ai_tutor_daily_usage where user_id=$1", [uid]), 1);
      assert.equal(await scalar("select global_window_count from ai_tutor_budget"), 1);
    });

    await t.test("unknown failure frees concurrency but holds spend, and exact usage reconciles once", async () => {
      await reset();
      const uid = await user(); const rid = id();
      await reserve(uid, rid);
      assert.deepEqual(await finish(rid, null, false, false), {
        status: "finished", accounting: "held", daily_slot_version: 1, messages_remaining: 6,
      });
      await finish(rid, 0, false, false); // Old application's generic failure semantics.
      assert.equal(await tokens(), 600);
      assert.equal(await scalar("select count(*)::int from ai_tutor_reservations"), 0);
      const rid2 = id();
      assert.equal((await reserve(uid, rid2)).status, "reserved");
      assert.equal(await tokens(), 1100);
      assert.deepEqual(await finish(rid, 120, true, true), {
        status: "finished", accounting: "settled", daily_slot_version: 1, messages_remaining: 5,
      });
      assert.equal(await tokens(), 720);
      await finish(rid, 120, true, true);
      await finish(rid, 999, true, true);
      await finish(rid, 0, false, true);
      await finish(rid, null, false, false);
      assert.equal(await tokens(), 720);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 1);
      assert.equal(await scalar("select actual_tokens from ai_tutor_usage_ledger where request_id=$1", [rid]), 120);
      assert.equal(await scalar("select count(*)::int from ai_tutor_reservations where request_id=$1", [rid2]), 1);
    });

    await t.test("expiry only frees concurrency; late settlement survives a replacement request", async () => {
      await reset();
      const uid = await user(); const first = id(); const second = id();
      await reserve(uid, first);
      await db.query("update ai_tutor_reservations set expires_at=clock_timestamp()-interval '1 second' where request_id=$1", [first]);
      assert.equal((await reserve(uid, second)).status, "reserved");
      assert.equal(await tokens(), 1100);
      assert.equal(await scalar("select count(*)::int from ai_tutor_usage_ledger"), 2);
      await finish(first, 700, false, true);
      assert.equal(await tokens(), 1300, "actual usage above the estimate is charged");
      assert.equal(await scalar("select count(*)::int from ai_tutor_reservations where request_id=$1", [second]), 1);
      assert.equal((await reserve(uid, first)).status, "duplicate");
    });

    await t.test("known zero differs from unknown, and message counting is idempotent", async () => {
      await reset();
      const uid = await user(); const zero = id();
      await reserve(uid, zero);
      assert.equal((await finish(zero, 0, false, true)).accounting, "settled");
      assert.equal(await tokens(), 100);
      await finish(zero, 500, true, true);
      assert.equal(await tokens(), 100);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 0);
      const uncertain = id(); await reserve(uid, uncertain);
      await finish(uncertain, null, true, true);
      await finish(uncertain, null, true, false);
      assert.equal(await tokens(), 600);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 1);
      await finish(uncertain, 200, true, true);
      assert.equal(await tokens(), 300);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 1);
    });

    await t.test("late settlement uses original ET day and nondefault configured allowance", async () => {
      await reset();
      const uid = await user(); const rid = id();
      await reserve(uid, rid, { daily: 2 });
      assert.equal(await scalar(`select usage_date=(clock_timestamp() at time zone 'America/New_York')::date
        from ai_tutor_usage_ledger where request_id=$1`, [rid]), true);
      // Simulate a request reserved before midnight without changing the host clock.
      await db.query("update ai_tutor_usage_ledger set usage_date='2001-01-01' where request_id=$1", [rid]);
      await db.query("insert into ai_tutor_daily_usage(user_id,usage_date,messages_used) values($1,'2001-01-01',1)", [uid]);
      const response = await finish(rid, 50, true, true);
      assert.equal(response.messages_remaining, 0);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1 and usage_date='2001-01-01'", [uid]), 2);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1 and usage_date<>'2001-01-01'", [uid]), 0);
      assert.equal((await finish(rid, 999, true, true)).messages_remaining, 0);
    });

    await t.test("budget denial includes uncertain holds and is atomic", async () => {
      await reset();
      await db.exec("update ai_tutor_budget set token_limit=610");
      const uid = await user(); const first = id();
      assert.equal((await reserve(uid, first)).status, "reserved");
      await finish(first, null, false, false);
      const denied = id();
      assert.equal((await reserve(uid, denied, { tokens: 1 })).status, "pool_exhausted");
      assert.equal(await tokens(), 600);
      assert.equal(await scalar("select count(*)::int from ai_tutor_usage_ledger where request_id=$1", [denied]), 0);
      assert.equal(await scalar("select global_window_count from ai_tutor_budget"), 1);
      assert.equal(await scalar("select minute_window_count from ai_tutor_daily_usage where user_id=$1", [uid]), 1);
    });

    await t.test("daily, per-user minute, global minute, and concurrent limits still apply", async () => {
      await reset();
      const uid = await user(); const first = id();
      await reserve(uid, first, { daily: 1 });
      await finish(first, 0);
      assert.equal((await reserve(uid, id(), { daily: 1 })).status, "daily_limit");
      assert.equal((await reserve(uid, id(), { perMinute: 1 })).status, "rate_limited");
      assert.equal((await reserve(await user(), id(), { globalMinute: 1 })).status, "busy");
      await db.exec("update ai_tutor_budget set global_window_started_at=clock_timestamp()-interval '61 seconds'");
      const other = await user();
      assert.equal((await reserve(other, id(), { globalMinute: 1 })).status, "reserved");
      assert.equal((await reserve(await user(), id(), { concurrent: 1 })).status, "busy");
      await db.query("update ai_tutor_daily_usage set minute_window_started_at=clock_timestamp()-interval '61 seconds' where user_id=$1", [uid]);
      assert.equal((await reserve(uid, id(), { perMinute: 1 })).status, "reserved");
    });

    await t.test("deleted accounts cannot erase held cost or prevent later exact accounting", async () => {
      await reset();
      const uid = await user(); const rid = id();
      await reserve(uid, rid);
      await db.query("delete from auth.users where id=$1", [uid]);
      assert.equal(await tokens(), 600);
      assert.equal(await scalar("select user_id from ai_tutor_usage_ledger where request_id=$1", [rid]), null);
      assert.equal(await scalar("select count(*)::int from ai_tutor_reservations"), 0);
      await finish(rid, null, false, false);
      assert.equal(await tokens(), 600);
      await finish(rid, 200, true, true);
      assert.equal(await tokens(), 300);
      assert.equal(await scalar("select count(*)::int from ai_tutor_daily_usage"), 0);
      assert.equal((await reserve(uid, id())).status, "invalid");
    });

    await t.test("nullable and unsafe parameters fail closed, as does a missing budget", async () => {
      await reset();
      const uid = await user(); const rid = id();
      const validArgs = [uid, rid, 500, 7, 3, 3, 12];
      for (let index = 0; index < validArgs.length; index++) {
        const args = [...validArgs]; args[index] = null;
        assert.equal((await db.query("select reserve_ai_tutor_request_v2($1,$2,$3,$4,$5,$6,$7) result", args)).rows[0].result.status, "invalid");
      }
      for (const [index, invalid] of [[2, 0], [2, 1000001], [3, 1001], [4, 101], [5, 1001], [6, 10001]]) {
        const args = [...validArgs]; args[index] = invalid;
        assert.equal((await db.query("select reserve_ai_tutor_request_v2($1,$2,$3,$4,$5,$6,$7) result", args)).rows[0].result.status, "invalid");
      }
      assert.equal(await tokens(), 100);
      assert.equal((await finish(id(), 0)).status, "missing");
      await reserve(uid, rid);
      for (const args of [[rid, -1, true, true], [rid, 1000001, true, true], [rid, 0, null, true], [rid, 0, true, null]]) {
        assert.equal((await db.query("select finish_ai_tutor_request($1,$2,$3,$4) result", args)).rows[0].result.status, "invalid");
      }
      assert.equal(await tokens(), 600);
      await db.exec("delete from ai_tutor_budget where id=1");
      assert.equal((await reserve(await user(), id())).status, "unavailable");
      assert.equal((await finish(rid, 0)).status, "unavailable");
      assert.equal(await scalar("select actual_tokens from ai_tutor_usage_ledger where request_id=$1", [rid]), null);
      assert.equal(await scalar("select count(*)::int from ai_tutor_reservations where request_id=$1", [rid]), 1);
    });

    await t.test("legacy reservation entry point is denied to service callers and inert for its owner", async () => {
      await reset();
      const uid = await user(); const rid = id();
      const legacy = "select public.reserve_ai_tutor_request($1,$2,500,7,3,3,12) result";
      await db.exec("set role service_role");
      try {
        await assert.rejects(db.query(legacy, [uid, rid]), /permission denied for function reserve_ai_tutor_request/);
      } finally {
        await db.exec("reset role");
      }
      assert.deepEqual((await db.query(legacy, [uid, rid])).rows[0].result, { status: "invalid" });
      assert.equal(await tokens(), 100);
      assert.equal(await scalar("select count(*)::int from ai_tutor_reservations"), 0);
      assert.equal(await scalar("select count(*)::int from ai_tutor_usage_ledger"), 0);
      assert.equal(await scalar("select count(*)::int from ai_tutor_daily_usage"), 0);
    });

    await t.test("ledger and accounting RPCs remain inaccessible to browser roles", async () => {
      const legacySignature = "reserve_ai_tutor_request(uuid,uuid,integer,integer,integer,integer,integer)";
      const signatures = ["reserve_ai_tutor_request_v2(uuid,uuid,integer,integer,integer,integer,integer)",
        "finish_ai_tutor_request(uuid,integer,boolean,boolean)"];
      for (const role of ["anon", "authenticated"]) {
        for (const signature of [...signatures, legacySignature]) {
          assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')", [role, signature]), false);
        }
        assert.equal(await scalar("select has_table_privilege($1,'public.ai_tutor_usage_ledger','SELECT')", [role]), false);
        assert.equal(await scalar("select has_table_privilege($1,'public.ai_tutor_usage_ledger','INSERT,UPDATE,DELETE')", [role]), false);
      }
      for (const signature of signatures) {
        assert.equal(await scalar("select has_function_privilege('service_role',$1,'EXECUTE')", [signature]), true);
      }
      assert.equal(await scalar("select has_function_privilege('service_role',$1,'EXECUTE')", [legacySignature]), false);
      assert.equal(await scalar("select relrowsecurity from pg_class where oid='public.ai_tutor_usage_ledger'::regclass"), true);
    });
  } finally {
    await db.close();
  }
});
