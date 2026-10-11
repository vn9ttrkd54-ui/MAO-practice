import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TrainerClient from "@/app/practice/trainer/TrainerClient";
import type { TrainerQuestionItem } from "@/types/trainer";

const items: TrainerQuestionItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: 10001 + index, number: index + 1, division: "Mu", topic: "Calculus", difficulty: index % 5 + 1,
}));
createRoot(document.getElementById("root")!).render(<StrictMode><TrainerClient items={items} /></StrictMode>);
