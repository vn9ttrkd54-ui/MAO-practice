import React from "react";
import { createRoot } from "react-dom/client";
import PodiumReveal from "../../components/multiplayer/PodiumReveal";
import ResultDeliveryReceipt from "../../components/multiplayer/ResultDeliveryReceipt";
import type { MultiplayerPlayer } from "../../types/multiplayer";

const count = Number(new URLSearchParams(location.search).get("players") ?? 5);
const includeReceipt = new URLSearchParams(location.search).has("receipt");
const players = Array.from({ length: count }, (_, i) => ({
  playerId: `p${i}`, placement: i + 1, displayName: `Player ${i + 1}`,
  score: 1000 - i * 100, rankTier: "Gold", isGuest: false,
})) as MultiplayerPlayer[];
createRoot(document.getElementById("root")!).render(
  <PodiumReveal players={players}>
    {includeReceipt ? <ResultDeliveryReceipt roomId="fixture-room" enabled /> : null}
    <h1>Existing final results</h1>
  </PodiumReveal>,
);
