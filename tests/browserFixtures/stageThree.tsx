import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import QuestionBankDivisionClient from "@/components/practice/QuestionBankDivisionClient";
import type { QuestionBankItem } from "@/lib/questionBankListing";

const items: QuestionBankItem[] = Array.from({ length: 275 }, (_, index) => ({
  id: 10001 + index, number: index + 1, division: "Mu", topic: index < 200 ? "Calculus" : "Geometry",
  difficulty: index % 5 + 1, methods: [index % 2 ? "Direct" : "Substitution"],
}));
function Fixture() {
  const [mounted, setMounted] = useState(true);
  return <><button onClick={() => setMounted(false)}>Unmount bank</button>{mounted ? <QuestionBankDivisionClient division="Mu" items={items} /> : <p>Unmounted</p>}</>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
