import React from "react";
import { createRoot } from "react-dom/client";
import MatchQuestion from "../../components/multiplayer/MatchQuestion";
import MatchResults from "../../components/multiplayer/MatchResults";
import type { MultiplayerMatchResult, MultiplayerRoundState } from "../../types/multiplayer";
const fixture = window as unknown as { initialRound: MultiplayerRoundState; initialResult?: MultiplayerMatchResult };
createRoot(document.getElementById("root")!).render(fixture.initialResult
  ? <MatchResults result={fixture.initialResult} /> : <MatchQuestion round={fixture.initialRound} />);
