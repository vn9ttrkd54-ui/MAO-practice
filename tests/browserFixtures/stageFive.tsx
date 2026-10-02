import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import LlamaTutor from "@/components/practice/LlamaTutor";

function Fixture() {
  const [mounted, setMounted] = useState(true);
  const [question, setQuestion] = useState(42);
  return <main style={{ padding: 32 }}>
    <h1>Tutor reliability fixture</h1>
    <button onClick={() => setQuestion(value => value + 1)}>Next fixture question</button>
    <button onClick={() => setMounted(false)}>Unmount tutor</button>
    {mounted ? <LlamaTutor questionId={question} revealToken="fixture-reveal" /> : <p>Unmounted</p>}
  </main>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
