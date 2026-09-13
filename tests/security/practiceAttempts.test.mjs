import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { pathToFileURL } from "node:url";

// Actual migrations/roles in an isolated database, not hosted or multi-connection.
test("practice attempts bind ownership, enforce bursts and save only once", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const migration = async (name) => db.exec(await readFile(new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8"));
  const asRole = async (role, work) => {
    await db.query("select set_config('request.jwt.claim.role',$1,false)", [role]);
    await db.exec(`set role ${role}`);
    try { return await work(); } finally { await db.exec("reset role"); }
  };
  let nonce = 100;
  const begin = (user, question = 42, trainer = true, request = uid(nonce++)) => asRole("service_role", () => scalar(
    "select public.begin_practice_attempt($1,$2,$3,$4)", [uid(user), question, trainer, request]));
  const finish = (user, attempt, answer = "C", result = "correct", elapsed = 1000, question = 42, trainer = true) => asRole("service_role", () => scalar(
    "select public.finish_practice_attempt_v2($1,$2,$3,$4,$5,$6,$7)", [uid(user), attempt, question, trainer, answer, result, elapsed]));
  const count = (user) => scalar("select coalesce(sum(attempts),0)::int from question_progress where user_id=$1", [uid(user)]);
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.role() returns text language sql stable as $$ select current_setting('request.jwt.claim.role',true) $$;
      grant usage on schema auth to anon,authenticated,service_role;`);
    for (const name of ["001_auth_user_data", "013_feedback_account_admin", "015_security_hardening", "018_owner_role", "019_security_defense_in_depth"]) await migration(name);
    for (let n = 1; n <= 12; n++) await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)", [uid(n), { username: `fixture_${n}` }]);
    await t.test("pre-fix replay increases the same user's level thirty times", async () => {
      await asRole("service_role", async () => {
        for (let n = 0; n < 30; n++) await db.query("select record_verified_practice_result($1,42,'correct',0,true)", [uid(1)]);
      });
      assert.equal(await count(1), 30);
      assert.equal(await scalar("select level from user_levels where user_id=$1", [uid(1)]), 2);
    });
    await migration("043_practice_attempt_guard");
    await migration("044_bounded_practice_timing");
    let firstAttempt;
    await t.test("creation retries and thirty result retries each count once", async () => {
      const request = uid(nonce++);
      const first = await begin(2, 42, true, request);
      firstAttempt = first.attemptId;
      assert.equal(first.status, "started");
      assert.notEqual(firstAttempt, request);
      assert.deepEqual(await begin(2, 42, true, request), first);
      const saved = await finish(2, firstAttempt);
      assert.equal(saved.status, "saved");
      for (let n = 0; n < 30; n++) assert.deepEqual(await finish(2, firstAttempt), saved);
      assert.equal(await count(2), 1);
      assert.equal(await scalar("select progress from user_levels where user_id=$1", [uid(2)]), 1);
      assert.equal(await scalar("select cardinality(recent_finishes) from practice_attempt_state where user_id=$1", [uid(2)]), 1);
      assert.equal(await scalar("select response_snapshot->'progress' ? 'times' from practice_attempts where id=$1", [firstAttempt]), false);
      // Server correctness may change after a question correction; client retry is unchanged.
      assert.deepEqual(await finish(2, firstAttempt, "C", "incorrect"), saved);
    });
    await t.test("forged ownership, IDs, changed answers and changed mode cannot overwrite or score", async () => {
      assert.equal((await finish(3, firstAttempt)).status, "invalid");
      assert.equal((await finish(2, uid(99999))).status, "invalid");
      assert.equal((await finish(2, firstAttempt, "A", "incorrect")).status, "conflict");
      assert.equal((await finish(2, firstAttempt, null, "give-up")).status, "conflict");
      assert.equal((await finish(2, firstAttempt, "C", "correct", 2000)).status, "conflict");
      assert.equal((await finish(2, firstAttempt, "C", "correct", 1000, 43)).status, "conflict");
      assert.equal((await finish(2, firstAttempt, "C", "correct", 1000, 42, false)).status, "conflict");
      assert.equal(await count(2), 1);
      assert.equal(await count(3), 0);
    });
    await t.test("fresh manual attempts still count, level formula is preserved and retries bypass the burst cap", async () => {
      const ids = [];
      for (let n = 0; n < 30; n++) {
        const { attemptId } = await begin(4);
        ids.push(attemptId);
        assert.equal((await finish(4, attemptId)).status, "saved");
      }
      assert.equal(await count(4), 30);
      assert.equal(await scalar("select level from user_levels where user_id=$1", [uid(4)]), 2);
      const next = await begin(4);
      assert.equal((await finish(4, next.attemptId)).status, "rate_limited");
      assert.equal((await finish(4, ids[0])).status, "saved");
      assert.equal(await count(4), 30);
      // Time passage is simulated in isolated fixtures, never production rows.
      await db.query("update practice_attempt_state set recent_finishes=array[clock_timestamp()-interval '61 seconds'] where user_id=$1", [uid(4)]);
      assert.equal((await finish(4, next.attemptId, null, "give-up")).status, "saved");
      assert.equal(await scalar("select progress from user_levels where user_id=$1", [uid(4)]), 0);
    });
    await t.test("start throttling is per account, bounded and exempts a repeated creation request", async () => {
      const request = uid(nonce++);
      const first = await begin(5, 42, false, request);
      for (let n = 1; n < 60; n++) assert.equal((await begin(5)).status, "started");
      assert.equal((await begin(5)).status, "rate_limited");
      assert.deepEqual(await begin(5, 42, false, request), first);
      assert.equal((await begin(5, 43, false, request)).status, "conflict");
      assert.equal((await begin(6)).status, "started");
      assert.equal(await scalar("select cardinality(recent_starts) from practice_attempt_state where user_id=$1", [uid(5)]), 60);
      await db.query("update practice_attempt_state set recent_starts=array[clock_timestamp()-interval '61 seconds'] where user_id=$1", [uid(5)]);
      assert.equal((await begin(5)).status, "started");
    });
    await t.test("expiry cannot restart an old result and completed receipts survive the original deadline", async () => {
      const expired = await begin(7);
      await db.query("update practice_attempts set created_at=clock_timestamp()-interval '25 hours', expires_at=clock_timestamp()-interval '1 hour' where id=$1", [expired.attemptId]);
      assert.equal((await finish(7, expired.attemptId)).status, "expired");
      assert.equal((await finish(7, expired.attemptId)).status, "invalid");
      assert.equal(await count(7), 0);
      const completed = await begin(7);
      const saved = await finish(7, completed.attemptId);
      await db.query("update practice_attempts set created_at=clock_timestamp()-interval '25 hours', expires_at=clock_timestamp()-interval '1 hour' where id=$1", [completed.attemptId]);
      assert.deepEqual(await finish(7, completed.attemptId), saved);
      await db.query("update practice_attempts set completed_at=clock_timestamp()-interval '25 hours' where id=$1", [completed.attemptId]);
      assert.equal((await finish(7, completed.attemptId)).status, "expired");
      assert.equal(await count(7), 1);
    });
    await t.test("rolled-back results leave the attempt reusable and wrong/give-up answers keep level behavior", async () => {
      const fresh = await begin(8);
      await db.exec("begin");
      await finish(8, fresh.attemptId);
      await db.exec("rollback");
      assert.equal(await count(8), 0);
      assert.equal((await finish(8, fresh.attemptId)).status, "saved");
      const wrong = await begin(8);
      assert.equal((await finish(8, wrong.attemptId, "A", "incorrect")).status, "saved");
      assert.equal(await scalar("select progress from user_levels where user_id=$1", [uid(8)]), 0);
      const bank = await begin(8, 42, false);
      assert.equal((await finish(8, bank.attemptId, "C", "correct", 1000, 42, false)).levelChange, null);
      assert.equal(await scalar("select progress from user_levels where user_id=$1", [uid(8)]), 0);
    });
    await t.test("invalid parameters and browser/legacy entry points fail closed", async () => {
      const fresh = await begin(9);
      for (const [answer, result, time] of [[null, "correct", 0], ["A", "give-up", 0], ["F", "incorrect", 0], ["A", null, 0], ["A", "correct", null], ["A", "correct", -1]]) {
        assert.equal((await finish(9, fresh.attemptId, answer, result, time)).status, "invalid");
      }
      for (const role of ["anon", "authenticated", "service_role"]) await asRole(role, async () => {
        await assert.rejects(db.query("select record_verified_practice_result($1,42,'correct',0,true)", [uid(9)]), /permission denied/);
        for (const table of ["practice_attempts", "practice_attempt_state"]) {
          await assert.rejects(db.query(`select * from ${table}`), /permission denied/);
          await assert.rejects(db.query(`delete from ${table}`), /permission denied/);
          await assert.rejects(db.query(`update ${table} set user_id=$1`, [uid(9)]), /permission denied/);
          await assert.rejects(db.query(`insert into ${table}(user_id) values($1)`, [uid(9)]), /permission denied/);
        }
        if (role !== "service_role") {
          await assert.rejects(db.query("select begin_practice_attempt($1,42,true,$2)", [uid(9), uid(nonce++)]), /permission denied/);
          await assert.rejects(db.query("select finish_practice_attempt_v2($1,$2,42,true,'C','correct',0)", [uid(9), fresh.attemptId]), /permission denied/);
        }
      });
      assert.equal((await scalar("select record_verified_practice_result($1,42,'correct',0,true)", [uid(9)])).status, "invalid");
      assert.equal(await count(9), 0);
      assert.equal(await scalar("select count(*)::int from pg_class where relname in ('practice_attempts','practice_attempt_state') and relrowsecurity"), 2);
    });
    await t.test("account deletion removes private attempt and throttle records", async () => {
      await begin(12);
      await db.query("delete from auth.users where id=$1", [uid(12)]);
      assert.equal(await scalar("select count(*)::int from practice_attempt_state where user_id=$1", [uid(12)]), 0);
      assert.equal(await scalar("select count(*)::int from practice_attempts where user_id=$1", [uid(12)]), 0);
    });
  } finally { await db.close(); }
});
