import React from "react";
import { createRoot } from "react-dom/client";
import PodiumReveal from "../../components/multiplayer/PodiumReveal";
import type { MultiplayerPlayer } from "../../types/multiplayer";

const count = Number(new URLSearchParams(location.search).get("players") ?? 5);
const players = Array.from({ length: count }, (_, i) => ({
  playerId: `p${i}`, placement: i + 1, displayName: `Player ${i + 1}`,
  score: 1000 - i * 100, rankTier: "Gold", isGuest: false,
})) as MultiplayerPlayer[];
createRoot(document.getElementById("root")!).render(
  <PodiumReveal players={players}><h1>Existing final results</h1></PodiumReveal>,
);
