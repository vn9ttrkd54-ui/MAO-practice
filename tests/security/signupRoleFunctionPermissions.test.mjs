import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

// Actual migrations and synthetic Auth roles only; no hosted users or credentials.
test("signup and role function permissions preserve Auth triggers and signed-in RLS", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to an existing local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const signatures = ["public.handle_new_user()", "public.is_admin()", "public.is_owner()"];
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const migration = async (name) => db.exec(await readFile(
    new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8",
  ));
  const canExecute = (role, signature) => scalar(
    "select has_function_privilege($1::name,$2::text,'EXECUTE')", [role, signature],
  );
  const asRole = async (role, n, work) => {
    assert.ok(["anon", "authenticated", "service_role", "supabase_auth_admin", "fixture_unprivileged"].includes(role));
    await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)", [n ? uid(n) : "", role]);
    await db.exec(`set role ${role}`);
    try { return await work(); } finally { await db.exec("reset role"); }
  };
  const consent = (username) => ({
    username, age_13_or_older: true, terms_version: "2026-09-07",
    privacy_version: "2026-09-07", terms_accepted_at: "2026-10-03T05:00:00Z",
  });
  const signup = (n, username, appMetadata = {}) => db.query(
    "insert into auth.users(id,raw_user_meta_data,raw_app_meta_data) values($1,$2,$3)",
    [uid(n), consent(username), appMetadata],
  );
  const dataSnapshot = async () => {
    const snapshot = {};
    for (const table of ["auth.users", "public.profiles", "public.user_levels", "public.feedback_requests", "public.public_name_rules"]) {
      snapshot[table] = await scalar(
        `select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text),'[]'::jsonb) from ${table} t`,
      );
    }
    return snapshot;
  };
  const securitySnapshot = async () => ({
    tables: (await db.query(`select oid,relname,relacl::text,relrowsecurity,relforcerowsecurity
      from pg_class where relnamespace in ('public'::regnamespace,'auth'::regnamespace) order by oid`)).rows,
    policies: (await db.query("select * from pg_policies order by schemaname,tablename,policyname")).rows,
    triggers: (await db.query("select oid,pg_get_triggerdef(oid) as definition from pg_trigger where not tgisinternal order by oid")).rows,
    functions: (await db.query(`select oid,proowner,pg_get_functiondef(oid) as definition
      from pg_proc where pronamespace='public'::regnamespace and prokind='f' order by oid`)).rows,
    otherFunctionGrants: (await db.query(`select oid,proacl::text from pg_proc
      where pronamespace='public'::regnamespace
      and oid not in ($1::regprocedure,$2::regprocedure,$3::regprocedure) order by oid`, signatures)).rows,
    defaults: (await db.query("select * from pg_default_acl order by oid")).rows,
  });

  try {
    await db.exec(`
      create role anon; create role authenticated; create role service_role bypassrls;
      create role supabase_auth_admin; create role fixture_unprivileged;
      grant usage on schema public to anon,authenticated,service_role,supabase_auth_admin,fixture_unprivileged;
      create schema auth;
      create table auth.users(id uuid primary key,email text,
        raw_app_meta_data jsonb not null default '{}',raw_user_meta_data jsonb not null default '{}');
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.role() returns text language sql stable as
        $$ select current_setting('request.jwt.claim.role',true) $$;
      grant usage on schema auth to anon,authenticated,service_role,supabase_auth_admin;
      grant insert on auth.users to supabase_auth_admin;
      alter default privileges in schema public grant execute on functions to anon,authenticated,service_role;
    `);
    for (const name of ["001_auth_user_data", "002_username_availability", "013_feedback_account_admin", "018_owner_role", "019_security_defense_in_depth"]) {
      await migration(name);
    }
    await db.exec("create table public.multiplayer_players(id uuid primary key,guest_nickname text)");
    await migration("057_google_auth_public_names");
    for (let n = 1; n <= 4; n++) await signup(n, `fixture_${n}`);
    await db.query("select set_config('request.jwt.claim.role','service_role',false)");
    await db.query("update public.profiles set role='admin' where id=$1", [uid(3)]);
    await db.query("update public.profiles set role='owner' where id=$1", [uid(4)]);
    await db.query(`insert into public.feedback_requests(user_id,kind,message)
      values($1,'general_suggestion','First private feedback'),($2,'general_suggestion','Second private feedback')`, [uid(1), uid(2)]);

    await t.test("explicit API grants reproduce the live permissions before cleanup", async () => {
      for (const signature of signatures) {
        for (const role of ["anon", "authenticated"]) assert.equal(await canExecute(role, signature), true);
      }
      await asRole("anon", 0, async () => {
        assert.equal(await scalar("select public.is_admin()"), false);
        assert.equal(await scalar("select public.is_owner()"), false);
      });
    });

    await t.test("cleanup preserves records, function bodies, triggers, policies and unrelated grants", async () => {
      const beforeData = await dataSnapshot();
      const beforeSecurity = await securitySnapshot();
      await migration("058_signup_role_function_permissions");
      assert.deepEqual(await dataSnapshot(), beforeData);
      assert.deepEqual(await securitySnapshot(), beforeSecurity);
    });

    await t.test("only the intended API execution permissions change", async () => {
      for (const role of ["public", "anon", "authenticated", "fixture_unprivileged", "supabase_auth_admin"]) {
        assert.equal(await canExecute(role, signatures[0]), false, `${role}: signup trigger`);
      }
      for (const signature of signatures.slice(1)) {
        for (const role of ["public", "anon", "fixture_unprivileged"]) assert.equal(await canExecute(role, signature), false);
        assert.equal(await canExecute("authenticated", signature), true);
      }
      for (const signature of signatures) assert.equal(await canExecute("service_role", signature), true);
      for (const role of ["anon", "authenticated"]) {
        for (const signature of ["public.is_username_available(text)", "public.is_public_name_allowed(text)"]) {
          assert.equal(await canExecute(role, signature), true);
        }
        await asRole(role, 1, async () => {
          assert.equal(await scalar("select public.is_username_available('unused_name')"), true);
          assert.equal(await scalar("select public.is_public_name_allowed('math_student')"), true);
        });
      }
    });

    await t.test("anonymous role checks are denied and signed-in checks stay caller-specific", async () => {
      await asRole("anon", 0, async () => {
        for (const sql of ["select public.is_admin()", "select public.is_owner()"]) {
          await assert.rejects(db.query(sql), (error) => error.code === "42501");
        }
      });
      for (const n of [0, 1, 2, 3, 4, 9]) await asRole("authenticated", n, async () => {
        assert.equal(await scalar("select public.is_admin()"), n === 3 || n === 4);
        assert.equal(await scalar("select public.is_owner()"), n === 4);
      });
    });

    await t.test("neither browser API role can directly execute the signup trigger", async () => {
      for (const role of ["anon", "authenticated"]) await asRole(role, 1, async () => {
        await assert.rejects(db.query("select public.handle_new_user()"), (error) => error.code === "42501");
      });
    });

    await t.test("signed-in feedback RLS still separates regular users from administrators", async () => {
      for (const n of [1, 2, 3, 4]) await asRole("authenticated", n, async () => {
        assert.equal(await scalar("select count(*)::int from public.feedback_requests"), n >= 3 ? 2 : 1);
        assert.equal(await scalar("select count(*)::int from public.profiles"), 1);
        await assert.rejects(db.query("update public.profiles set role='owner'"), (error) => error.code === "42501");
      });
    });

    await t.test("existing Auth trigger creates password and Google profiles without direct EXECUTE", async () => {
      await asRole("supabase_auth_admin", 0, async () => {
        await signup(10, "password_student");
        await signup(11, "ignored_google_name", { provider: "google" });
      });
      assert.equal(await scalar("select username from public.profiles where id=$1", [uid(10)]), "password_student");
      const google = (await db.query("select username,display_name from public.profiles where id=$1", [uid(11)])).rows[0];
      assert.match(google.username, /^g_[0-9a-f]{18}$/);
      assert.equal(google.display_name, null);
      assert.equal(await scalar("select (raw_app_meta_data->>'needs_username')::boolean from auth.users where id=$1", [uid(11)]), true);
      assert.equal(await scalar("select count(*)::int from public.user_levels where user_id in ($1,$2)", [uid(10), uid(11)]), 2);
    });

    await t.test("signup consent and public-name enforcement still reject invalid accounts atomically", async () => {
      await asRole("supabase_auth_admin", 0, async () => {
        await assert.rejects(db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)", [uid(12), { username: "missing_consent" }]));
        await assert.rejects(signup(13, "f_u_c_k"), (error) => error.code === "23514");
      });
      for (const table of ["auth.users", "public.profiles"]) {
        assert.equal(await scalar(`select count(*)::int from ${table} where id in ($1,$2)`, [uid(12), uid(13)]), 0);
      }
      assert.equal(await scalar("select count(*)::int from public.user_levels where user_id in ($1,$2)", [uid(12), uid(13)]), 0);
    });

    await t.test("reapplying the cleanup leaves the same records and permissions", async () => {
      const beforeData = await dataSnapshot();
      const beforeSecurity = await securitySnapshot();
      const beforeGrants = (await db.query(`select oid,proacl::text from pg_proc
        where oid in ($1::regprocedure,$2::regprocedure,$3::regprocedure) order by oid`, signatures)).rows;
      await migration("058_signup_role_function_permissions");
      assert.deepEqual(await dataSnapshot(), beforeData);
      assert.deepEqual(await securitySnapshot(), beforeSecurity);
      assert.deepEqual((await db.query(`select oid,proacl::text from pg_proc
        where oid in ($1::regprocedure,$2::regprocedure,$3::regprocedure) order by oid`, signatures)).rows, beforeGrants);
    });
  } finally { await db.close(); }
});
