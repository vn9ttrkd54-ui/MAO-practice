// Isolated PostgreSQL: actual migrations, no hosted database or credentials.
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
    grant usage on schema auth to authenticated;
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create table public.profiles(id uuid primary key, username text);
    create function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=clock_timestamp(); return new; end;$$;
    create schema realtime; create table realtime.test_events(payload jsonb);
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as
    $$insert into realtime.test_events values(payload)$$;`);
  const schema = await migration("009_multiplayer_pack_m2_schema");
  await db.exec(schema.slice(0, schema.indexOf("-- Row Level Security")) + "\ncommit;");
  await db.exec(schema.slice(schema.indexOf("-- Row Level Security"),schema.indexOf("-- Realtime is limited")));
  await db.exec(`alter table multiplayer_spectators add column last_seen_at timestamptz default clock_timestamp();
    grant select on multiplayer_players to authenticated;`);
  for (const name of ["022_multiplayer_realtime_foundation", "023_multiplayer_realtime_signal_filter",
    "024_multiplayer_atomic_round_transitions", "025_fix_multiplayer_transition_timestamp",
    "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery", "028_fix_multiplayer_state_trigger",
    "029_preload_multiplayer_questions", "030_confirm_preloaded_round_before_reveal", "031_multiplayer_atomic_submissions",
    "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots", "034_multiplayer_database_worker",
    "036_multiplayer_readiness_countdown", "037_multiplayer_balanced_rp", "040_multiplayer_authoritative_scoring_clock",
    "047_multiplayer_host_account_deletion", "049_multiplayer_room_lifecycle", "051_multiplayer_confirmed_lobby_transitions",
    "059_multiplayer_room_settings", "060_multiplayer_lobby_ready", "061_multiplayer_scoring_give_up"]) await db.exec(await migration(name));

  const setup = async ({ count=2, players=4, guest=false, visibility="private", version=2 } = {}) => {
    if (visibility === "public") count=5;
    const r = await scalar(`insert into multiplayer_rooms(code,visibility,mode,division,question_count,seconds_per_question,capacity,scoring_version)
      values($1,$2,case when $2='public' then 'ranked' else 'unranked' end,'Mu',$3,90,$4,$5) returning id`,
      [visibility === "public" ? null : randomUUID().slice(0,8).toUpperCase(),visibility,count,visibility === "public" ? 20 : 30,version]);
    const ids=[], users=[];
    for(let i=0;i<players;i++) {
      if(guest && i===0) {
        users.push(null);
        ids.push(await scalar(`insert into multiplayer_players(room_id,guest_nickname,reconnect_token_hash)
          values($1,'Guest',$2) returning id`,[r,"a".repeat(64)]));
      } else {
        const user=randomUUID(); users.push(user);
        await db.query("insert into auth.users values($1)",[user]);
        await db.query("insert into profiles values($1,$2)",[user,`Player ${i}`]);
        ids.push(await scalar("insert into multiplayer_players(room_id,user_id) values($1,$2) returning id",[r,user]));
      }
    }
    for(let q=1;q<=count;q++) await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,
      started_at,ends_at,hard_ends_at) values($1,$2,$3,3,
      case when $2=1 then clock_timestamp()-interval '10 seconds' end,
      case when $2=1 then clock_timestamp()+interval '80 seconds' end,
      case when $2=1 then clock_timestamp()+interval '85 seconds' end)`,[r,q,100+q]);
    await db.query("update multiplayer_rooms set status='in-progress',started_at=clock_timestamp(),current_question_number=1 where id=$1",[r]);
    return {r,ids,users};
  };
  const accept=(r,p,choice,correct=false,q=101)=>scalar("select accept_multiplayer_answer($1,$2,$3,$4,$5)",[r,p,q,choice,correct]);
  const snapshot=(r,p,version=-1)=>scalar("select read_multiplayer_snapshot($1,$2,$3)",[r,p,version]);
  const board=r=>scalar("select read_multiplayer_scoreboard($1)",[r]);
  const ordered=(b,ids)=>ids.map(id=>b.players.find(p=>p.id===id));
  const lobby=(r,u,hash=null)=>scalar("select read_multiplayer_lobby($1,$2,$3)",[r,u,hash]);
  const expire=async r=>{
    await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '100 seconds',
      ends_at=clock_timestamp()-interval '10 seconds',hard_ends_at=clock_timestamp()-interval '5 seconds'
      where room_id=$1 and question_number=(select current_question_number from multiplayer_rooms where id=$1)`,[r]);
    await scalar("select advance_multiplayer_round_state($1)",[r]);
  };
  const old=await setup({version:1}); await accept(old.r,old.ids[0],"A",true);
  const completed=await setup({count:1,players:1});await accept(completed.r,completed.ids[0],"B");
  await scalar("select finalize_multiplayer_match($1)",[completed.r]);
  const tables=["multiplayer_rooms","multiplayer_players","multiplayer_submissions","multiplayer_match_questions","multiplayer_match_results","multiplayer_match_history","multiplayer_profiles"];
  const rows=async()=>Promise.all(tables.map(t=>db.query(`select to_jsonb(t) row from ${t} t order by to_jsonb(t)::text`))).then(rs=>rs.map(r=>r.rows));
  const before=await rows();
  const functions=()=>db.query(`select oid::regprocedure::text name,pg_get_functiondef(oid) def from pg_proc where proname in
    ('accept_multiplayer_answer','finalize_multiplayer_match','advance_multiplayer_round_state','acknowledge_multiplayer_question_ready') order by oid::regprocedure::text`);
  const beforeFunctions=(await functions()).rows;
  await db.exec(await migration("062_multiplayer_round_feedback"));
  await check("migration preserves every existing row and all scoring/transition functions",async()=>{
    assert.deepEqual(await rows(),before);assert.deepEqual((await functions()).rows,beforeFunctions);
    assert.equal((await board(old.r)).players.find(p=>p.id===old.ids[0]).score,0);
    assert.equal((await board(completed.r)).players[0].round_result.outcome,"incorrect");
  });
  await check("all read RPCs are server-only; browser raw scores blocked but membership columns retained",async()=>{
    for(const fn of ["read_multiplayer_scoreboard(uuid)","read_multiplayer_snapshot(uuid,uuid,bigint)","read_multiplayer_lobby(uuid,uuid,text)"]) {
      for(const role of ["anon","authenticated","service_role"])
        assert.equal(await scalar("select has_function_privilege($1,$2,'execute')",[role,fn]),role==="service_role");
      assert.equal(await scalar("select provolatile='s' and prosecdef and proconfig=array['search_path=\"\"'] from pg_proc where oid=$1::regprocedure",[fn]),true);
    }
    for(const role of ["anon","authenticated"])
      assert.equal(await scalar("select has_column_privilege($1,'multiplayer_players','score','select')",[role]),false);
    for(const col of ["id","room_id","user_id"])
      assert.equal(await scalar("select has_column_privilege('authenticated','multiplayer_players',$1,'select')",[col]),true);
    await assert.rejects(db.exec("set role authenticated; select score from multiplayer_players"),/permission denied/);
    await db.exec("reset role");
  });
  for(const visibility of ["private","public"]) await check(`${visibility} open round masks positive/negative/zero deltas in every snapshot`,async()=>{
    const {r,ids,users}=await setup({visibility});
    await accept(r,ids[0],"A",true); await accept(r,ids[1],"B");await accept(r,ids[2],null);
    const b=await board(r);assert.equal(b.roundClosed,false);
    for(const p of b.players){assert.equal(p.score,0);assert.equal(p.round_result,null);}
    assert.deepEqual(ordered(b,ids).map(p=>p.has_submitted_current_question),[true,true,true,false]);
    assert.deepEqual((await snapshot(r,ids[0])).players,b.players);
    assert.deepEqual((await lobby(r,users[0])).players,b.players.map(p=>({...p,lobby_ready:false})));
    assert.equal((await lobby(r,users[0])).currentPlayer.score,0);
    assert.ok(!JSON.stringify(b.players).match(/selected_answer|correct_answer|reconnect_token|connection_id/));
    assert.equal(await scalar("select score from multiplayer_players where id=$1",[ids[1]]),-300);
    // Passing a wall-clock deadline does not reveal results while grace/worker closure is pending.
    await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '91 seconds',
      ends_at=clock_timestamp()-interval '1 second',hard_ends_at=clock_timestamp()+interval '4 seconds' where room_id=$1 and question_number=1`,[r]);
    assert.equal((await board(r)).roundClosed,false);
    await expire(r);
    const closed=await board(r);closed.players=ordered(closed,ids);assert.equal(closed.roundClosed,true);
    assert.deepEqual(closed.players.map(p=>p.round_result.outcome),["correct","incorrect","give-up","blank"]);
    assert.ok(closed.players[0].round_result.pointsEarned>=1000);
    assert.equal(closed.players[1].round_result.pointsEarned,-300);
    assert.equal(closed.players[2].round_result.pointsEarned,0);
    assert.ok(closed.players[2].round_result.answerTimeMs>=0);
    assert.equal(closed.players[3].round_result.answerTimeMs,null);
    assert.equal(closed.players[3].round_result.pointsEarned,0);
    for(const p of closed.players)assert.equal(p.score,p.round_result.pointsEarned);
  });
  await check("membership, guest identity and unchanged-version fast path remain enforced",async()=>{
    const {r,ids}=await setup({guest:true});await accept(r,ids[0],null);
    assert.equal(await snapshot(r,randomUUID()),null);
    assert.equal(await lobby(r,null,"b".repeat(64)),null);
    const guest=await lobby(r,null,"a".repeat(64));assert.equal(guest.currentPlayer.id,ids[0]);
    const b=await snapshot(r,ids[0]);
    assert.deepEqual(await snapshot(r,ids[0],b.stateVersion),{unchanged:true,stateVersion:b.stateVersion,status:"in-progress"});
    await db.query("update multiplayer_players set left_at=clock_timestamp(),connected=false where id=$1",[ids[0]]);
    assert.equal(await snapshot(r,ids[0]),null);
  });
  await check("private-room RLS membership still works with identity-only browser columns",async()=>{
    const {r,users}=await setup();
    await db.query("select set_config('request.jwt.claim.sub',$1,false)",[users[0]]);
    await db.exec("set role authenticated");
    assert.equal(await scalar("select id from multiplayer_rooms where id=$1",[r]),r);
    assert.equal(await scalar("select count(*)::int from multiplayer_players where room_id=$1",[r]),1);
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub','',false)");
  });
  await check("waiting lobby retains readiness, own row, and fresh-presence filtering",async()=>{
    const {r,ids,users}=await setup({visibility:"public"});
    await db.query("update multiplayer_rooms set status='waiting' where id=$1",[r]);
    await db.query("update multiplayer_players set lobby_ready_settings_version=0 where id=$1",[ids[0]]);
    await db.query("update multiplayer_players set connected=false where id=$1",[ids[3]]);
    const state=await lobby(r,users[0]);assert.equal(state.players.length,3);
    assert.equal(state.currentPlayer.lobby_ready,true);
    assert.equal(state.players.find(p=>p.id===ids[1]).lobby_ready,false);
    assert.equal((await lobby(r,users[3])).currentPlayer.id,ids[3]);
  });
  await check("all submitted closes early; next round clears outcomes and preserves previous totals",async()=>{
    const {r,ids}=await setup({players:2});await accept(r,ids[0],"B");await accept(r,ids[1],null);
    assert.equal((await board(r)).roundClosed,true);
    await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '10 seconds',
      ends_at=clock_timestamp()+interval '80 seconds',hard_ends_at=clock_timestamp()+interval '85 seconds'
      where room_id=$1 and question_number=2`,[r]);
    await db.query("update multiplayer_rooms set current_question_number=2 where id=$1",[r]);
    await accept(r,ids[0],"B",false,102);
    const b=await board(r);b.players=ordered(b,ids);assert.equal(b.roundClosed,false);assert.equal(b.players[0].score,-300);
    assert.ok(b.players.every(p=>p.round_result===null));
    await accept(r,ids[1],null,false,102);
    const end=await board(r);end.players=ordered(end,ids);assert.equal(end.status,"completed");assert.equal(end.roundClosed,true);
    assert.equal(end.players[0].score,-600);assert.equal(end.players[0].round_result.questionNumber,2);
    assert.equal(end.players[0].round_result.pointsEarned,-300);
    await scalar("select finalize_multiplayer_match($1)",[r]);
    assert.equal(await scalar("select final_score from multiplayer_match_history where room_id=$1 and final_score<0",[r]),-600);
  });
  await check("reads emit no broadcasts and never mutate deadlines, scores or result history",async()=>{
    const before=await rows(), events=await scalar("select count(*) from realtime.test_events");
    for(let i=0;i<20;i++){await board(completed.r);await snapshot(old.r,old.ids[0]);}
    assert.deepEqual(await rows(),before);assert.equal(await scalar("select count(*) from realtime.test_events"),events);
  });
  await check("bounded full private roster includes 30 results without reading other rooms",async()=>{
    const {r}=await setup({players:30});await expire(r);
    const b=await board(r);assert.equal(b.players.length,30);
    assert.ok(b.players.every(p=>p.round_result.outcome==="blank"&&p.round_result.pointsEarned===0));
  });
  await check("documented rollout verification returns all true",async()=>{
    const doc=await readFile(new URL("../docs/multiplayer-feedback-stage-4.md",import.meta.url),"utf8");
    const sql=doc.match(/```sql\n([\s\S]*?)\n```/)[1];
    const result=(await db.query(sql)).rows[0];
    assert.equal(Object.keys(result).length,5);
    assert.ok(Object.values(result).every(v=>v===true),JSON.stringify(result));
  });
  console.log(`PASS ${checks} round-feedback database checks (isolated, not a live load test).`);
} finally { await db.close(); }
