import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const migration = name => readFile(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
try {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql as $$select '00000000-0000-0000-0000-000000000001'::uuid$$;
    create table public.profiles(id uuid primary key,username text);`);
  for (const name of ['003_challenge_pack_c2','004_challenge_pack_c6_submission','005_challenge_pack_c8_leaderboard',
    '006_challenge_leaderboard_daily_tiebreak','007_challenge_pack_c9_personal_rank','008_challenge_public_read_boundaries']) await db.exec(await migration(name));
  await db.exec(`insert into daily_challenges(challenge_date,question_id) values(current_date-1,'CH-0003');`);
  await db.exec(await migration('038_daily_challenge_divisions'));
  assert.equal((await db.query('select division from daily_challenges')).rows[0].division,'Theta');
  const user = '00000000-0000-0000-0000-000000000001';
  await db.query('insert into auth.users values($1)',[user]);
  await db.query("insert into profiles values($1,'Tester')",[user]);
  await db.query(`insert into challenge_attempts(user_id,challenge_date,question_id,selected_answer,correct)
    values($1,current_date-1,'CH-0003','A',true)`,[user]);
  await db.exec(`insert into daily_challenges(challenge_date,division,question_id) values
    (current_date,'Mu','CH-0001'),(current_date,'Alpha','CH-0002'),(current_date,'Theta','CH-0006');`);
  await assert.rejects(db.exec("insert into daily_challenges(challenge_date,division,question_id) values(current_date,'Mu','CH-0004')"),/unique/);
  const submit = (id,correct) => db.query('select submit_challenge_attempt($1,current_date,$2,\'A\',$3)',[user,id,correct]);
  const stats = async () => (await db.query('select * from challenge_user_statistics')).rows[0];
  await submit('CH-0001',false);
  assert.equal((await stats()).current_streak,0);
  await submit('CH-0002',true);
  assert.equal((await stats()).current_streak,2,'another division can earn credit after a wrong answer');
  await submit('CH-0006',false);
  assert.equal((await stats()).current_streak,2,'an extra wrong answer cannot erase earned credit');
  assert.equal((await stats()).total_completed,4);
  assert.equal((await stats()).total_correct,2);
  await assert.rejects(submit('CH-0002',true),/unique/);
  assert.equal((await stats()).total_completed,4,'duplicate rolls back stats');
  await assert.rejects(submit('CH-0005',true),/foreign key/);
  for (const fn of ['get_challenge_leaderboard()','get_my_challenge_leaderboard_position()',`get_challenge_leaderboard_position('${user}')`]) {
    const rows=(await db.query(`select * from ${fn}`)).rows;
    assert.equal(rows.length,1,'one leaderboard entry per user');
    assert.equal(rows[0].current_streak,2);
  }
  await db.exec(`insert into auth.users values('00000000-0000-0000-0000-000000000002');`);
  for (const id of ['CH-0001','CH-0002','CH-0006']) await db.query("select submit_challenge_attempt('00000000-0000-0000-0000-000000000002',current_date,$1,'A',true)",[id]);
  assert.equal((await db.query("select current_streak from challenge_user_statistics where user_id='00000000-0000-0000-0000-000000000002'")).rows[0].current_streak,1);
  assert.equal((await db.query("select has_function_privilege('anon','submit_challenge_attempt(uuid,date,text,text,boolean)','EXECUTE') allowed")).rows[0].allowed,false);
  console.log('PASS: division assignments, preserved history, one streak day across three attempts, wrong/correct ordering, duplicate rollback, assignment validation, leaderboard deduplication, permissions.');
} catch (error) {
  console.error(error.message, error.where ?? "");
  process.exitCode = 1;
} finally { await db.close(); }
