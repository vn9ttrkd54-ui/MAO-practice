import React from "react";
import { createRoot } from "react-dom/client";
import MatchQuestion from "../../components/multiplayer/MatchQuestion";
import ResultsPending from "../../components/multiplayer/ResultsPending";
import type { MultiplayerRoundState } from "../../types/multiplayer";
const f=window as unknown as {initialRound: MultiplayerRoundState; pendingResults?: boolean};
createRoot(document.getElementById("root")!).render(f.pendingResults ? <ResultsPending roomId="test" /> : <MatchQuestion round={f.initialRound} />);
