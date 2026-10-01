// Isolated PostgreSQL regression, never a linked project or production load test.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const migration = name => readFile(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
let checks = 0;
const check = async (name, run) => { await run(); checks++; console.log(`PASS ${name}`); };
try {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
    create table public.profiles(id uuid primary key, username text);
    create function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=clock_timestamp(); return new; end;$$;
    create schema realtime; create table realtime.test_events(payload jsonb);
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as
    $$insert into realtime.test_events values(payload)$$;`);
  const schema = await migration("009_multiplayer_pack_m2_schema");
  await db.exec(schema.slice(0, schema.indexOf("-- Row Level Security")) + "\ncommit;");
  await db.exec("alter table multiplayer_spectators add column last_seen_at timestamptz default clock_timestamp()");
  for (const name of ["022_multiplayer_realtime_foundation", "023_multiplayer_realtime_signal_filter",
    "024_multiplayer_atomic_round_transitions", "025_fix_multiplayer_transition_timestamp",
    "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery", "028_fix_multiplayer_state_trigger",
    "029_preload_multiplayer_questions", "030_confirm_preloaded_round_before_reveal", "031_multiplayer_atomic_submissions",
    "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots", "034_multiplayer_database_worker",
    "036_multiplayer_readiness_countdown", "037_multiplayer_balanced_rp", "040_multiplayer_authoritative_scoring_clock",
    "047_multiplayer_host_account_deletion", "049_multiplayer_room_lifecycle", "051_multiplayer_confirmed_lobby_transitions"]) await db.exec(await migration(name));

  const users = Array.from({ length: 23 }, () => randomUUID());
  for (const id of users) {
    await db.query("insert into auth.users values($1)", [id]);
    await db.query("insert into profiles values($1,$2)", [id, `Player ${users.indexOf(id)}`]);
  }
  async function room(visibility = "private", capacity = 30) {
    const id = randomUUID();
    await db.query(`insert into multiplayer_rooms(id,visibility,code,mode,division,question_count,seconds_per_question,capacity)
      values($1,$2,$3,'ranked','Mu',5,60,$4)`, [id, visibility, visibility === "private" ? id.slice(0,8).toUpperCase() : null, capacity]);
    return id;
  }
  const add = (room, user, host = false) => scalar("insert into multiplayer_players(room_id,user_id,is_host) values($1,$2,$3) returning id", [room,user,host]);
  const read = (room, user, hash = null) => scalar("select read_multiplayer_lobby($1,$2,$3)", [room,user,hash]);
  const conn = () => ({ tab: randomUUID(), id: randomUUID(), gen: 1 });
  const presence = async (room,user,c,action = "connect",hash=null) => {
    c.player ??= await scalar("select multiplayer_lobby_player_id($1,$2,$3)",[room,user,hash]);
    return scalar("select change_multiplayer_lobby_presence($1,$2,$3,$4,$5,$6,$7,$8)",[room,user,hash,action,c.tab,c.id,c.gen,c.player]);
  };
  const leave = (room,user,c,hash=null) => scalar("select leave_multiplayer_lobby($1,$2,$3,$4)",[room,user,hash,c?.id ?? null]);
  const start = (room,user,ids=[101,102,103,104,105]) => scalar("select start_multiplayer_lobby($1,$2,null,$3,$4)",[room,user,ids,[1,2,3,4,5]]);
  const join = (room,user) => scalar("select join_public_multiplayer_lobby($1,$2)",[room,user]);
  const expire = async (room,user,age=31) => {
    await db.exec("alter table multiplayer_players disable trigger multiplayer_players_set_updated_at");
    await db.query("update multiplayer_players set updated_at=clock_timestamp()-make_interval(secs=>$3) where room_id=$1 and user_id=$2",[room,user,age]);
    await db.exec("alter table multiplayer_players enable trigger multiplayer_players_set_updated_at");
  };
  await check("leave wins: removed player is not included in a later private start", async () => {
    const r=await room(), c=conn(); await add(r,users[0],true); await add(r,users[1]);
    await presence(r,users[1],c);
    assert.equal(await leave(r,users[1],c),'left');
    assert.equal(await leave(r,users[1],c),'left');
    const started=await start(r,users[0]);
    assert.equal(started.status,'in-progress'); assert.equal(started.mode,'unranked');
    assert.equal((await read(r,users[0])).players.length,1);
    assert.equal(await read(r,users[1]),null);
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),5);
  });
  await check("start wins: rejected leave and delayed disconnect do not remove a match player", async () => {
    const r=await room(), c=conn(); await add(r,users[0],true); await add(r,users[1]);
    await presence(r,users[1],c); await start(r,users[0]);
    assert.equal(await leave(r,users[1],c),'started');
    assert.equal((await presence(r,users[1],c,'disconnect')).status,'started');
    assert.equal((await read(r,users[1])).players.length,2);
    await start(r,users[0]);
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),5);
  });
  await check("reload fences old disconnect, heartbeat, connect and explicit leave", async () => {
    const r=await room(), c=conn(); await add(r,users[0]);
    assert.equal((await presence(r,users[0],c)).status,'connected');
    const next={...c,id:randomUUID(),gen:2}; await presence(r,users[0],next);
    assert.equal(await leave(r,users[0],null),'conflict','a missing connection key cannot bypass fencing');
    for(const action of ['connect','heartbeat','disconnect']) assert.equal((await presence(r,users[0],c,action)).status,'conflict');
    assert.equal(await leave(r,users[0],c),'conflict');
    assert.equal(await leave(r,users[1],next),'conflict','account switch must not claim the old account left');
    assert.equal((await read(r,users[0])).players.length,1);
    assert.equal((await presence(r,users[0],conn())).status,'conflict');
  });
  await check("disconnect arriving before connect fences the departed generation", async () => {
    const r=await room(), c=conn(); await add(r,users[0]);
    assert.equal((await presence(r,users[0],c,'disconnect')).status,'disconnected');
    assert.equal((await presence(r,users[0],c)).status,'disconnected');
    assert.equal((await presence(r,users[0],c,'heartbeat')).status,'disconnected');
    const newer={...c,id:randomUUID(),gen:2};
    assert.equal((await presence(r,users[0],newer)).status,'connected');
    const cancelled={...c,id:randomUUID(),gen:3};
    await presence(r,users[0],cancelled,'disconnect');
    assert.equal((await presence(r,users[0],cancelled)).status,'disconnected');
  });
  await check("stale presence is hidden; expiry preserves membership and score, normal heartbeat does not broadcast", async () => {
    const r=await room(), c=conn(); await add(r,users[0]); await add(r,users[1]);
    await db.query("update multiplayer_players set score=123 where room_id=$1 and user_id=$2",[r,users[1]]);
    await expire(r,users[1]);
    assert.equal((await read(r,users[0])).players.length,1);
    await presence(r,users[0],c);
    const version=(await read(r,users[0])).room.state_version;
    await presence(r,users[0],c,'heartbeat');
    assert.equal((await read(r,users[0])).room.state_version,version);
    const old=await scalar("select to_jsonb(p) from multiplayer_players p where room_id=$1 and user_id=$2",[r,users[1]]);
    assert.equal(old.score,123); assert.equal(old.left_at,null); assert.equal(old.connected,false);
    await start(r,users[0]).then(()=>assert.fail('nonhost started'),e=>assert.match(e.message,/host/));
  });
  await check("guest identity is hash-bound and roster snapshots contain no connection secrets", async () => {
    const r=await room(), c=conn();
    await db.query("insert into multiplayer_players(room_id,guest_nickname,reconnect_token_hash) values($1,'Guest','hashed-secret')",[r]);
    assert.equal(await read(r,null,'wrong'),null);
    assert.equal((await presence(r,null,c,'connect','hashed-secret')).status,'connected');
    const snapshot=JSON.stringify(await read(r,null,'hashed-secret'));
    for(const secret of ['hashed-secret','reconnect_token_hash','lobby_connection_id','lobby_tab_id',c.id,c.tab]) assert.ok(!snapshot.includes(secret));
    assert.equal(await leave(r,null,c,'wrong'),'conflict');
    assert.equal((await read(r,null,'hashed-secret')).players.length,1);
    assert.equal(await leave(r,null,c,'hashed-secret'),'left');
  });
  await check("public reconnects respect fresh ownership and capacity; stale flags do not block rejoin", async () => {
    const r=await room('public',20);
    await join(r,users[0]); await assert.rejects(join(r,users[0]),/another tab/);
    await expire(r,users[0],15); await assert.rejects(join(r,users[0]),/another tab/);
    const abandoned=conn(); await presence(r,users[0],abandoned);
    await expire(r,users[0]); assert.equal((await join(r,users[0])).player_count,1);
    for(const action of ['connect','heartbeat','disconnect']) assert.equal((await presence(r,users[0],abandoned,action)).status,'left');
    const staleConnection=conn(); await presence(r,users[0],staleConnection);
    await expire(r,users[0]);
    for(const user of users.slice(1,21)) await join(r,user);
    assert.equal((await presence(r,users[0],conn())).status,'full');
    assert.equal((await presence(r,users[0],staleConnection,'heartbeat')).status,'full');
    await assert.rejects(join(r,users[0]),/full/);
    const c=conn(); await presence(r,users[1],c);
    await leave(r,users[1],c);
    assert.equal((await join(r,users[0])).player_count,20);
    await start(r,users[0]);
    assert.equal((await read(r,users[0])).players.length,20);
    assert.equal(await scalar("select count(*)::int from multiplayer_rooms where visibility='public' and status='waiting'"),1);
    await db.exec("delete from multiplayer_rooms where visibility='public'");
  });
  await check("public leave resets countdown; a subsequent start cannot include the departed member", async () => {
    const r=await room('public',20), c=conn(); await join(r,users[0]); await join(r,users[1]);
    await presence(r,users[1],c); assert.equal((await read(r,users[0])).room.status,'countdown');
    const version=(await read(r,users[0])).room.state_version;
    await leave(r,users[1],c);
    const lobby=await read(r,users[0]);
    assert.equal(lobby.room.status,'waiting'); assert.equal(lobby.room.countdown_ends_at,null);
    assert.equal(lobby.room.state_version,version+1);
    assert.equal((await start(r,users[0])).status,'waiting');
    await db.exec("delete from multiplayer_rooms where visibility='public'");
  });
  await check("failed question preparation rolls back the entire start", async () => {
    const r=await room(); await add(r,users[0],true); await add(r,users[1]);
    await expire(r,users[1]);
    await assert.rejects(start(r,users[0],[1,1,2,3,4]),/Invalid question/);
    await db.exec(`create function reject_lobby_question() returns trigger language plpgsql as $$begin raise exception 'test insert failure'; end;$$;
      create trigger reject_lobby_question before insert on multiplayer_match_questions for each row execute function reject_lobby_question();`);
    await assert.rejects(start(r,users[0]),/test insert failure/);
    await db.exec("drop trigger reject_lobby_question on multiplayer_match_questions");
    assert.equal((await read(r,users[0])).room.status,'waiting');
    assert.equal(await scalar("select left_at from multiplayer_players where room_id=$1 and user_id=$2",[r,users[1]]),null);
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),0);
    await start(r,users[0]);
    assert.ok(await scalar("select left_at from multiplayer_players where room_id=$1 and user_id=$2",[r,users[1]]));
  });
  await check("private host closure cascades only that lobby and retries safely", async () => {
    const r=await room(), c=conn(); const host=await add(r,users[0],true); await add(r,users[1]);
    await db.query("update multiplayer_rooms set host_player_id=$2 where id=$1",[r,host]);
    await presence(r,users[0],c); await leave(r,users[0],c); await leave(r,users[0],c);
    assert.equal(await scalar("select count(*)::int from multiplayer_rooms where id=$1",[r]),0);
    assert.equal(await scalar("select count(*)::int from multiplayer_players where room_id=$1",[r]),0);
  });
  await check("new RPCs are server-only, including inherited PUBLIC privileges", async () => {
    for(const signature of ['read_multiplayer_lobby(uuid,uuid,text)','change_multiplayer_lobby_presence(uuid,uuid,text,text,uuid,uuid,bigint,uuid)',
      'leave_multiplayer_lobby(uuid,uuid,text,uuid)','start_multiplayer_lobby(uuid,uuid,text,integer[],integer[])','join_public_multiplayer_lobby(uuid,uuid)']) {
      for(const role of ['anon','authenticated']) assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')",[role,signature]),false);
      assert.equal(await scalar("select has_function_privilege('service_role',$1,'EXECUTE')",[signature]),true);
    }
    assert.equal(await scalar("select has_function_privilege('service_role','multiplayer_lobby_player_id(uuid,uuid,text)','EXECUTE')"),false);
  });
  console.log(`PASS: ${checks} isolated database scenarios. Ordered race outcomes, not a concurrent hosted load test.`);
} finally { await db.close(); }
