import assert from "node:assert/strict";
import test from "node:test";
import { PODIUM_PLACEMENT_MS, podiumPlayers } from "../lib/multiplayerPodium.ts";

test("under five players celebrate only the actual winner", () => {
  for (let count = 1; count < 5; count++) {
    const players = Array.from({ length: count }, (_, i) => ({ placement: count - i }));
    assert.deepEqual(podiumPlayers(players).map(p => p.placement), [1]);
  }
});
test("five or more reveal third, second, first without changing the leaderboard", () => {
  for (const count of [5, 20, 30]) {
    const players = Array.from({ length: count }, (_, i) => ({ placement: i + 1 }));
    assert.deepEqual(podiumPlayers(players).map(p => p.placement), [3, 2, 1]);
    assert.equal(players[0].placement, 1);
  }
  assert.equal(PODIUM_PLACEMENT_MS, 2500);
});
test("empty or unplaced rosters do not invent a winner", () => {
  assert.deepEqual(podiumPlayers([]), []);
  assert.deepEqual(podiumPlayers([{ placement: null }]), []);
});
