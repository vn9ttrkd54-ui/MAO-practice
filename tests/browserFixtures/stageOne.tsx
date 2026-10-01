import { useState } from "react";
import { createRoot } from "react-dom/client";
import PrivateLobby from "../../components/multiplayer/PrivateLobby";
import SpectatorView from "../../components/multiplayer/SpectatorView";
import PracticeLoading from "../../components/practice/PracticeLoading";
import MathText from "../../components/math/MathText";
import { LiveRoomListRefresh } from "../../components/multiplayer/LiveRoomListRefresh";
import type { MultiplayerPublicRoom } from "../../types/multiplayer";
import PublicRoomList from "../../components/multiplayer/PublicRoomList";

const fixture = window as unknown as { mode: string; initialLobby: never; initialSpectator: never; initialRooms: MultiplayerPublicRoom[] };
function StageOne() {
  const [mounted, setMounted] = useState(true);
  const [rooms, setRooms] = useState<MultiplayerPublicRoom[]>([]);
  if (!mounted) return <p>Unmounted</p>;
  return <>
    <button onClick={() => setMounted(false)}>Unmount fixture</button>
    {fixture.mode === "cards" ? <PublicRoomList initialRooms={fixture.initialRooms} signedIn />
      : fixture.mode === "directory" ? <><LiveRoomListRefresh onRooms={setRooms} /><p id="room-count">{rooms[0]?.playerCount ?? -1}</p></>
      : fixture.mode === "lobby" ? <PrivateLobby initialLobby={fixture.initialLobby} />
      : fixture.mode === "spectator" ? <SpectatorView initialState={fixture.initialSpectator} />
      : <>
          <PracticeLoading />
          <section id="question-card" className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-5">
            <h2>Question</h2>
            <div id="question-copy"><MathText>{"Evaluate \\(x^2\\) at \\(x=2\\)."}</MathText></div>
          </section>
        </>}
  </>;
}
createRoot(document.getElementById("root")!).render(<StageOne />);
