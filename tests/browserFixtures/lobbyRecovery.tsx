import React from "react";
import { createRoot } from "react-dom/client";
import PrivateRoomRecovery from "../../components/multiplayer/PrivateRoomRecovery";
import type { MultiplayerActiveRoom } from "../../types/multiplayer";
const fixture=window as unknown as {recoveryRooms: MultiplayerActiveRoom[]};
createRoot(document.getElementById("root")!).render(<main className="mx-auto max-w-4xl px-5 py-8">
  <h1 className="text-3xl font-bold text-slate-900">Multiplayer</h1>
  <PrivateRoomRecovery rooms={fixture.recoveryRooms} />
</main>);
