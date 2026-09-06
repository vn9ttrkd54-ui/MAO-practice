import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("Alpha bank labels are unique and sequential without replacing question IDs", () => {
  const source = readFileSync(new URL("../data/questions/alpha.ts", import.meta.url), "utf8");
  const numbers = [...source.matchAll(/\bnumber:\s*(\d+)/g)].map(match => Number(match[1]));
  const ids = [...source.matchAll(/\bid:\s*(\d+)/g)].map(match => Number(match[1]));
  assert.equal(numbers.length, 147);
  assert.deepEqual(numbers, Array.from({length: numbers.length}, (_, index) => index + 1));
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids.slice(-59), Array.from({length: 59}, (_, index) => 20091 + index));
});
