import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import rules from "../../lib/auth/publicNameRules.json" with { type: "json" };
import { blockedNames, allowedNames } from "../publicNames.test.mjs";

test("Google signup, atomic setup, moderation and single-use verification in PostgreSQL", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH,"Set PGLITE_MODULE_PATH to a local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12,"0")}`;
  const scalar = async (sql,args=[]) => Object.values((await db.query(sql,args)).rows[0])[0];
  const migration = await readFile(new URL("../../supabase/migrations/057_google_auth_public_names.sql",import.meta.url),"utf8");
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key,email text,raw_app_meta_data jsonb not null default '{}',raw_user_meta_data jsonb not null default '{}');
      create table profiles(id uuid primary key references auth.users(id) on delete cascade,username text not null unique check(username ~ '^[a-z0-9_]{3,20}$'),display_name text);
      create table user_levels(user_id uuid primary key references auth.users(id) on delete cascade);
      create table multiplayer_players(id uuid primary key,guest_nickname text);
      grant usage on schema public to anon,authenticated,service_role;
      grant select,insert,update,delete on all tables in schema public to service_role;
      alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
      alter default privileges in schema public grant execute on functions to anon,authenticated,service_role;
      insert into auth.users(id) values('${uid(99)}');
      insert into profiles values('${uid(99)}','fuck_legacy','fuck_legacy');`);
    await db.exec(migration);
    const upgrade=await readFile(new URL("../../supabase/migrations/068_account_moderation.sql",import.meta.url),"utf8");
    // Exercise the incremental rules on the existing 057 schema; full 068
    // permissions and moderation operations have their own database suite.
    const addedRules=JSON.parse(upgrade.split("$rules$")[1]);
    await db.query("insert into public_name_rules(term,match_kind) select jsonb_array_elements_text(value),key from jsonb_each($1::jsonb) on conflict do nothing",[JSON.stringify(addedRules)]);
    await db.exec("create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user()");
    await t.test("client/server name rules agree, and existing names are untouched", async () => {
      const originalRules=JSON.parse(migration.split("$rules$")[1]);
      for(const kind of Object.keys(rules)) assert.deepEqual([...new Set([...originalRules[kind],...addedRules[kind]])],rules[kind]);
      for (const name of blockedNames) assert.equal(await scalar("select is_public_name_allowed($1)",[name]),false,name);
      for (const name of allowedNames) assert.equal(await scalar("select is_public_name_allowed($1)",[name]),true,name);
      assert.equal(await scalar("select username from profiles where id=$1",[uid(99)]),"fuck_legacy");
      await db.query("update profiles set display_name='unchanged profile' where id=$1",[uid(99)]);
    });
    await t.test("Google gets an opaque pending profile, never its real name or supplied username", async () => {
      await db.query("insert into auth.users(id,email,raw_app_meta_data,raw_user_meta_data) values($1,'private@example.test','{\"provider\":\"google\"}', '{\"full_name\":\"Private Name\",\"username\":\"fuck\",\"needs_username\":false}')",[uid(1)]);
      const account=(await db.query("select * from auth.users where id=$1",[uid(1)])).rows[0];
      assert.equal(account.raw_app_meta_data.needs_username,true);
      assert.equal(account.raw_app_meta_data.password_login_enabled,false);
      const profile=(await db.query("select * from profiles where id=$1",[uid(1)])).rows[0];
      assert.match(profile.username,/^g_[0-9a-f]{18}$/);
      assert.equal(profile.display_name,null);
      assert.equal(await scalar("select count(*)::int from user_levels where user_id=$1",[uid(1)]),1);
    });
    await t.test("regular signup requires legal consent and a clean public name", async () => {
      const meta={username:"math_student",age_13_or_older:true,terms_version:"2026-09-07",privacy_version:"2026-09-07",terms_accepted_at:new Date().toISOString()};
      await assert.rejects(db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)",[uid(2),JSON.stringify({username:"math_student"})]));
      await assert.rejects(db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)",[uid(2),JSON.stringify({...meta,username:"f_u_c_k"})]),e=>e.code==="23514");
      await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)",[uid(2),JSON.stringify(meta)]);
      assert.equal(await scalar("select username from profiles where id=$1",[uid(2)]),"math_student");
    });
    await t.test("setup is atomic, respects legal version and conflicts, preserves account identity", async () => {
      await assert.rejects(db.query("select set_account_username($1,'new_name',true,'wrong-version')",[uid(1)]));
      await assert.rejects(db.query("select set_account_username($1,'new_name')",[uid(1)]));
      await assert.rejects(db.query("select set_account_username($1,'math_student',true,'2026-09-07')",[uid(1)]),e=>e.code==="23505");
      assert.equal(await scalar("select (raw_app_meta_data->>'needs_username')::boolean from auth.users where id=$1",[uid(1)]),true);
      await db.query("select set_account_username($1,'google_math',true,'2026-09-07')",[uid(1)]);
      const account=(await db.query("select * from auth.users where id=$1",[uid(1)])).rows[0];
      assert.equal(account.raw_app_meta_data.needs_username,false);
      assert.equal(account.raw_user_meta_data.username,"google_math");
      assert.equal(account.raw_user_meta_data.age_13_or_older,true);
      assert.equal(account.email,"private@example.test");
      await assert.rejects(db.query("select set_account_username($1,'again',true,'2026-09-07')",[uid(1)]));
      await db.query("select set_account_username($1,'new_name')",[uid(2)]);
      assert.equal(await scalar("select raw_user_meta_data->>'username' from auth.users where id=$1",[uid(2)]),"new_name");
    });
    await t.test("direct profile and guest writes cannot bypass the filter", async () => {
      for (const name of blockedNames.filter(n=>/^[a-z0-9_]{3,20}$/.test(n))) await assert.rejects(db.query("update profiles set username=$1 where id=$2",[name,uid(2)]),e=>e.code==="23514");
      for (const name of blockedNames) await assert.rejects(db.query("insert into multiplayer_players values($1,$2)",[uid(5),name]),e=>e.code==="23514");
      await db.query("insert into multiplayer_players values($1,'Assistant'),($2,null)",[uid(5),uid(6)]);
      await assert.rejects(db.query("update multiplayer_players set guest_nickname='b1tch' where id=$1",[uid(5)]),e=>e.code==="23514");
    });
    await t.test("API roles cannot edit moderation or mint/consume verification", async () => {
      for (const role of ["anon","authenticated"]) {
        assert.equal(await scalar("select has_table_privilege($1,'public.public_name_rules','INSERT')",[role]),false);
        assert.equal(await scalar("select has_table_privilege($1,'public.google_delete_verifications','SELECT')",[role]),false);
        for (const signature of ["set_account_username(uuid,text,boolean,text)","issue_google_delete_verification(uuid,uuid,text)","consume_google_delete_verification(uuid,uuid,text)"]) assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')",[role,signature]),false);
      }
      assert.equal(await scalar("select has_function_privilege('service_role','set_account_username(uuid,text,boolean,text)','EXECUTE')"),true);
      await db.exec("set role anon");
      assert.equal(await scalar("select is_public_name_allowed('math_student')"),true);
      await assert.rejects(db.query("select set_account_username($1,'taken_name')",[uid(2)]),e=>e.code==="42501");
      await db.exec("reset role");
    });
    await t.test("delete proof is expiring, same-account/session and single-use", async () => {
      const hash="a".repeat(64),session=uid(20);
      await db.query("select issue_google_delete_verification($1,$2,$3)",[uid(1),session,hash]);
      for (const args of [[uid(2),session,hash],[uid(1),uid(21),hash],[uid(1),session,"b".repeat(64)]]) assert.equal(await scalar("select consume_google_delete_verification($1,$2,$3)",args),false);
      assert.equal(await scalar("select consume_google_delete_verification($1,$2,$3)",[uid(1),session,hash]),true);
      assert.equal(await scalar("select consume_google_delete_verification($1,$2,$3)",[uid(1),session,hash]),false);
      await db.query("select issue_google_delete_verification($1,$2,$3)",[uid(1),session,hash]);
      await db.exec("update google_delete_verifications set expires_at=clock_timestamp()-interval '1 second'");
      assert.equal(await scalar("select consume_google_delete_verification($1,$2,$3)",[uid(1),session,hash]),false);
    });
  } finally { await db.close(); }
});
