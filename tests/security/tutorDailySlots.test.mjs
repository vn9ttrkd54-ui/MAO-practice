// Real SQL in an isolated in-memory PostgreSQL instance. No hosted or paid calls.
// Delays are simulated by expiring leases, not by changing the computer clock.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

test("durable tutor daily slots", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to the existing local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const migration = async name => db.exec(await readFile(new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8"));
  let sequence = 1;
  const id = () => `00000000-0000-4000-8000-${String(sequence++).padStart(12, "0")}`;
  const scalar = async (sql, params = []) => Object.values((await db.query(sql, params)).rows[0])[0];
  const user = async () => {
    const uid = id();
    await db.query("insert into auth.users(id) values($1)", [uid]);
    return uid;
  };
  const reserve = (uid, rid, limit = 1) => scalar("select reserve_ai_tutor_request_v2($1,$2,500,$3,3,100,100)", [uid, rid, limit]);
  const finish = (rid, actual, count = true, charge = actual !== null) => scalar("select finish_ai_tutor_request($1,$2,$3,$4)", [rid, actual, count, charge]);
  const allowance = (uid, limit = 1) => scalar("select get_ai_tutor_allowance($1,$2)", [uid, limit]);
  const expire = rid => db.query("update ai_tutor_reservations set expires_at=clock_timestamp()-interval '1 second' where request_id=$1", [rid]);
  const reset = () => db.exec(`truncate ai_tutor_usage_ledger,ai_tutor_reservations,ai_tutor_daily_usage,auth.users;
    insert into ai_tutor_budget(id) values(1) on conflict do nothing;
    update ai_tutor_budget set tokens_used=100,token_limit=100000,safety_tokens=10,
      global_window_count=0,global_window_started_at=clock_timestamp();`);
  const tokens = () => scalar("select tokens_used::int from ai_tutor_budget where id=1");
  const snapshot = () => scalar(`select jsonb_build_object(
    'budget',(select to_jsonb(b) from ai_tutor_budget b where id=1),
    'ledger',(select coalesce(jsonb_agg(to_jsonb(l) order by request_id),'[]') from ai_tutor_usage_ledger l),
    'daily',(select coalesce(jsonb_agg(to_jsonb(d) order by user_id,usage_date),'[]') from ai_tutor_daily_usage d))`);
  try {
    await db.exec(`set timezone='UTC'; create role anon; create role authenticated;
      create role service_role bypassrls; create schema auth;
      create table auth.users(id uuid primary key);`);
    await migration("021_ai_tutor_foundation");
    await migration("041_ai_tutor_durable_accounting");
    await reset();
    const legacyUser = await user();
    const legacyFirst = id(); const legacySecond = id();

    await t.test("pre-fix proof: a one-message limit admits two late successful replies", async () => {
      assert.equal((await reserve(legacyUser, legacyFirst)).status, "reserved");
      await expire(legacyFirst);
      assert.equal((await reserve(legacyUser, legacySecond)).status, "reserved");
      await finish(legacyFirst, 20);
      await finish(legacySecond, 30);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [legacyUser]), 2);
    });

    // Also retain unresolved work from the old admission policy during upgrade.
    const heldUser = await user(); const heldFirst = id(); const heldSecond = id();
    await reserve(heldUser, heldFirst);
    await expire(heldFirst);
    await reserve(heldUser, heldSecond);
    await expire(heldSecond);
    const beforeMigration = await snapshot();
    await migration("046_ai_tutor_daily_slots");

    await t.test("upgrade preserves all prior usage and overbooked holds without admitting more", async () => {
      assert.deepEqual(await snapshot(), beforeMigration);
      for (const uid of [legacyUser, heldUser]) {
        assert.deepEqual(await allowance(uid), { status: "available", daily_slot_version: 1, messages_remaining: 0 });
        assert.equal((await reserve(uid, id())).status, "daily_limit");
      }
      assert.deepEqual(await snapshot(), beforeMigration, "denied requests do not change ledger, budget or daily counters");
      await finish(heldFirst, 20);
      await finish(heldSecond, 30);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [heldUser]), 2,
        "pre-upgrade overbooking is preserved, not truncated");
      assert.equal((await allowance(heldUser)).messages_remaining, 0);
    });

    await t.test("expired lease cannot free the final daily slot or debit a denied replacement", async () => {
      await reset();
      const uid = await user(); const rid = id();
      assert.deepEqual(await reserve(uid, rid), { status: "reserved", accounting_version: 2, daily_slot_version: 1, messages_remaining: 1 });
      await expire(rid);
      const before = await snapshot();
      assert.equal((await reserve(uid, id())).status, "daily_limit");
      assert.deepEqual(await snapshot(), before);
      assert.equal((await allowance(uid)).messages_remaining, 0);
      assert.equal((await finish(rid, 50)).messages_remaining, 0);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 1);
      assert.equal(await tokens(), 150);
    });

    await t.test("two reserved slots can finish out of order without admitting a third", async () => {
      await reset();
      const uid = await user(); const first = id(); const second = id();
      assert.equal((await reserve(uid, first, 2)).messages_remaining, 2);
      await expire(first);
      assert.equal((await reserve(uid, second, 2)).messages_remaining, 1);
      await expire(second);
      assert.equal((await reserve(uid, id(), 2)).status, "daily_limit");
      assert.equal((await finish(second, 60)).messages_remaining, 0);
      assert.equal((await allowance(uid, 2)).messages_remaining, 0);
      assert.equal((await finish(first, 40)).messages_remaining, 0);
      await finish(first, 40); await finish(second, 60);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 2);
      assert.equal(await tokens(), 200);
    });

    await t.test("unknown failure retains a slot; known zero and known-cost failures release it", async () => {
      for (const actual of [0, 90]) {
        await reset();
        const uid = await user(); const rid = id();
        await reserve(uid, rid);
        const result = await finish(rid, null, false, false);
        assert.equal(result.accounting, "held");
        assert.equal(result.messages_remaining, 0);
        assert.equal(await scalar("select count(*)::int from ai_tutor_reservations"), 0);
        await finish(rid, 0, false, false); // Zero without affirmative accounting is not evidence.
        assert.equal((await reserve(uid, id())).status, "daily_limit");
        assert.equal(await tokens(), 600);
        assert.equal((await finish(rid, actual, false, true)).messages_remaining, 1);
        assert.equal((await allowance(uid)).messages_remaining, 1);
        await finish(rid, 999, true, true); // Cannot resurrect a settled failed response.
        assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 0);
        assert.equal(await tokens(), 100 + actual);
        assert.equal((await reserve(uid, id())).status, "reserved");
      }
    });

    await t.test("unknown successful usage converts a slot once and keeps its token hold", async () => {
      await reset();
      const uid = await user(); const rid = id();
      await reserve(uid, rid);
      assert.equal((await finish(rid, null, true, false)).messages_remaining, 0);
      assert.equal(await tokens(), 600);
      assert.equal((await allowance(uid)).messages_remaining, 0);
      await finish(rid, null, true, false);
      await finish(rid, 80, true, true);
      await finish(rid, 0, false, true);
      assert.equal(await tokens(), 180);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1", [uid]), 1);
      assert.equal((await reserve(uid, id())).status, "daily_limit");
    });

    await t.test("midnight keeps old pending slots and late completions on their original Eastern day", async () => {
      await reset();
      const uid = await user(); const yesterday = id(); const today = id();
      await reserve(uid, yesterday);
      assert.equal(await scalar(`select usage_date=(statement_timestamp() at time zone 'America/New_York')::date
        from ai_tutor_usage_ledger where request_id=$1`, [yesterday]), true);
      await db.query("update ai_tutor_usage_ledger set usage_date='2001-01-01' where request_id=$1", [yesterday]);
      await expire(yesterday);
      assert.equal((await allowance(uid)).messages_remaining, 1);
      assert.equal((await reserve(uid, today)).status, "reserved");
      await finish(yesterday, 20);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1 and usage_date='2001-01-01'", [uid]), 1);
      assert.equal(await scalar("select messages_used from ai_tutor_daily_usage where user_id=$1 and usage_date<>'2001-01-01'", [uid]), 0);
      assert.equal((await allowance(uid)).messages_remaining, 0, "today's pending slot is still held");
      await finish(today, 30);
      assert.equal(await tokens(), 150);
    });

    await t.test("one account cannot occupy another account's daily slots", async () => {
      await reset();
      const firstUser = await user(); const secondUser = await user();
      await reserve(firstUser, id());
      assert.equal((await allowance(firstUser)).messages_remaining, 0);
      assert.equal((await allowance(secondUser)).messages_remaining, 1);
      assert.equal((await reserve(secondUser, id())).status, "reserved");
    });

    await t.test("rolled-back reservations and settlements cannot create or lose a slot", async () => {
      await reset();
      const uid = await user(); const rid = id();
      await db.exec("begin");
      try { await reserve(uid, rid); } finally { await db.exec("rollback"); }
      assert.equal((await allowance(uid)).messages_remaining, 1);
      assert.equal(await tokens(), 100);
      await reserve(uid, rid);
      await db.exec("begin");
      try { await finish(rid, 0, false, true); } finally { await db.exec("rollback"); }
      assert.equal((await allowance(uid)).messages_remaining, 0);
      assert.equal(await tokens(), 600);
    });

    await t.test("allowance is read-only, validates inputs and remains service-only", async () => {
      await reset();
      const uid = await user();
      const before = await snapshot();
      await db.exec("begin read only; set local role service_role");
      try {
        assert.deepEqual(await allowance(uid), { status: "available", daily_slot_version: 1, messages_remaining: 1 });
      } finally { await db.exec("rollback"); }
      assert.deepEqual(await snapshot(), before, "a read does not create a usage row");
      for (const [target, limit] of [[null, 1], [id(), 1], [uid, null], [uid, 0], [uid, 1001]]) {
        assert.equal((await allowance(target, limit)).status, "invalid");
      }
      assert.equal((await allowance(uid, 1000)).messages_remaining, 1000);
      for (const role of ["anon", "authenticated"]) {
        await db.exec(`set role ${role}`);
        try {
          await assert.rejects(allowance(uid), error => error.code === "42501");
          await assert.rejects(reserve(uid, id()), error => error.code === "42501");
          await assert.rejects(finish(id(), 0), error => error.code === "42501");
        } finally { await db.exec("reset role"); }
      }
      await db.exec("delete from ai_tutor_budget where id=1");
      assert.equal((await allowance(uid)).status, "unavailable");
    });
  } finally {
    await db.close();
  }
});
