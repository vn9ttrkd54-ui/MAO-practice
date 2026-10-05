import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

test("password signup identity boundary preserves Google and existing accounts", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const metadata = username => ({ username, age_13_or_older: true,
    terms_version: "2026-09-07", privacy_version: "2026-09-07", terms_accepted_at: new Date().toISOString() });
  const insert = (n, email, userMeta, appMeta = { provider: "email" }) => db.query(
    "insert into auth.users(id,email,raw_user_meta_data,raw_app_meta_data) values($1,$2,$3,$4)",
    [uid(n), email, userMeta, appMeta]);
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,raw_app_meta_data jsonb not null default '{}',raw_user_meta_data jsonb not null default '{}');
      create table profiles(id uuid primary key references auth.users(id),username text unique not null check(username ~ '^[a-z0-9_]{3,20}$'),display_name text);
      create table user_levels(user_id uuid primary key references auth.users(id));
      create table multiplayer_players(id uuid primary key,guest_nickname text);`);
    await db.exec(await readFile(new URL("../../supabase/migrations/057_google_auth_public_names.sql", import.meta.url), "utf8"));
    await db.exec("create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user()");
    await t.test("pre-fix: a password signup can claim a real address", async () => {
      await insert(1, "existing@example.test", metadata("existing"));
    });
    const before = (await db.query("select * from auth.users order by id")).rows;
    await db.exec(await readFile(new URL("../../supabase/migrations/066_password_signup_identity_boundary.sql", import.meta.url), "utf8"));
    await t.test("migration does not rewrite existing accounts or profiles", async () => {
      assert.deepEqual((await db.query("select * from auth.users order by id")).rows, before);
      assert.equal((await db.query("select username from profiles where id=$1", [uid(1)])).rows[0].username, "existing");
    });
    await t.test("real addresses, mismatched aliases and spoofed user metadata fail atomically", async () => {
      for (const [email, meta] of [
        ["victim@example.test", metadata("attacker")],
        ["other@users.mao-practice.local", metadata("attacker")],
        [null, metadata("attacker")],
        ["attacker@users.mao-practice.local", {}],
        ["victim@example.test", { ...metadata("attacker"), provider: "google", email_verified: true,
          app_metadata: { provider: "google" }, raw_app_meta_data: { provider: "google" } }],
      ]) await assert.rejects(insert(2, email, meta), e => e.code === "23514");
      assert.equal((await db.query("select count(*)::int as n from auth.users")).rows[0].n, 1);
      assert.equal((await db.query("select count(*)::int as n from profiles")).rows[0].n, 1);
    });
    await t.test("normal password signup and legal/name validation still work", async () => {
      await insert(2, "math_student@users.mao-practice.local", metadata("math_student"));
      await assert.rejects(insert(3, "missing_consent@users.mao-practice.local", { username: "missing_consent" }));
      await assert.rejects(insert(3, "f_u_c_k@users.mao-practice.local", metadata("f_u_c_k")), e => e.code === "23514");
    });
    await t.test("trusted Google signup still enters private-name onboarding", async () => {
      await insert(3, "google@example.test", { full_name: "Not Public", provider: "email" }, { provider: "google" });
      const row = (await db.query("select p.username,u.raw_app_meta_data from profiles p join auth.users u on u.id=p.id where p.id=$1", [uid(3)])).rows[0];
      assert.match(row.username, /^g_[0-9a-f]{18}$/);
      assert.equal(row.raw_app_meta_data.needs_username, true);
      assert.equal(row.raw_app_meta_data.password_login_enabled, false);
    });
    await t.test("later account updates remain available for verified email changes and recovery", async () => {
      await db.query("update auth.users set email='verified@example.test' where id=$1", [uid(2)]);
      await db.query("select set_account_username($1,'renamed_student')", [uid(2)]);
      assert.equal((await db.query("select email from auth.users where id=$1", [uid(2)])).rows[0].email, "verified@example.test");
    });
    await t.test("browser roles cannot call or bypass the guard directly", async () => {
      for (const role of ["anon", "authenticated"]) {
        assert.equal((await db.query("select has_function_privilege($1,'public.guard_password_signup_identity()','EXECUTE') as allowed", [role])).rows[0].allowed, false);
      }
      const fn = (await db.query("select prosecdef,proconfig from pg_proc where oid='public.guard_password_signup_identity()'::regprocedure")).rows[0];
      assert.equal(fn.prosecdef, false);
      assert.ok(fn.proconfig.includes('search_path=""'));
    });
  } finally { await db.close(); }
});
