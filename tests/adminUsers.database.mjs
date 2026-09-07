import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
try {
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create function auth.uid() returns uuid language sql as $$select nullif(current_setting('test.user',true),'')::uuid$$;
    create table profiles(id uuid primary key,username text,role text,created_at timestamptz default now());
    create table question_progress(user_id uuid,attempts int,correct int,last_attempted_at timestamptz);
    create table challenge_attempts(user_id uuid,submitted_at timestamptz,challenge_date date);
    create table multiplayer_match_results(user_id uuid,finalized_at timestamptz);
    create table multiplayer_players(user_id uuid,joined_at timestamptz);
    create table multiplayer_profiles(user_id uuid,rp int,ranked_matches_played int,ranked_wins int);
    create table challenge_user_statistics(user_id uuid,current_streak int,longest_streak int);
    insert into profiles(id,username,role) select ('00000000-0000-0000-0000-'||lpad(n::text,12,'0'))::uuid,
      'player_'||lpad(n::text,3,'0'),case n when 1 then 'owner' when 2 then 'admin' else 'user' end from generate_series(1,55) n;`);
  await db.exec(await readFile(new URL('../supabase/migrations/039_admin_users_directory.sql',import.meta.url),'utf8'));
  const identity=async n=>db.query("select set_config('test.user',$1,false)",[n ? `00000000-0000-0000-0000-${String(n).padStart(12,'0')}` : '']);
  const list=async (...args)=>(await db.query('select get_admin_users($1,$2,$3,$4,$5) result',[...args])).rows[0].result;
  await assert.rejects(list('','','activity',1,null),/Administrator access required/);
  await identity(3);
  await assert.rejects(list('','','activity',1,null),/Administrator access required/);
  for (const n of [1,2]) {
    await identity(n);
    const first=await list('','','username',1,null);
    const second=await list('','','username',2,null);
    assert.equal(first.total,55); assert.equal(first.users.length,50); assert.equal(second.users.length,5);
    assert.equal(new Set([...first.users,...second.users].map(u=>u.id)).size,55);
    assert.equal((await list('','owner','activity',1,null)).total,1);
    assert.equal((await list('PLAYER_055','','activity',1,null)).total,1);
    assert.equal((await list('%','','activity',1,null)).total,0,'search is literal, not wildcard');
    assert.equal(first.users[0].last_active,null);
    assert.equal(first.users[0].rp,0);
    assert.ok(!('email' in first.users[0]));
  }
  await db.exec(`insert into multiplayer_profiles values('00000000-0000-0000-0000-000000000055',500,10,4);
    insert into question_progress values('00000000-0000-0000-0000-000000000055',12,9,now());
    insert into challenge_user_statistics values('00000000-0000-0000-0000-000000000055',8,10);`);
  const ranked=(await list('','','rp',1,null)).users[0];
  assert.equal(ranked.username,'player_055'); assert.equal(ranked.practice_attempts,12); assert.equal(ranked.practice_correct,9);
  assert.equal(ranked.current_streak,0,'stale streak is not presented as active'); assert.equal(ranked.longest_streak,10);
  assert.equal((await list('','','activity',1,null)).users[0].username,'player_055');
  assert.equal((await list('','','activity',1,ranked.id)).users.length,1);
  assert.equal((await db.query("select has_function_privilege('anon','get_admin_users(text,text,text,integer,uuid)','EXECUTE') allowed")).rows[0].allowed,false);
  console.log('PASS: owners/admins allowed, regular/unauthenticated users blocked, pagination, filters, literal search, activity/RP sorting, statistics, no email exposure.');
} catch(error) { console.error(error.message); process.exitCode=1; } finally { await db.close(); }
