import { createRoot } from "react-dom/client";
import ChallengePage from "@/app/challenge/page";
const root = createRoot(document.getElementById("root")!);
async function render() {
  const division = new URLSearchParams(location.search).get("division") ?? "Mu";
  root.render(await ChallengePage({ searchParams: Promise.resolve({ division }) }));
}
window.addEventListener("challenge-render", () => void render());
void render();
