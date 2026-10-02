import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import TrainerClient from "@/app/practice/trainer/TrainerClient";
import type { TrainerQuestionItem } from "@/types/trainer";

const items: TrainerQuestionItem[] = Array.from({ length: new URLSearchParams(location.search).has("single") ? 1 : 12 }, (_, index) => ({
  id: 10001 + index, number: index + 1, division: "Mu", topic: "Calculus", difficulty: index % 3 + 1,
}));
function Fixture() {
  const [mounted, setMounted] = useState(true);
  return <><button onClick={() => setMounted(false)}>Unmount Trainer</button>{mounted ? <TrainerClient items={items} /> : <p>Unmounted</p>}</>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
