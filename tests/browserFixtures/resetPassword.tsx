import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ResetPasswordPage from "@/app/reset-password/page";

async function render() {
  const page = await ResetPasswordPage();
  createRoot(document.getElementById("root")!).render(<StrictMode>{page}</StrictMode>);
}

void render();
