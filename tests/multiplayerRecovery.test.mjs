import assert from "node:assert/strict";
import test from "node:test";
import { acceptRoundSnapshot, restoreMultiplayerAnswers } from "../lib/multiplayerRecovery.ts";

test("explicit Give up survives refresh while missing, invalid and duplicate choices do not", () => {
  const blank = { questionId: 42, questionNumber: 1, selectedAnswer: null };
  assert.deepEqual(restoreMultiplayerAnswers(JSON.stringify([
    blank, { ...blank, selectedAnswer: "A" }, { questionId: 43, questionNumber: 2 },
    { questionId: 44, questionNumber: 3, selectedAnswer: false },
  ])), [blank]);
});

test("stale snapshots cannot undo intermission or a local reveal", () => {
  assert.equal(acceptRoundSnapshot(9,2,10,2),false);
  assert.equal(acceptRoundSnapshot(11,1,10,2),false);
  assert.equal(acceptRoundSnapshot(11,2,10,2),true);
  assert.equal(acceptRoundSnapshot(15,5,10,2),true);
});
test("saved choices survive reload, reject corrupt storage and deduplicate", () => {
  const answer={questionId:42,questionNumber:1,selectedAnswer:"B"};
  assert.deepEqual(restoreMultiplayerAnswers(JSON.stringify([answer,answer,{...answer,questionId:43,selectedAnswer:"X"}])),[answer]);
  assert.deepEqual(restoreMultiplayerAnswers("broken"),[]);
  assert.deepEqual(restoreMultiplayerAnswers('{"questionId":42}'),[]);
});
