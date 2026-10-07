import { createRoot } from "react-dom/client";
import MultiplayerPage from "@/app/multiplayer/page";
import { rooms } from "./matchLobbyMocks";
Object.assign(window, { fixtureRooms: rooms });
void MultiplayerPage({ searchParams: Promise.resolve({}) }).then(page => createRoot(document.getElementById("root")!).render(page));
