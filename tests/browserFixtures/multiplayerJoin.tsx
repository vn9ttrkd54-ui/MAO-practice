import { createRoot } from "react-dom/client";
import JoinPrivateRoomPage from "@/app/multiplayer/join/page";

void JoinPrivateRoomPage({
  searchParams: Promise.resolve({ error: new URLSearchParams(location.search).get("error") ?? undefined }),
}).then(page => createRoot(document.getElementById("root")!).render(page));
