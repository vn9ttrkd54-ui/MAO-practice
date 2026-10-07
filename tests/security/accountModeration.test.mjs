import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import rules from "../../lib/auth/publicNameRules.json" with { type: "json" };
import { blockedNames, allowedNames } from "../publicNames.test.mjs";

test("068 account moderation against PostgreSQL, real roles and stale identities", async t => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to the local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const id = n => `00000000-0000-4000-8000-${String(n).padStart(12,"0")}`;
  const scalar = async (sql,args=[]) => Object.values((await db.query(sql,args)).rows[0])[0];
  const migration = async name => db.exec(await readFile(new URL(`../../supabase/migrations/${name}`,import.meta.url),"utf8"));
  let serial=100;
  const act = (actor,target,action,version=0,request=id(serial++),reason="Reviewed by moderator") => scalar("select moderate_account($1,$2,$3,$4,$5,$6)",[id(actor),id(target),action,reason,version,request]);
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create role authenticator;
      create schema auth;
      create function auth.uid() returns uuid language sql as $$select nullif(current_setting('test.user',true),'')::uuid$$;
      grant usage on schema auth,public to anon,authenticated,service_role;
      create table auth.users(id uuid primary key,email text,encrypted_password text,raw_app_meta_data jsonb not null default '{}',raw_user_meta_data jsonb not null default '{}');
      create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,username text unique not null check(username ~ '^[a-z0-9_]{3,20}$'),display_name text,role text not null default 'user');
      create table public.user_levels(user_id uuid primary key references auth.users(id) on delete cascade,level integer default 7);
      create table public.question_progress(user_id uuid references auth.users(id) on delete cascade,question_id integer,attempts integer,correct integer);
      create table public.multiplayer_rooms(id uuid primary key,host_player_id uuid,status text default 'waiting',countdown_ends_at timestamptz,state_version bigint default 0);
      create table public.multiplayer_players(id uuid primary key,room_id uuid references multiplayer_rooms(id),user_id uuid references auth.users(id) on delete cascade,guest_nickname text,connected boolean default true,updated_at timestamptz default now(),left_at timestamptz,lobby_ready_settings_version bigint,score integer default 99,unique(room_id,id));
      alter table multiplayer_rooms add constraint host_fk foreign key(id,host_player_id) references multiplayer_players(room_id,id) deferrable initially deferred;
      alter table question_progress enable row level security;
      create policy own_progress on question_progress to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
      grant select,insert,update,delete on question_progress to authenticated;
      alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
      alter default privileges in schema public grant execute on functions to anon,authenticated,service_role;
      insert into auth.users(id,email,encrypted_password) select ('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,'student_'||n||'@users.mao-practice.local','unchanged-hash' from generate_series(1,9)n;
      insert into profiles select id,'student_'||row_number() over(order by id),'Safe name',case right(id::text,1) when '1' then 'owner' when '2' then 'admin' else 'user' end from auth.users;
      insert into user_levels(user_id) select id from auth.users;
      insert into question_progress select id,10238,5,3 from auth.users;`);
    // Legacy name seeded before installing the filter, never a live account.
    await db.query("update profiles set username='alligatorraper' where id=$1",[id(7)]);
    await migration("057_google_auth_public_names.sql");
    await migration("002_username_availability.sql");
    await migration("047_multiplayer_host_account_deletion.sql");
    const before = await scalar("select jsonb_agg(to_jsonb(p) order by user_id) from question_progress p");
    await t.test("an unrelated pre-request hook stops installation without partial changes", async () => {
      await db.exec("alter role authenticator set pgrst.db_pre_request='public.existing_security_check'");
      await assert.rejects(migration("068_account_moderation.sql"),/existing PostgREST pre-request hook/);
      await db.exec("rollback");
      assert.equal(await scalar("select to_regclass('public.account_moderation')"),null);
      assert.equal(await scalar("select count(*)::int from auth.users"),9);
      await db.exec("alter role authenticator reset pgrst.db_pre_request");
    });
    await migration("068_account_moderation.sql");
    await t.test("installation preserves every account and progress row; JS and SQL filters agree", async () => {
      assert.equal(await scalar("select count(*)::int from auth.users"),9);
      assert.equal(await scalar("select count(*)::int from account_moderation"),0);
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(p) order by user_id) from question_progress p"),before);
      for (const name of blockedNames) assert.equal(await scalar("select is_public_name_allowed($1)",[name]),false,name);
      for (const name of allowedNames) assert.equal(await scalar("select is_public_name_allowed($1)",[name]),true,name);
      for (const [kind,terms] of Object.entries(rules)) assert.deepEqual((await db.query("select term from public_name_rules where match_kind=$1 order by term",[kind])).rows.map(r=>r.term),[...terms].sort());
    });
    await t.test("regular users, self, protected roles and nonowner deletion are denied", async () => {
      for (const args of [[3,4,"suspend"],[2,2,"suspend"],[1,2,"suspend"],[2,1,"require_name_change"],[1,1,"delete"],[2,4,"delete"]]) await assert.rejects(act(...args));
      assert.equal(await scalar("select count(*)::int from account_moderation_audit"),0);
      await assert.rejects(db.query("delete from auth.users where id=$1",[id(1)]),e=>e.code==="42501");
      await assert.rejects(db.query("delete from auth.users where id=$1",[id(2)]),e=>e.code==="42501");
      for(const role of ["anon","authenticated"]) {
        for(const signature of ["moderate_account(uuid,uuid,text,text,bigint,uuid)","resolve_login_username(text)","issue_moderation_verification(uuid,uuid,text)","consume_moderation_verification(uuid,uuid,text)","set_account_username(uuid,text,boolean,text)"])
          assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')",[role,signature]),false);
        for(const table of ["account_moderation","account_moderation_audit","moderation_verifications"])
          for(const privilege of ["SELECT","INSERT","UPDATE","DELETE"])
            assert.equal(await scalar("select has_table_privilege($1,$2,$3)",[role,table,privilege]),false);
      }
      assert.equal(await scalar("select has_table_privilege('service_role','account_moderation_audit','UPDATE')"),false);
    });
    await t.test("an ordinary allowed username can be flagged and still resolves privately for login", async () => {
      const request=id(90);
      await act(2,3,"require_name_change",0,request);
      const placeholder=await scalar("select username from profiles where id=$1",[id(3)]);
      assert.match(placeholder,/^player_[a-f0-9]{12}$/);
      assert.equal(await scalar("select resolve_login_username('student_3')"),id(3));
      assert.equal(await scalar("select is_username_available('student_3')"),false);
      assert.equal(await scalar("select encrypted_password from auth.users where id=$1",[id(3)]),"unchanged-hash");
      assert.equal(await scalar("select email from auth.users where id=$1",[id(3)]),"student_3@users.mao-practice.local");
      await assert.rejects(db.query("update profiles set username='student_3' where id=$1",[id(4)]),e=>e.code==="23505");
      await assert.rejects(db.query("select set_account_username($1,'student_3')",[id(3)]),e=>e.code==="23514");
      await assert.rejects(db.query("select set_account_username($1,'alligatorraper')",[id(3)]),e=>e.code==="23514");
      assert.deepEqual(await act(2,3,"require_name_change",0,request),{success:true,replayed:true});
      await assert.rejects(act(2,3,"suspend",0,request));
      assert.equal(await scalar("select count(*)::int from account_moderation_audit where target_id=$1",[id(3)]),1);
    });
    await t.test("old JWTs cannot bypass direct REST/RPC checks or RLS; guests and active users still work", async () => {
      await db.query("select set_config('test.user',$1,false)",[id(3)]);
      assert.equal(await scalar("select account_is_active()"),false);
      await assert.rejects(db.query("select check_account_access()"),e=>e.code==="PT403");
      await db.exec("set role authenticated");
      assert.equal(await scalar("select count(*)::int from question_progress"),0);
      await assert.rejects(db.query("insert into question_progress values($1,1,1,0)",[id(3)]),e=>e.code==="42501");
      await assert.rejects(db.query("select resolve_login_username('student_3')"),e=>e.code==="42501");
      await db.query("select set_config('test.user',$1,false)",[id(4)]);
      assert.equal(await scalar("select account_is_active()"),true);
      assert.equal(await scalar("select count(*)::int from question_progress"),1);
      await db.exec("reset role");
      await db.query("select set_config('test.user','',false)");
      assert.equal(await scalar("select account_is_active()"),true);
      assert.ok(await scalar("select exists(select 1 from pg_db_role_setting s join pg_roles r on r.oid=s.setrole where r.rolname='authenticator' and 'pgrst.db_pre_request=public.check_account_access'=any(s.setconfig))"));
    });
    await t.test("the reported legacy name can be hidden without breaking its private login", async () => {
      assert.equal(await scalar("select username from profiles where id=$1",[id(7)]),"alligatorraper");
      await act(2,7,"require_name_change");
      assert.match(await scalar("select username from profiles where id=$1",[id(7)]),/^player_[0-9a-f]{12}$/);
      assert.equal(await scalar("select resolve_login_username('alligatorraper')"),id(7));
      assert.doesNotMatch(await scalar("select raw_user_meta_data::text from auth.users where id=$1",[id(7)]),/alligatorraper/);
      await db.query("select set_account_username($1,'regular_student_7')",[id(7)]);
      assert.equal(await scalar("select resolve_login_username('alligatorraper')"),null);
      assert.equal(await scalar("select resolve_login_username('regular_student_7')"),id(7));
    });
    await t.test("suspension cannot be cleared by renaming; restore preserves a pending name requirement", async () => {
      await assert.rejects(act(2,3,"suspend",0),e=>e.code==="40001");
      await act(2,3,"suspend",1);
      await assert.rejects(db.query("select set_account_username($1,'new_student')",[id(3)]),e=>e.code==="42501");
      await act(2,3,"restore",2);
      assert.equal(await scalar("select raw_app_meta_data->>'requires_name_change' from auth.users where id=$1",[id(3)]),"true");
      await db.query("select set_account_username($1,'new_student')",[id(3)]);
      assert.equal(await scalar("select resolve_login_username('new_student')"),id(3));
      assert.equal(await scalar("select resolve_login_username('student_3')"),null);
      assert.equal(await scalar("select raw_app_meta_data->>'requires_name_change' from auth.users where id=$1",[id(3)]),"false");
      assert.equal(await scalar("select version::int from account_moderation where user_id=$1",[id(3)]),4);
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(p) order by user_id) from question_progress p"),before);
      assert.equal(await scalar("select level from user_levels where user_id=$1",[id(3)]),7);
    });
    await t.test("a voluntary username change invalidates an admin's stale account review", async () => {
      await db.query("select set_account_username($1,'updated_student_9')",[id(9)]);
      assert.equal(await scalar("select version::int from account_moderation where user_id=$1",[id(9)]),1);
      await assert.rejects(act(2,9,"require_name_change",0),e=>e.code==="40001");
      assert.equal(await scalar("select username from profiles where id=$1",[id(9)]),"updated_student_9");
    });
    await t.test("Google proof is same-account, same-session, expiring, purpose-separated and single-use", async () => {
      const hash="a".repeat(64);
      await assert.rejects(db.query("select issue_moderation_verification($1,$2,$3)",[id(3),id(30),hash]),e=>e.code==="42501");
      await db.query("select issue_moderation_verification($1,$2,$3)",[id(2),id(30),hash]);
      for(const args of [[id(1),id(30),hash],[id(2),id(31),hash],[id(2),id(30),"b".repeat(64)]]) assert.equal(await scalar("select consume_moderation_verification($1,$2,$3)",args),false);
      assert.equal(await scalar("select consume_google_delete_verification($1,$2,$3)",[id(2),id(30),hash]),false);
      assert.equal(await scalar("select consume_moderation_verification($1,$2,$3)",[id(2),id(30),hash]),true);
      assert.equal(await scalar("select consume_moderation_verification($1,$2,$3)",[id(2),id(30),hash]),false);
      await db.query("select issue_moderation_verification($1,$2,$3)",[id(2),id(30),hash]);
      await db.exec("update moderation_verifications set expires_at=clock_timestamp()-interval '1 second'");
      assert.equal(await scalar("select consume_moderation_verification($1,$2,$3)",[id(2),id(30),hash]),false);
    });
    await t.test("owner deletion preserves the audit and other players, cancels unstarted hosted room, rolls back on FK failure", async () => {
      await db.query("insert into multiplayer_rooms(id) values($1)",[id(50)]);
      await db.query("insert into multiplayer_players(id,room_id,user_id) values($1,$3,$4),($2,$3,$5)",[id(51),id(52),id(50),id(5),id(6)]);
      await db.query("update multiplayer_rooms set host_player_id=$1 where id=$2",[id(51),id(50)]);
      await db.exec("create table deletion_blocker(user_id uuid references auth.users(id))");
      await db.query("insert into deletion_blocker values($1)",[id(5)]);
      await assert.rejects(act(1,5,"delete"),e=>e.code==="23503");
      assert.equal(await scalar("select count(*)::int from auth.users where id=$1",[id(5)]),1);
      assert.equal(await scalar("select count(*)::int from account_moderation_audit where target_id=$1",[id(5)]),0);
      await db.query("delete from deletion_blocker where user_id=$1",[id(5)]);
      await act(1,5,"delete");
      assert.equal(await scalar("select count(*)::int from auth.users where id=$1",[id(5)]),0);
      assert.equal(await scalar("select count(*)::int from question_progress where user_id=$1",[id(5)]),0);
      assert.equal(await scalar("select count(*)::int from account_moderation_audit where target_id=$1",[id(5)]),1);
      assert.equal(await scalar("select status from multiplayer_rooms where id=$1",[id(50)]),"cancelled");
      assert.equal(await scalar("select host_player_id from multiplayer_rooms where id=$1",[id(50)]),null);
      assert.equal(await scalar("select score from multiplayer_players where user_id=$1",[id(6)]),99);
      await db.query("select set_config('test.user',$1,false)",[id(5)]);
      assert.equal(await scalar("select account_is_active()"),false,"deleted identity cannot reuse its unexpired JWT");
      await db.query("select set_config('test.user','',false)");
    });
    await t.test("database moderation rate cap also applies to verified owners", async () => {
      const priorCount=await scalar("select count(*)::int from account_moderation_audit where actor_id=$1",[id(1)]);
      let version=0;
      for(let n=priorCount;n<10;n++,version++) await act(1,8,version%2===0?"suspend":"restore",version);
      await assert.rejects(act(1,8,version%2===0?"suspend":"restore",version),e=>e.code==="P0001");
    });
    await t.test("database role rechecks defeat demotion and forged actor identifiers without privilege", async () => {
      await db.query("update profiles set role='user' where id=$1",[id(2)]);
      await assert.rejects(act(2,7,"suspend"),e=>e.code==="42501");
      await db.exec("set role authenticated");
      await assert.rejects(act(1,7,"suspend"),e=>e.code==="42501");
      await db.exec("reset role");
    });
  } finally { await db.close(); }
});
