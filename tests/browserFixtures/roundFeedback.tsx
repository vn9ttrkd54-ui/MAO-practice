import React from "react";
import { createRoot } from "react-dom/client";
import MatchQuestion from "../../components/multiplayer/MatchQuestion";
import MatchResults from "../../components/multiplayer/MatchResults";
import SpectatorView from "../../components/multiplayer/SpectatorView";
import type { MultiplayerMatchResult, MultiplayerRoundState, MultiplayerSpectatorState } from "../../types/multiplayer";
const fixture = window as unknown as { initialRound: MultiplayerRoundState; initialResult?: MultiplayerMatchResult; initialSpectator?: MultiplayerSpectatorState };
createRoot(document.getElementById("root")!).render(fixture.initialResult ? <MatchResults result={fixture.initialResult} />
  : fixture.initialSpectator ? <SpectatorView initialState={fixture.initialSpectator} /> : <MatchQuestion round={fixture.initialRound} />);
