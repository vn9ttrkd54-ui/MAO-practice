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


  const users=Array.from({length:24},()=>randomUUID());
  for(const [i,id] of users.entries()) {
    await db.query("insert into auth.users values($1)",[id]);
    await db.query("insert into profiles values($1,$2)",[id,`Player ${i}`]);
  }
  const legacyRoom=async(status='waiting',visibility='public')=>scalar(`insert into multiplayer_rooms(visibility,code,mode,division,question_count,seconds_per_question,capacity,status,started_at)
    values($1,$2,'ranked','Mu',5,60,$3,$4,case when $4='in-progress' then clock_timestamp() end) returning id`,
    [visibility,visibility==='private'?'LEGACYAA':null,visibility==='public'?20:30,status]);
  const oldRunning=await legacyRoom('in-progress');
  const oldWaiting=await legacyRoom();
  const oldPrivate=await legacyRoom('waiting','private');
  const oldHost=await scalar("insert into multiplayer_players(room_id,user_id) values($1,$2) returning id",[oldWaiting,users[0]]);
  await db.exec(await migration("059_multiplayer_room_settings"));
  const read=(room,user)=>scalar("select read_multiplayer_lobby($1,$2,null)",[room,user]);
  const join=(room,user)=>scalar("select join_public_multiplayer_lobby($1,$2)",[room,user]);
  const room=()=>scalar("insert into multiplayer_rooms(visibility,mode,division,question_count,seconds_per_question,capacity) values('public','ranked','Mu',5,90,20) returning id");
  const playerId=(room,user)=>scalar("select id from multiplayer_players where room_id=$1 and user_id=$2",[room,user]);
  const conn=()=>({tab:randomUUID(),id:randomUUID(),gen:1});
  const presence=async(room,user,c,action='connect')=>{
    c.player ??= await playerId(room,user);
    return scalar("select change_multiplayer_lobby_presence($1,$2,null,$3,$4,$5,$6,$7)",[room,user,action,c.tab,c.id,c.gen,c.player]);
  };
  const leave=(room,user,c)=>scalar("select leave_multiplayer_lobby($1,$2,null,$3)",[room,user,c.id]);
  const set=(room,user,c,band,version=0)=>scalar("select set_multiplayer_lobby_difficulty($1,$2,null,$3,$4,$5,$6)",[room,user,band,version,c.id,c.player]);
  const start=(room,user,version=0,difficulties=[2,3,4,2,3])=>scalar("select start_multiplayer_lobby($1,$2,null,$3,$4,$5)",[room,user,[101,102,103,104,105],difficulties,version]);
  const expire=async(room,user)=>{
    await db.exec("alter table multiplayer_players disable trigger multiplayer_players_set_updated_at");
    await db.query("update multiplayer_players set updated_at=clock_timestamp()-interval '31 seconds' where room_id=$1 and user_id=$2",[room,user]);
    await db.exec("alter table multiplayer_players enable trigger multiplayer_players_set_updated_at");
  };

  const ready=(r,user,c,value=true,version=0)=>scalar(
    "select set_multiplayer_lobby_ready($1,$2,$3,$4,$5,$6)",[r,user,value,version,c.id,c.player]);
  const events=()=>scalar("select count(*)::int from realtime.test_events");
  const seconds=r=>scalar("select extract(epoch from countdown_ends_at-clock_timestamp())::float from multiplayer_rooms where id=$1",[r]);
  const setup=async(n=2)=>{
    const r=await room(), connections=[];
    for(let i=0;i<n;i++) { await join(r,users[i]);const c=conn();await presence(r,users[i],c);connections.push(c); }
    return {r,c:connections};
  };
  const cleanup=()=>db.exec("delete from multiplayer_rooms");
  await db.query("update multiplayer_players set score=123 where id=$1",[oldHost]);
  const oldCompleted=await legacyRoom('completed');
  const beforeRooms=(await db.query("select to_jsonb(r) row from multiplayer_rooms r order by id")).rows;
  const beforePlayers=(await db.query("select to_jsonb(p) row from multiplayer_players p order by id")).rows;
  await db.exec(await migration("060_multiplayer_lobby_ready"));
  await check("migration preserves existing rooms and player data; only nullable readiness is added",async()=>{
    assert.ok(oldRunning && oldWaiting && oldPrivate && oldCompleted);
    assert.deepEqual((await db.query("select to_jsonb(r) row from multiplayer_rooms r order by id")).rows,beforeRooms);
    assert.deepEqual((await db.query("select to_jsonb(p)-'lobby_ready_settings_version' row from multiplayer_players p order by id")).rows,beforePlayers);
    assert.equal((await read(oldWaiting,users[0])).currentPlayer.lobby_ready,false);
    await cleanup();
  });
  await check("one ready player stays waiting; all two ready shorten normal timer to ten seconds",async()=>{
    const {r,c}=await setup(1);
    const first=await ready(r,users[0],c[0]);
    assert.equal(first.room.status,'waiting');assert.equal(first.room.countdown_ends_at,null);
    await join(r,users[1]);const b=conn();await presence(r,users[1],b);
    assert.ok(await seconds(r)>55);
    const oldEvents=await events();
    const final=await ready(r,users[1],b);
    assert.ok(await seconds(r)<=10 && await seconds(r)>8);
    assert.equal(final.players.every(p=>p.lobby_ready),true);
    assert.equal(await events(),oldEvents+1,'one event for final Ready plus shortening');
    await cleanup();
  });
  await check("a full unready room waits; neither heartbeat nor legacy start bypasses the deadline",async()=>{
    const {r,c}=await setup(20);
    const snapshot=await read(r,users[0]);assert.equal(snapshot.players.length,20);assert.ok(await seconds(r)>50);
    await presence(r,users[0],c[0],'heartbeat');
    assert.equal((await start(r,users[0])).status,'countdown');
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),0);
    for(let i=0;i<19;i++)await ready(r,users[i],c[i]);
    assert.equal((await read(r,users[0])).room.countdown_ends_at,snapshot.room.countdown_ends_at);
    await ready(r,users[19],c[19]);assert.ok(await seconds(r)<=10);
    await cleanup();
  });
  await check("Ready never extends a deadline at nine seconds, five seconds, or after expiry",async()=>{
    for(const remaining of [9,5,-1]) {
      const {r,c}=await setup();
      await db.query("update multiplayer_rooms set countdown_ends_at=clock_timestamp()+$2*interval '1 second' where id=$1",[r,remaining]);
      const deadline=(await read(r,users[0])).room.countdown_ends_at;
      await ready(r,users[0],c[0]);await ready(r,users[1],c[1]);
      assert.equal((await read(r,users[0])).room.countdown_ends_at,deadline);
      await ready(r,users[0],c[0],false);
      assert.equal((await read(r,users[0])).room.countdown_ends_at,deadline,'Not ready never extends');
      await cleanup();
    }
  });
  await check("identical retries are idempotent, ordinary heartbeats produce no Ready fanout, snapshots hide tokens",async()=>{
    const {r,c}=await setup();
    const first=await ready(r,users[1],c[1]);const count=await events();
    for(let i=0;i<3;i++) {
      assert.equal((await ready(r,users[1],c[1])).room.state_version,first.room.state_version);
      await presence(r,users[1],c[1],'heartbeat');
    }
    assert.equal(await events(),count);
    const wire=JSON.stringify(first);
    for(const secret of ['lobby_ready_settings_version','lobby_connection_id','guest_token_hash',c[1].id])assert.ok(!wire.includes(secret));
    await ready(r,users[1],c[1],false);assert.equal((await read(r,users[1])).currentPlayer.lobby_ready,false);
    await cleanup();
  });
  await check("difficulty version clears consent; outdated ready is rejected and current members can ready again",async()=>{
    const {r,c}=await setup(3);
    await ready(r,users[0],c[0]);await ready(r,users[1],c[1]);
    const saved=await set(r,users[0],c[0],'1-3');
    assert.equal(saved.players.every(p=>p.lobby_ready===false),true);
    await assert.rejects(ready(r,users[1],c[1]),/Settings changed/);
    for(let i=0;i<3;i++)await ready(r,users[i],c[i],true,1);
    assert.ok(await seconds(r)<=10);
    await assert.rejects(set(r,users[0],c[0],'3-5',1),/locked/);
    await cleanup();
  });
  await check("new connection and stale heartbeat clear readiness; old connections cannot restore it",async()=>{
    const {r,c}=await setup(3);
    await ready(r,users[1],c[1]);
    const version=(await read(r,users[0])).room.state_version;
    const next={...c[1],id:randomUUID(),gen:2};
    await presence(r,users[1],next);
    const state=await read(r,users[1]);
    assert.equal(state.currentPlayer.lobby_ready,false);assert.ok(state.room.state_version>version);
    await assert.rejects(ready(r,users[1],c[1]),/Reconnect/);
    await ready(r,users[1],next);await expire(r,users[1]);
    await assert.rejects(ready(r,users[1],next),/Reconnect/);
    await presence(r,users[1],next,'heartbeat');
    assert.equal((await read(r,users[1])).currentPlayer.lobby_ready,false);
    await presence(r,users[1],next,'disconnect');
    assert.equal((await presence(r,users[1],next,'heartbeat')).status,'disconnected');
    await cleanup();
  });
  await check("unready departure, disconnect, expiry and account deletion re-evaluate the remaining ready players",async()=>{
    for(const action of ['leave','disconnect','expire','delete']) {
      const {r,c}=await setup(3);
      await ready(r,users[0],c[0]);await ready(r,users[1],c[1]);assert.ok(await seconds(r)>50);
      if(action==='leave')await leave(r,users[2],c[2]);
      if(action==='disconnect')await presence(r,users[2],c[2],'disconnect');
      if(action==='expire') { await expire(r,users[2]);await presence(r,users[0],c[0],'heartbeat'); }
      if(action==='delete')await db.query("delete from auth.users where id=$1",[users[2]]);
      assert.ok(await seconds(r)<=10,action);
      assert.equal((await read(r,users[0])).players.length,2);
      await leave(r,users[0],c[0]);
      const last=await read(r,users[1]);assert.equal(last.room.status,'waiting');assert.equal(last.room.countdown_ends_at,null);
      await cleanup();
      if(action==='delete')await db.query("insert into auth.users values($1)",[users[2]]);
    }
  });
  await check("a new unready joiner does not extend an already-shortened countdown",async()=>{
    const {r,c}=await setup();
    await ready(r,users[0],c[0]);const final=await ready(r,users[1],c[1]);
    await join(r,users[2]);
    const next=await read(r,users[2]);assert.equal(next.currentPlayer.lobby_ready,false);
    assert.equal(next.room.countdown_ends_at,final.room.countdown_ends_at);
    await cleanup();
  });
  await check("server-only Ready validates player identity, connection, version and room visibility",async()=>{
    const {r,c}=await setup();
    for(const bad of [{...c[0],id:randomUUID()},{...c[0],player:c[1].player}])await assert.rejects(ready(r,users[0],bad),/Reconnect/);
    await assert.rejects(ready(r,users[3],c[0]),/Reconnect/);
    await assert.rejects(ready(r,null,c[0]),/signed-in/);
    await assert.rejects(ready(r,users[0],c[0],null),/Invalid/);
    for(const version of [-1,null,9007199254740992])await assert.rejects(ready(r,users[0],c[0],true,version),/Invalid/);
    const privateRoom=await scalar("select create_private_multiplayer_room($1,'READYAAB','unranked','Mu',5,180,'2-4')",[users[3]]);
    const a=conn();await presence(privateRoom,users[3],a);
    await assert.rejects(ready(privateRoom,users[3],a),/public-room/);
    assert.equal((await read(privateRoom,users[3])).currentPlayer.lobby_ready,false);
    assert.equal((await start(privateRoom,users[3])).status,'in-progress','private host still starts manually');
    await cleanup();
  });
  await check("due starts stay atomic; later Ready cannot mutate an active match",async()=>{
    const {r,c}=await setup();
    await ready(r,users[0],c[0]);await ready(r,users[1],c[1]);
    await db.query("update multiplayer_rooms set countdown_ends_at=clock_timestamp()-interval '1 second' where id=$1",[r]);
    assert.equal((await start(r,users[1])).status,'in-progress');
    await start(r,users[0]);
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),5);
    await assert.rejects(ready(r,users[1],c[1]),/started/);
    assert.equal((await read(r,users[1])).currentPlayer.lobby_ready,false);
    await cleanup();
  });
  await check("Ready RPC is service-only and helpers are internal; browser table privileges are not broadened",async()=>{
    const signature='set_multiplayer_lobby_ready(uuid,uuid,boolean,bigint,uuid,uuid)';
    for(const role of ['anon','authenticated']) {
      assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')",[role,signature]),false);
      assert.equal(await scalar("select has_column_privilege($1,'multiplayer_players','lobby_ready_settings_version','UPDATE')",[role]),false);
    }
    assert.equal(await scalar("select has_function_privilege('service_role',$1,'EXECUTE')",[signature]),true);
    for(const signature of ['clear_multiplayer_lobby_ready()','shorten_multiplayer_ready_countdown(uuid)','recheck_multiplayer_lobby_ready_after_delete()'])
      for(const role of ['anon','authenticated','service_role'])
        assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')",[role,signature]),false);
  });
  console.log('PASS: '+checks+' Stage 2 isolated database scenarios. Not a hosted concurrency test.');
} catch(error) {
  console.error(error.stack,error.where??"");
  process.exitCode=1;
} finally { await db.close(); }

