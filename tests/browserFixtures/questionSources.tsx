import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import QuestionClient from "@/app/practice/question-bank/[id]/QuestionClient";
import TrainerQuestion from "@/components/trainer/TrainerQuestion";
import MatchQuestion from "@/components/multiplayer/MatchQuestion";
import MatchResults from "@/components/multiplayer/MatchResults";
import SpectatorView from "@/components/multiplayer/SpectatorView";
import { questions } from "@/data/questions";
import type { MultiplayerRoundState } from "@/types/multiplayer";

const params = new URLSearchParams(location.search);
const question = questions.find(q => q.id === Number(params.get("id") ?? "10302"))!;
const round: MultiplayerRoundState = {
  roomId: "fixture", currentPlayerId: "player", stateVersion: 1, scoringVersion: 3,
  questionNumber: 2, totalQuestions: 5, questionDurationSeconds: 90,
  questionStartedAt: Date.now() - 1000, questionEndsAt: Date.now() + 89000, intermissionEndsAt: null,
  question: { questionId: question.id, number: 2, division: question.division, topic: question.topic,
    difficulty: question.difficulty, question: question.question, choices: question.choices, source: question.source,
    illustration: question.illustration },
  players: [], spectators: [], upcomingQuestion: null,
};
Object.assign(window, { sourceCreditRound: round });

function Fixture() {
  const [submitted, setSubmitted] = useState(params.has("revealed"));
  switch (params.get("view")) {
    case "bank": return <QuestionClient question={question} navigation={{ previousId: null, nextId: null, sequence: null }} />;
    case "play": return <MatchQuestion round={round} />;
    case "spectate": return <SpectatorView initialState={round} />;
    case "results": return <MatchResults result={{
      roomId: "fixture", viewerMode: "spectator", placement: null, score: null, ranked: false,
      ratingChange: null, finalLeaderboard: [], rounds: [{
        questionId: question.id, questionNumber: 2, question: question.question, choices: question.choices,
        source: question.source, illustration: question.illustration, selectedAnswer: null, correctAnswer: question.answer, correct: false,
        answerTimeMs: null, pointsEarned: 0, solution: question.solution,
      }],
    }} />;
    default: return <main className="mx-auto max-w-6xl p-4"><TrainerQuestion question={question}
      selectedAnswer={null} submitted={submitted} saving={false} answerLocked={false}
      onSelectAnswer={() => {}} onSubmit={() => setSubmitted(true)} onGiveUp={() => setSubmitted(true)}
      onNextQuestion={() => {}} /></main>;
  }
}
createRoot(document.getElementById("root")!).render(<Fixture />);
