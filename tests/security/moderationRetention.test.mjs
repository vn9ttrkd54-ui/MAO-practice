import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

test("069 retention against isolated PostgreSQL: permissions, deletion, retries and bounded cleanup", async t => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to the local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const id = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const migration = async name => db.exec(await readFile(new URL(`../../supabase/migrations/${name}`, import.meta.url), "utf8"));
  let serial = 1000;
  const act = (actor, target, action, version = 0, request = id(serial++), reason = "Reviewed by moderator") => scalar("select public.moderate_account($1,$2,$3,$4,$5,$6)", [id(actor), id(target), action, reason, version, request]);
  const cleanup = () => scalar("select public.cleanup_account_moderation_retention()");
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
      alter default privileges in schema public grant all on tables to anon,authenticated,service_role,authenticator;
      alter default privileges in schema public grant execute on functions to anon,authenticated,service_role,authenticator;
      insert into auth.users(id,email,encrypted_password) select ('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,'student_'||n||'@users.mao-practice.local','unchanged-hash' from generate_series(1,40)n;
      insert into profiles select id,'student_'||row_number() over(order by id),'Safe name',case right(id::text,12) when '000000000001' then 'owner' when '000000000002' then 'admin' when '000000000010' then 'owner' else 'user' end from auth.users;
      insert into user_levels(user_id) select id from auth.users;
      insert into question_progress select id,10238,5,3 from auth.users;`);
    for (const name of ["057_google_auth_public_names.sql", "002_username_availability.sql", "047_multiplayer_host_account_deletion.sql", "068_account_moderation.sql"]) await migration(name);

    await t.test("missing scheduler stops installation atomically", async () => {
      await assert.rejects(migration("069_account_moderation_retention.sql"), /Install account moderation 068 and pg_cron/);
      await db.exec("rollback");
      assert.equal(await scalar("select to_regclass('public.account_moderation_receipts')"), null);
    });
    // Only emulate job registration/metadata. PGlite cannot run pg_cron workers.
    await db.exec(`create schema cron; create role supabase_admin;
      create table cron.job(jobid bigint generated always as identity primary key,jobname text unique,schedule text,command text,username text,active boolean default true);
      create table cron.job_run_details(runid bigint primary key,jobid bigint,status text,end_time timestamptz,username text not null default 'postgres');
      alter table cron.job_run_details enable row level security;
      create policy cron_job_run_details_policy on cron.job_run_details using(username=current_user);
      grant select,delete on cron.job_run_details to public;
      grant usage on schema cron to supabase_admin;
      grant select on cron.job to supabase_admin;
      create function cron.test_seed_run_history() returns void language sql security definer set search_path='' as $$
        insert into cron.job_run_details(runid,jobid,status,end_time)
          select n,(select jobid from cron.job where jobname='account-moderation-retention'),'succeeded',statement_timestamp()-interval '8 days' from generate_series(1,505)n;
        insert into cron.job_run_details(runid,jobid,status,end_time) values
          (506,(select jobid from cron.job where jobname='account-moderation-retention'),'succeeded',statement_timestamp()),
          (507,999,'succeeded',statement_timestamp()-interval '100 days'),
          (508,(select jobid from cron.job where jobname='account-moderation-retention'),'running',null);
      $$;
      revoke all on function cron.test_seed_run_history() from public;
      grant execute on function cron.test_seed_run_history() to postgres;
      alter function cron.test_seed_run_history() owner to supabase_admin;
      alter table cron.job_run_details owner to supabase_admin;
      create function cron.schedule(p_name text,p_schedule text,p_command text) returns bigint language plpgsql as $$
        declare result bigint;
        begin insert into cron.job(jobname,schedule,command,username) values(p_name,p_schedule,p_command,current_user)
          on conflict(jobname) do update set schedule=excluded.schedule,command=excluded.command returning jobid into result;
          return result; end; $$;`);
    await t.test("untrusted installation and unrelated job ownership fail closed", async () => {
      await db.exec("set role service_role");
      await assert.rejects(migration("069_account_moderation_retention.sql"), /trusted postgres operator/);
      await db.exec("rollback; reset role");
      await scalar("select cron.schedule('account-moderation-retention','* * * * *','select 1')");
      await db.exec("update cron.job set username='service_role'");
      await assert.rejects(migration("069_account_moderation_retention.sql"), /unrelated retention job/);
      await db.exec("rollback");
      await db.exec("delete from cron.job");
      assert.equal(await scalar("select to_regclass('public.account_moderation_receipts')"), null);
    });

    // PostgreSQL forbids removing SUPERUSER from its bootstrap role. Keep that
    // isolated harness role, and use a different, nonsuperuser postgres operator.
    await db.exec(`create role fixture_admin superuser;
      set session authorization fixture_admin;
      alter role postgres rename to fixture_bootstrap;
      create role postgres nosuperuser;
      grant usage,create on schema public to postgres;
      alter schema auth owner to postgres;
      alter schema cron owner to postgres;
      alter table cron.job owner to postgres;
      alter function cron.schedule(text,text,text) owner to postgres;
      do $$ declare obj record;
      begin
        for obj in select n.nspname,c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
          where n.nspname in ('public','auth') and c.relkind='r' loop
          execute format('alter table %I.%I owner to postgres',obj.nspname,obj.relname);
        end loop;
        for obj in select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace
          where n.nspname in ('public','auth') loop
          execute format('alter function %s owner to postgres',obj.oid::regprocedure);
        end loop;
      end $$;
      grant execute on function cron.test_seed_run_history() to postgres;
      set role postgres;
      alter default privileges in schema public grant all on tables to anon,authenticated,service_role,authenticator;
      alter default privileges in schema public grant execute on functions to anon,authenticated,service_role,authenticator;`);
    await t.test("managed history rejects index creation and UPDATE locks before the corrected migration", async () => {
      assert.equal(await scalar("select rolsuper from pg_roles where rolname=current_user"), false);
      assert.equal(await scalar("select pg_get_userbyid(relowner) from pg_class where oid='cron.job_run_details'::regclass"), "supabase_admin");
      await assert.rejects(db.exec("create index forbidden_extension_index on cron.job_run_details(jobid,end_time)"), e => e.code === "42501");
      assert.equal(await scalar("select has_table_privilege(current_user,'cron.job_run_details','SELECT')"), true);
      assert.equal(await scalar("select has_table_privilege(current_user,'cron.job_run_details','DELETE')"), true);
      assert.equal(await scalar("select has_table_privilege(current_user,'cron.job_run_details','UPDATE')"), false);
      await assert.rejects(db.query("select runid from cron.job_run_details for update"), e => e.code === "42501");
    });

    await act(2, 3, "suspend", 0, id(90));
    await act(2, 4, "require_name_change", 0, id(91));
    await db.exec("update account_moderation_audit set created_at=statement_timestamp()-interval '1 hour'");
    await db.query(`insert into account_moderation_audit values
      ($1,$2,$3,'delete','Legacy deleted account','old_student',null,statement_timestamp()-interval '2 hours'),
      ($4,$5,$6,'restore','Deleted moderator personal details','student_8',null,statement_timestamp()),
      ($7,$8,$9,'suspend','Historical decision','student_9',null,statement_timestamp()-interval '91 days')`,
    [id(92), id(1), id(99), id(93), id(98), id(8), id(94), id(2), id(9)]);
    await t.test("operator preview is read-only and returns counts without personal audit details", async () => {
      const results = await db.exec(await readFile(new URL("../../docs/sql/moderation-retention-preview.sql", import.meta.url), "utf8"));
      const rows = results.flatMap(result => result.rows);
      assert.equal(rows[0].trusted_operator, true);
      assert.equal(rows[0].scheduler_available, true);
      assert.deepEqual(rows[1], {audit_rows:5,routine_expired:1,deleted_target_rows_to_remove:1,deleted_actor_rows_to_redact:1,recent_security_receipts_to_backfill:3});
      assert.doesNotMatch(JSON.stringify(rows), /student_|Reviewed|00000000-/);
    });
    const before = await scalar("select jsonb_agg(to_jsonb(p) order by user_id) from question_progress p");
    const restrictions = await scalar("select jsonb_agg(to_jsonb(m) order by user_id) from account_moderation m");
    await migration("069_account_moderation_retention.sql");

    await t.test("installation preserves progress and bans, scrubs orphaned history, and keeps original expiry", async () => {
      assert.equal(await scalar("select count(*)::int from auth.users"), 40);
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(p) order by user_id) from question_progress p"), before);
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(m) order by user_id) from account_moderation m"), restrictions);
      assert.equal(await scalar("select exists(select 1 from account_moderation_audit where request_id=$1)", [id(92)]), false);
      assert.deepEqual((await db.query("select actor_id,reason from account_moderation_audit where request_id=$1", [id(93)])).rows[0], {actor_id:null, reason:"Moderator account deleted; identifying details removed"});
      assert.equal(await scalar("select count(*)::int from account_moderation_receipts"), 3);
      assert.equal(await scalar("select r.created_at=a.created_at and r.expires_at=a.created_at+interval '24 hours' from account_moderation_receipts r join account_moderation_audit a using(request_id) where request_id=$1", [id(90)]), true);
      assert.equal(await scalar("select expires_at<statement_timestamp()+interval '23 hours 1 minute' from account_moderation_receipts where request_id=$1", [id(90)]), true);
      assert.deepEqual(await act(2, 3, "suspend", 0, id(90)), {success:true,replayed:true});
      assert.deepEqual(await act(1, 99, "delete", 0, id(92), "Legacy deleted account"), {success:true,replayed:true});
    });

    await t.test("receipt fields, RLS, grants, function owners, pinned paths and scheduler are locked down", async () => {
      assert.deepEqual((await db.query("select column_name from information_schema.columns where table_schema='public' and table_name='account_moderation_receipts' order by ordinal_position")).rows.map(r => r.column_name), ["request_id","request_fingerprint","actor_key","created_at","expires_at"]);
      assert.equal(await scalar("select relrowsecurity from pg_class where oid='account_moderation_receipts'::regclass"), true);
      for (const role of ["anon", "authenticated", "service_role", "authenticator"]) {
        for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"]) assert.equal(await scalar("select has_table_privilege($1,'account_moderation_receipts',$2)", [role,privilege]), false);
        for (const signature of ["cleanup_account_moderation_retention()", "scrub_deleted_moderation_actor()"]) assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')", [role,signature]), false);
        await db.exec(`set role ${role}`);
        try {
          await assert.rejects(cleanup(), e => e.code === "42501");
          await assert.rejects(db.query("select * from public.account_moderation_receipts"), e => e.code === "42501");
          await assert.rejects(db.query("delete from public.account_moderation_receipts"), e => e.code === "42501");
          await assert.rejects(db.query("insert into public.account_moderation_receipts(request_id,request_fingerprint,actor_key) values($1,decode(repeat('aa',32),'hex'),decode(repeat('bb',32),'hex'))", [id(95)]), e => e.code === "42501");
        } finally { await db.exec("set role postgres"); }
      }
      for (const name of ["moderate_account", "cleanup_account_moderation_retention", "scrub_deleted_moderation_actor"]) {
        const fn = (await db.query("select prosecdef,proconfig,pg_get_userbyid(proowner) as owner from pg_proc where oid=($1)::regproc", [name])).rows[0];
        assert.equal(fn.prosecdef, true); assert.equal(fn.owner, "postgres"); assert.ok(fn.proconfig.includes('search_path=""'));
      }
      assert.equal(await scalar("select has_function_privilege('service_role','moderate_account(uuid,uuid,text,text,bigint,uuid)','EXECUTE')"), true);
      assert.equal(await scalar("select has_function_privilege('authenticated','moderate_account(uuid,uuid,text,text,bigint,uuid)','EXECUTE')"), false);
      const checks = (await db.exec(await readFile(new URL("../../docs/sql/moderation-retention-verify.sql", import.meta.url), "utf8"))).flatMap(result => result.rows)[0];
      for (const [name,value] of Object.entries(checks)) assert.equal(value, true, name);
      const job = (await db.query("select schedule,command,username,active from cron.job where jobname='account-moderation-retention'")).rows[0];
      assert.deepEqual(job, {schedule:"23 * * * *", command:"set statement_timeout='5s'; set lock_timeout='250ms'; select public.cleanup_account_moderation_retention();", username:"postgres", active:true});
      await assert.rejects(db.query("update account_moderation_receipts set expires_at=created_at+interval '2 days' where request_id=$1", [id(90)]), e => e.code === "23514");
    });

    await t.test("fresh requests replay exactly once; altered or expired retries and unauthorized actors are denied", async () => {
      await db.exec("set role service_role");
      try { assert.deepEqual(await act(2, 6, "suspend", 0, id(96)), {success:true}); }
      finally { await db.exec("set role postgres"); }
      assert.deepEqual(await act(2, 6, "suspend", 0, id(96)), {success:true,replayed:true});
      for (const args of [[2,7,"suspend",0,id(96)],[1,6,"suspend",0,id(96)],[2,6,"restore",0,id(96)],[2,6,"suspend",0,id(96),"Changed reason"]]) await assert.rejects(act(...args), e => e.code === "22023");
      await db.query("update account_moderation_receipts set created_at=statement_timestamp()-interval '25 hours',expires_at=statement_timestamp()-interval '1 hour' where request_id=$1", [id(96)]);
      await assert.rejects(act(2, 6, "suspend", 0, id(96)), e => e.code === "22023");
      for (const args of [[7,6,"restore",1],[2,2,"suspend"],[1,2,"suspend"],[2,7,"delete"]]) await assert.rejects(act(...args), e => e.code === "42501" || e.code === "22023");
      await db.exec("set role authenticated");
      try { await assert.rejects(act(1,7,"suspend"), e => e.code === "42501"); }
      finally { await db.exec("set role postgres"); }
      assert.equal(await scalar("select count(*)::int from account_moderation_audit where request_id=$1", [id(96)]), 1);
    });

    await t.test("expiry removes only history, not active restrictions, login aliases, progress or stale-token guards", async () => {
      await db.query("update account_moderation_audit set created_at=statement_timestamp()-interval '91 days' where request_id in ($1,$2)", [id(90),id(91)]);
      const result = await cleanup();
      assert.equal(result.audits_removed, 3); assert.equal(result.receipts_removed, 1);
      assert.equal(await scalar("select suspended from account_moderation where user_id=$1", [id(3)]), true);
      assert.equal(await scalar("select requires_name_change from account_moderation where user_id=$1", [id(4)]), true);
      assert.equal(await scalar("select resolve_login_username('student_4')"), id(4));
      await db.query("select set_config('test.user',$1,false)", [id(3)]);
      assert.equal(await scalar("select account_is_active()"), false);
      await assert.rejects(db.query("select check_account_access()"), e => e.code === "PT403");
      await db.exec("set role authenticated");
      assert.equal(await scalar("select count(*)::int from question_progress"), 0);
      await db.exec("set role postgres");
      await db.query("select set_config('test.user','',false)");
      await act(2,3,"restore",1);
      await db.query("select set_account_username($1,'updated_student_4')", [id(4)]);
      assert.equal(await scalar("select resolve_login_username('student_4')"), null);
      assert.equal(await scalar("select encrypted_password from auth.users where id=$1", [id(4)]), "unchanged-hash");
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(p) order by user_id) from question_progress p"), before);
      await assert.rejects(act(2,6,"restore",1,id(96)), e => e.code === "23505");
      await assert.rejects(act(2,6,"suspend",0,id(96)), e => e.code === "40001");
      assert.equal(await scalar("select suspended from account_moderation where user_id=$1", [id(6)]), true, "purged receipt cannot duplicate an action while the original audit exists");
    });

    await t.test("owner deletion and self-deletion purge linked audits without changing other players; failed deletion rolls back", async () => {
      for (const [room,host,guest,status] of [[50,51,52,"waiting"],[60,61,62,"running"]]) {
        await db.query("insert into multiplayer_rooms(id,status) values($1,$2)", [id(room),status]);
        await db.query("insert into multiplayer_players(id,room_id,user_id) values($1,$3,$4),($2,$3,$5)", [id(host),id(guest),id(room),id(room===50?5:7),id(8)]);
        await db.query("update multiplayer_rooms set host_player_id=$1 where id=$2", [id(host),id(room)]);
      }
      await act(2,5,"suspend");
      await db.exec("create table deletion_blocker(user_id uuid references auth.users(id))");
      await db.query("insert into deletion_blocker values($1)", [id(5)]);
      const auditBefore = await scalar("select jsonb_agg(to_jsonb(a) order by request_id) from account_moderation_audit a");
      const receiptsBefore = await scalar("select count(*)::int from account_moderation_receipts");
      await assert.rejects(act(1,5,"delete",1,id(97)), e => e.code === "23503");
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(a) order by request_id) from account_moderation_audit a"), auditBefore);
      assert.equal(await scalar("select count(*)::int from account_moderation_receipts"), receiptsBefore);
      assert.equal(await scalar("select count(*)::int from auth.users where id=$1", [id(5)]), 1);
      await db.exec("delete from deletion_blocker");
      await act(1,5,"delete",1,id(97));
      assert.deepEqual(await act(1,5,"delete",1,id(97)), {success:true,replayed:true});
      assert.equal(await scalar("select count(*)::int from account_moderation_audit where target_id=$1", [id(5)]), 0);
      assert.equal(await scalar("select count(*)::int from question_progress where user_id=$1", [id(5)]), 0);
      assert.equal(await scalar("select status from multiplayer_rooms where id=$1", [id(50)]), "cancelled");
      await act(2,7,"suspend");
      await db.query("delete from auth.users where id=$1", [id(7)]);
      assert.equal(await scalar("select count(*)::int from account_moderation_audit where target_id=$1", [id(7)]), 0);
      assert.equal(await scalar("select status from multiplayer_rooms where id=$1", [id(60)]), "running");
      assert.equal(await scalar("select host_player_id from multiplayer_rooms where id=$1", [id(60)]), null);
      assert.equal(await scalar("select count(*)::int from multiplayer_players where user_id=$1 and score=99 and connected", [id(8)]), 2);
      await db.query("select set_config('test.user',$1,false)", [id(5)]);
      assert.equal(await scalar("select account_is_active()"), false);
      await db.query("select set_config('test.user','',false)");
    });

    await t.test("ten-deletion rate cap survives removal of audit rows, and retry does not consume an extra slot", async () => {
      for (let n=20; n<30; n++) await act(10,n,"delete",0,id(200+n));
      assert.equal(await scalar("select count(*)::int from account_moderation_audit where actor_id=$1", [id(10)]), 0);
      assert.deepEqual(await act(10,20,"delete",0,id(220)), {success:true,replayed:true});
      await assert.rejects(act(10,30,"delete"), e => e.code === "P0001");
      assert.equal(await scalar("select count(*)::int from auth.users where id=$1", [id(30)]), 1);
      assert.equal(await scalar("select count(*)::int from account_moderation_receipts where actor_key=sha256(convert_to($1,'UTF8'))", [id(10)]), 10);
    });

    await t.test("protected deletion remains blocked; a deliberately demoted moderator's identifiers and reasons are scrubbed", async () => {
      await assert.rejects(db.query("delete from auth.users where id=$1", [id(2)]), e => e.code === "42501");
      assert.equal(await scalar("select exists(select 1 from account_moderation_audit where actor_id=$1)", [id(2)]), true);
      await db.query("update profiles set role='user' where id=$1", [id(2)]);
      await assert.rejects(act(2,8,"suspend"), e => e.code === "42501");
      await db.query("insert into deletion_blocker values($1)", [id(2)]);
      const actorAudits = await scalar("select jsonb_agg(to_jsonb(a) order by request_id) from account_moderation_audit a where actor_id=$1", [id(2)]);
      const actorReceipts = await scalar("select count(*)::int from account_moderation_receipts where actor_key=sha256(convert_to($1,'UTF8'))", [id(2)]);
      await assert.rejects(db.query("delete from auth.users where id=$1", [id(2)]), e => e.code === "23503");
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(a) order by request_id) from account_moderation_audit a where actor_id=$1", [id(2)]), actorAudits);
      assert.equal(await scalar("select count(*)::int from account_moderation_receipts where actor_key=sha256(convert_to($1,'UTF8'))", [id(2)]), actorReceipts);
      await db.exec("delete from deletion_blocker");
      await db.query("delete from auth.users where id=$1", [id(2)]);
      assert.equal(await scalar("select exists(select 1 from account_moderation_audit where actor_id=$1 or target_id=$1)", [id(2)]), false);
      assert.equal(await scalar("select exists(select 1 from account_moderation_receipts where actor_key=sha256(convert_to($1,'UTF8')))", [id(2)]), false);
      assert.equal(await scalar("select bool_and(reason='Moderator account deleted; identifying details removed') from account_moderation_audit where actor_id is null"), true);
      assert.equal(await scalar("select suspended from account_moderation where user_id=$1", [id(6)]), true);
      assert.equal(await scalar("select count(*)::int from question_progress where user_id=$1", [id(6)]), 1);
    });

    await t.test("indexed 500-row batches enforce all expiries while leaving recent records, other jobs, and game state intact", async () => {
      await db.query(`insert into account_moderation_audit(request_id,actor_id,target_id,action,reason,previous_username,created_at)
        select ('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,$1,$2,'restore','Expired decision','student_8',statement_timestamp()-interval '91 days' from generate_series(10000,10504)n`, [id(1),id(8)]);
      await db.exec(`insert into account_moderation_receipts(request_id,request_fingerprint,actor_key,created_at,expires_at)
        select ('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,decode(repeat('aa',32),'hex'),decode(repeat('bb',32),'hex'),statement_timestamp()-interval '25 hours',statement_timestamp()-interval '1 hour' from generate_series(11000,11504)n;`);
      await db.query("select cron.test_seed_run_history()");
      const states = await scalar("select jsonb_agg(to_jsonb(m) order by user_id) from account_moderation m");
      const games = await scalar("select jsonb_agg(to_jsonb(p) order by id) from multiplayer_players p");
      const recentAudits = await scalar("select count(*)::int from account_moderation_audit where created_at>statement_timestamp()-interval '90 days'");
      const recentReceipts = await scalar("select count(*)::int from account_moderation_receipts where expires_at>statement_timestamp()");
      // Prove the expiry indexes are usable, not a hosted planner/latency benchmark.
      await db.exec("analyze public.account_moderation_audit; analyze public.account_moderation_receipts; set enable_seqscan=off; set enable_bitmapscan=off");
      for (const [sql,index] of [
        ["select request_id from account_moderation_audit where created_at<statement_timestamp()-interval '90 days' order by created_at,request_id limit 500", "account_moderation_audit_expiry"],
        ["select request_id from account_moderation_receipts where expires_at<statement_timestamp() order by expires_at,request_id limit 500", "account_moderation_receipts_expiry"],
        ["select runid from cron.job_run_details where jobid=2 and end_time<statement_timestamp()-interval '7 days' order by runid limit 500", "job_run_details_pkey"],
      ]) assert.match(JSON.stringify((await db.query(`explain (format json) ${sql}`)).rows), new RegExp(index));
      await db.exec("reset enable_seqscan; reset enable_bitmapscan");
      // Malicious session-local objects must not shadow SECURITY DEFINER tables.
      await db.exec("create temp table account_moderation_audit(secret text); insert into account_moderation_audit values('untouched temp table'); create temp table account_moderation_receipts(secret text); set search_path=pg_temp,public");
      assert.deepEqual(await cleanup(), {audits_removed:500,receipts_removed:500,job_history_removed:500});
      assert.deepEqual(await cleanup(), {audits_removed:5,receipts_removed:5,job_history_removed:5});
      assert.deepEqual(await cleanup(), {audits_removed:0,receipts_removed:0,job_history_removed:0});
      assert.equal(await scalar("select secret from pg_temp.account_moderation_audit"), "untouched temp table");
      await db.exec("reset search_path");
      assert.equal(await scalar("select count(*)::int from public.account_moderation_audit"), recentAudits);
      assert.equal(await scalar("select count(*)::int from public.account_moderation_receipts"), recentReceipts);
      assert.equal(await scalar("select count(*)::int from cron.job_run_details"), 3);
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(m) order by user_id) from account_moderation m"), states);
      assert.deepEqual(await scalar("select jsonb_agg(to_jsonb(p) order by id) from multiplayer_players p"), games);
    });
  } finally { await db.close(); }
});
