import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { pathToFileURL } from "node:url";

// Real migrations and SQL roles in memory. Auth is a minimal fixture; no secrets,
// network or hosted services. PGlite is single-connection, not a concurrency test.
test("feedback writes stay server-controlled and quota-enforced", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to an existing local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const migration = async (name) => db.exec(await readFile(new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8"));
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const insert = (userId, createdAt = "2001-01-01T00:00:00Z") => db.query(
    `insert into public.feedback_requests(user_id,kind,message,created_at)
     values($1,'general_suggestion','A useful fixture suggestion.',$2) returning id,created_at`,
    [userId, createdAt],
  );
  const asRole = async (role, userId, work) => {
    assert.ok(["anon", "authenticated", "service_role"].includes(role));
    await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)", [userId ?? "", role]);
    await db.exec(`set role ${role}`);
    try { return await work(); } finally { await db.exec("reset role"); }
  };
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}');
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.role() returns text language sql stable as
        $$ select current_setting('request.jwt.claim.role',true) $$;
      grant usage on schema auth to anon,authenticated,service_role;`);
    for (const name of ["001_auth_user_data", "013_feedback_account_admin", "018_owner_role", "019_security_defense_in_depth"]) await migration(name);
    for (let n = 1; n <= 4; n++) {
      await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)", [uid(n), { username: `fixture_${n}` }]);
    }
    await db.query("select set_config('request.jwt.claim.role','service_role',false)");
    await db.query("update public.profiles set role='admin' where id=$1", [uid(4)]);

    await t.test("pre-fix proof: browser inserts bypass the route and backdate past its count", async () => {
      await asRole("authenticated", uid(1), async () => {
        for (let i = 0; i < 11; i++) await insert(uid(1));
      });
      assert.equal(await scalar("select count(*)::int from feedback_requests"), 11);
      assert.equal(await scalar("select count(*)::int from feedback_requests where created_at>=clock_timestamp()-interval '1 hour'"), 0);
    });

    await migration("042_feedback_submission_guard");

    await t.test("migration preserves existing rows and blocks direct browser writes including admin accounts", async () => {
      assert.equal(await scalar("select count(*)::int from feedback_requests where created_at='2001-01-01T00:00:00Z'"), 11);
      for (const [role, userId] of [["anon", null], ["authenticated", uid(1)], ["authenticated", uid(4)]]) {
        await asRole(role, userId, async () => {
          await assert.rejects(insert(userId ?? uid(1)), /permission denied/);
          await assert.rejects(db.query("update feedback_requests set message='A changed fixture message.'"), /permission denied/);
          await assert.rejects(db.query("delete from feedback_requests"), /permission denied/);
        });
      }
      assert.equal(await scalar("select count(*)::int from feedback_requests"), 11);
    });

    await t.test("server timestamps override caller dates, first ten succeed and eleventh is rejected", async () => {
      const before = Number(await scalar("select extract(epoch from clock_timestamp())*1000"));
      await asRole("service_role", null, async () => {
        for (let i = 0; i < 10; i++) await insert(uid(1), i % 2 ? "2099-01-01T00:00:00Z" : "2001-01-01T00:00:00Z");
        await assert.rejects(insert(uid(1)), (error) => error.code === "P0001" && error.message === "feedback_rate_limited");
      });
      const times = (await db.query("select extract(epoch from created_at)*1000 as ms from feedback_requests where created_at>'2001-01-02' and user_id=$1", [uid(1)])).rows;
      assert.equal(times.length, 10);
      const after = Number(await scalar("select extract(epoch from clock_timestamp())*1000"));
      assert.ok(times.every(({ ms }) => Number(ms) >= before && Number(ms) <= after));
    });

    await t.test("quota is per user and own-row reads and server-side admin resolution still work", async () => {
      let feedbackId;
      await asRole("service_role", null, async () => {
        feedbackId = (await insert(uid(2))).rows[0].id;
        await db.query("update feedback_requests set status='resolved',resolved_by=$1,resolved_at=clock_timestamp() where id=$2", [uid(4), feedbackId]);
      });
      await asRole("authenticated", uid(2), async () => {
        const rows = (await db.query("select id,user_id,status from feedback_requests")).rows;
        assert.deepEqual(rows, [{ id: feedbackId, user_id: uid(2), status: "resolved" }]);
      });
      await asRole("authenticated", uid(4), async () => {
        assert.equal(await scalar("select count(*)::int from feedback_requests"), 22);
      });
    });

    await t.test("rolled-back inserts consume no quota and expired rows leave the rolling window", async () => {
      await asRole("service_role", null, async () => {
        await db.exec("begin");
        for (let i = 0; i < 10; i++) await insert(uid(3));
        await db.exec("rollback");
        assert.equal(await scalar("select count(*)::int from feedback_requests where user_id=$1", [uid(3)]), 0);
        for (let i = 0; i < 10; i++) await insert(uid(3));
      });
      // Change only isolated fixture timestamps to simulate time passing.
      await db.query("update feedback_requests set created_at=clock_timestamp()-interval '2 hours' where user_id=$1", [uid(3)]);
      await asRole("service_role", null, async () => { await insert(uid(3)); });
      assert.equal(await scalar("select count(*)::int from feedback_requests where user_id=$1 and created_at>=clock_timestamp()-interval '1 hour'", [uid(3)]), 1);
    });

    await t.test("invalid inserts roll back and the trigger cannot be invoked by browser roles", async () => {
      await asRole("service_role", null, async () => {
        await assert.rejects(insert(null), (error) => error.code === "23502");
        await assert.rejects(db.query("insert into feedback_requests(user_id,kind,message) values($1,'general_suggestion','short')", [uid(2)]), (error) => error.code === "23514");
      });
      for (const role of ["anon", "authenticated"]) {
        assert.equal(await scalar("select has_function_privilege($1,'public.guard_feedback_submission()','EXECUTE')", [role]), false);
      }
      assert.equal(await scalar("select relrowsecurity from pg_class where oid='public.feedback_requests'::regclass"), true);
    });
  } finally { await db.close(); }
});
