// Isolated PostgreSQL regression tests; never connects to Supabase.
// node tests/multiplayerSubmission.database.mjs /path/to/@electric-sql/pglite/dist/index.js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
try {
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create table multiplayer_rooms (id uuid primary key, status text, current_question_number integer, seconds_per_question integer);
    create table multiplayer_players (room_id uuid, id uuid, left_at timestamptz, score integer default 0,
      has_submitted_current_question boolean default false, primary key (room_id, id));
    create table multiplayer_match_questions (room_id uuid, question_number integer, question_id integer,
      started_at timestamptz, ends_at timestamptz, hard_ends_at timestamptz, intermission_ends_at timestamptz,
      primary key (room_id, question_number));
    create table multiplayer_question_deliveries (room_id uuid, question_number integer, player_id uuid, delivered_at timestamptz);
    create table multiplayer_submissions (id uuid default gen_random_uuid(), room_id uuid, question_number integer,
      question_id integer, player_id uuid, selected_answer text, correct boolean, answer_time_ms integer,
      points_earned integer check (points_earned between 0 and 1500), submitted_at timestamptz,
      unique (room_id, question_number, player_id));
  `);
  await db.exec(await readFile(new URL("../supabase/migrations/031_multiplayer_atomic_submissions.sql", import.meta.url), "utf8"));
  const room = "00000000-0000-0000-0000-000000000001";
  const player = (n) => `00000000-0000-0000-0001-${String(n).padStart(12, "0")}`;
  await db.query("insert into multiplayer_rooms values ($1, 'in-progress', 1, 60)", [room]);
  await db.query(`insert into multiplayer_match_questions values ($1, 1, 42,
    clock_timestamp() - interval '1 second', clock_timestamp() + interval '59 seconds',
    clock_timestamp() + interval '64 seconds', null)`, [room]);
  for (let n = 1; n <= 32; n++) await db.query("insert into multiplayer_players (room_id,id) values ($1,$2)", [room, player(n)]);
  const accept = (n, choice = "B", correct = true) => db.query(
    "select accept_multiplayer_answer($1,$2,42,$3,$4) as receipt", [room, player(n), choice, correct]);
  const first = (await accept(1)).rows[0].receipt;
  assert.deepEqual(first, { accepted: true, questionId: 42, questionNumber: 1, selectedAnswer: "B" });
  const original = (await db.query("select * from multiplayer_submissions where player_id=$1", [player(1)])).rows[0];
  await accept(1, "C", false);
  assert.deepEqual((await db.query("select * from multiplayer_submissions where player_id=$1", [player(1)])).rows[0], original);
  assert.equal((await db.query("select score from multiplayer_players where id=$1", [player(1)])).rows[0].score, original.points_earned);

  // Force the last write to fail: the answer insert must roll back as well.
  await db.exec(`create function reject_score() returns trigger language plpgsql as $$
    begin raise exception 'Injected score failure'; end; $$;
    create trigger reject_score before update on multiplayer_players for each row execute function reject_score();`);
  await assert.rejects(accept(2), /Injected score failure/);
  assert.equal((await db.query("select count(*)::int as n from multiplayer_submissions where player_id=$1", [player(2)])).rows[0].n, 0);
  await db.exec("drop trigger reject_score on multiplayer_players");
  await accept(2, "A", false);
  assert.equal((await db.query("select score from multiplayer_players where id=$1", [player(2)])).rows[0].score, 0);

  // Multiple queued callers and duplicate retries; PGlite is single-connection,
  // so a separate multi-connection Supabase load test is still required.
  await Promise.all(Array.from({ length: 28 }, (_, i) => accept(i + 3)));
  await Promise.all(Array.from({ length: 30 }, (_, i) => accept(i + 1)));
  assert.equal((await db.query("select count(*)::int as n from multiplayer_submissions")).rows[0].n, 30);
  assert.equal((await db.query(`select count(*)::int as n from multiplayer_players p
    join multiplayer_submissions s on p.id=s.player_id where p.score <> s.points_earned`)).rows[0].n, 0);

  await db.exec("update multiplayer_match_questions set intermission_ends_at=clock_timestamp()");
  await assert.rejects(accept(31), /closed/);
  await db.exec("update multiplayer_rooms set status='completed', current_question_number=2");
  assert.deepEqual((await accept(1)).rows[0].receipt, first);
  await assert.rejects(accept(31), /closed/);
  await db.exec(`update multiplayer_rooms set status='in-progress', current_question_number=1;
    update multiplayer_match_questions set intermission_ends_at=null,
      started_at=clock_timestamp()-interval '70 seconds', ends_at=clock_timestamp()-interval '10 seconds',
      hard_ends_at=clock_timestamp()-interval '5 seconds';`);
  await assert.rejects(accept(31), /expired/);
  assert.deepEqual((await accept(1)).rows[0].receipt, first);
  await db.exec("update multiplayer_match_questions set started_at=clock_timestamp()+interval '10 seconds'");
  await assert.rejects(accept(31), /not started/);
  const signature = "public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)";
  for (const role of ["anon", "authenticated"]) {
    assert.equal((await db.query("select has_function_privilege($1,$2,'EXECUTE') as allowed", [role, signature])).rows[0].allowed, false);
  }
  console.log("PASS: migration execution, duplicate recovery, immutable answers, rollback, score consistency, closed/expired/future rounds, and execution permissions.");
} finally {
  await db.close();
}
