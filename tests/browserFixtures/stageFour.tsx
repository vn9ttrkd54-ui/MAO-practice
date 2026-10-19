import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import katex from "katex";
import TrainerClient from "@/app/practice/trainer/TrainerClient";
import type { TrainerQuestionItem } from "@/types/trainer";

declare global {
  interface Window { __trainerMathRenders: string[] }
}

// Count real KaTeX work, not just DOM changes (React may discard identical HTML).
window.__trainerMathRenders = [];
const renderToString = katex.renderToString;
katex.renderToString = (expression, options) => {
  window.__trainerMathRenders.push(expression);
  return renderToString(expression, options);
};

const items: TrainerQuestionItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: 10001 + index, number: index + 1, division: "Mu", topic: index < 6 ? "Calculus" : "Geometry", difficulty: index % 3 + 1,
}));
function Fixture() {
  const [mounted, setMounted] = useState(true);
  return <><button onClick={() => setMounted(false)}>Unmount Trainer</button>{mounted ? <TrainerClient items={items} /> : <p>Unmounted</p>}</>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
