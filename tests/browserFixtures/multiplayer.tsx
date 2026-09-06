import React from "react";
import { createRoot } from "react-dom/client";
import MatchQuestion from "../../components/multiplayer/MatchQuestion";
createRoot(document.getElementById("root")!).render(<MatchQuestion round={(window as unknown as { initialRound: never }).initialRound} />);
