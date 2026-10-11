import React from "react";
import { createRoot } from "react-dom/client";
import MatchResults from "../../components/multiplayer/MatchResults";
import { questions } from "../../data/questions";

const params = new URLSearchParams(window.location.search);
const isSpectator = params.get("viewer") === "spectator";
const ranked = params.has("ranked");

createRoot(document.getElementById("root")!).render(<MatchResults result={{
  roomId: "test", viewerMode: isSpectator ? "spectator" : "player", placement: isSpectator ? null : 1,
  score: isSpectator ? null : 1000, ranked,
  ratingChange: ranked ? {
    previousRp: 273, change: 12, newRp: 285, previousTier: "Silver", newTier: "Silver",
    opponentAdjustment: 0, performanceIndex: 1, completionFactor: 1,
  } : null,
  finalLeaderboard: [], rounds: questions.slice(0, 2).map((q, i) => ({
    questionId: q.id, questionNumber: i + 1, question: q.question, choices: q.choices,
    selectedAnswer: "A", correctAnswer: "A", correct: true, answerTimeMs: 1000,
    pointsEarned: 500, solution: "Test solution",
  })),
}} />);
