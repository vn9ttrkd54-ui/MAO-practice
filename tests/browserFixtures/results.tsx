import React from "react";
import { createRoot } from "react-dom/client";
import MatchResults from "../../components/multiplayer/MatchResults";
import { questions } from "../../data/questions";

createRoot(document.getElementById("root")!).render(<MatchResults result={{
  roomId: "test", viewerMode: "player", placement: 1, score: 1000, ranked: false,
  ratingChange: null, finalLeaderboard: [], rounds: questions.slice(0, 2).map((q, i) => ({
    questionId: q.id, questionNumber: i + 1, question: q.question, choices: q.choices,
    selectedAnswer: "A", correctAnswer: "A", correct: true, answerTimeMs: 1000,
    pointsEarned: 500, solution: "Test solution",
  })),
}} />);
