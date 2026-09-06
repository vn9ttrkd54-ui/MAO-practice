import assert from "node:assert/strict";
import test from "node:test";
import { sendMultiplayerAnswer, SubmissionRejectedError } from "../lib/multiplayerSubmission.ts";

const answer = { roomId: "room", questionId: 42, selectedAnswer: "B" };
const wait = async () => {};

test("a lost response retries the exact saved answer", async () => {
  const input = { ...answer };
  const bodies = [];
  await sendMultiplayerAnswer(input, { wait, fetcher: async (_url, options) => {
    bodies.push(options.body);
    if (bodies.length === 1) {
      input.selectedAnswer = "C";
      throw new Error("Response lost after acceptance");
    }
    return Response.json({ accepted: true });
  } });
  assert.equal(bodies.length, 2);
  assert.equal(bodies[0], bodies[1]);
  assert.equal(JSON.parse(bodies[1]).selectedAnswer, "B");
});

test("temporary HTTP failures retry, but rejection does not", async () => {
  let calls = 0;
  await sendMultiplayerAnswer(answer, { wait, fetcher: async () => {
    calls++;
    return calls < 3 ? new Response(null, { status: 503 }) : Response.json({ accepted: true });
  } });
  assert.equal(calls, 3);
  calls = 0;
  await assert.rejects(sendMultiplayerAnswer(answer, { wait, fetcher: async () => {
    calls++;
    return Response.json({ error: "This question is closed." }, { status: 409 });
  } }), SubmissionRejectedError);
  assert.equal(calls, 1);
});

test("hanging requests are aborted and retries are bounded", async () => {
  let calls = 0;
  await assert.rejects(sendMultiplayerAnswer(answer, { wait, timeoutMs: 5,
    fetcher: async (_url, { signal }) => {
      calls++;
      return new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new Error("Aborted"))));
    },
  }), /choice is saved/);
  assert.equal(calls, 4);
});

test("malformed success responses are not treated as confirmation", async () => {
  let calls = 0;
  await assert.rejects(sendMultiplayerAnswer(answer, { wait, fetcher: async () => {
    calls++;
    return Response.json({});
  } }), /confirmation unavailable/);
  assert.equal(calls, 4);
});
