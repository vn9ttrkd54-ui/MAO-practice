import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import QuestionClient from "@/app/practice/question-bank/[id]/QuestionClient";
import type { Question } from "@/types/question";
function Fixture() {
  const [mounted, setMounted] = useState(true);
  const [id, setId] = useState(10001);
  const question: Question = { id, number: id - 10000, division: "Mu", topic: "Calculus", methods: [], difficulty: 1,
    question: `Fixture question ${id}: evaluate \\(x^2\\) when \\(x=2\\).`, choices: ["4", "5"], answer: "A", solution: "Fixture solution: 2 squared is 4." };
  return <><button onClick={() => setMounted(false)}>Unmount question</button><button onClick={() => setId(10002)}>Switch question</button>
    {mounted ? <QuestionClient question={question} navigation={{ previousId: null, nextId: 10002, sequence: null }} /> : <p>Unmounted</p>}</>;
}
createRoot(document.getElementById("root")!).render(<StrictMode><Fixture /></StrictMode>);
