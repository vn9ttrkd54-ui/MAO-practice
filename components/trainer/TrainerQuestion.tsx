import type {
  AnswerChoice,
  Question,
} from "@/types/question";

import MultipleChoice from "@/components/practice/MultipleChoice";
import SolutionPanel from "@/components/practice/SolutionPanel";
import MathText from "@/components/math/MathText";
import QuestionImage from "@/components/questions/QuestionImage";

type TrainerQuestionProps = {
  question: Question;
  selectedAnswer: AnswerChoice | null;
  submitted: boolean;
  saving: boolean;
  answerLocked: boolean;
  onSelectAnswer: (answer: AnswerChoice) => void;
  onSubmit: () => void;
  onGiveUp: () => void;
  onNextQuestion: () => void;
};

export default function TrainerQuestion({
  question,
  selectedAnswer,
  submitted,
  saving,
  answerLocked,
  onSelectAnswer,
  onSubmit,
  onGiveUp,
  onNextQuestion,
}: TrainerQuestionProps) {
  return (
    <section className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-5 shadow-[0_12px_30px_rgba(17,24,39,0.14)] sm:p-7">
      <h2 className="mb-4 text-2xl font-bold">
        Question
      </h2>

      <div
        className="text-lg leading-8"
        style={{ marginBottom: "30px", padding: "20px 22px", border: "2px solid #cbd5e1", borderRadius: "14px", backgroundColor: "#ffffff" }}
      >
        <MathText>{question.question}</MathText>
        <QuestionImage illustration={question.illustration} />
      </div>

      <MultipleChoice
        choices={question.choices}
        selectedAnswer={selectedAnswer}
        submitted={submitted || saving || answerLocked}
        onSelect={(answer) =>
          onSelectAnswer(answer as AnswerChoice)
        }
      />

      {!submitted && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving || (!selectedAnswer && !answerLocked)}
            className="
              rounded-lg
              bg-gradient-to-br
              from-[#2563eb]
              to-[#111827]
              px-6
              py-3
              font-semibold
              text-white
              shadow-md
              transition
              hover:brightness-110
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : answerLocked ? "Retry save" : "Submit"}
          </button>

          <button
            type="button"
            onClick={onGiveUp}
            disabled={saving || answerLocked}
            className="
              rounded-lg
              border-2
              border-[#111827]
              bg-white
              px-6
              py-3
              font-semibold
              text-slate-950
              transition
              hover:bg-slate-100
            "
          >
            Give Up
          </button>
        </div>
      )}

      <SolutionPanel
        submitted={submitted}
        selectedAnswer={selectedAnswer}
        correctAnswer={question.answer}
        solution={question.solution}
        showReattemptButton={false}
        questionId={question.id}
        division={question.division}
      />

      {submitted && (
        <div className="mt-8">
          <button
            type="button"
            onClick={onNextQuestion}
            disabled={saving}
            className="
              rounded-lg
              bg-gradient-to-br
              from-[#2563eb]
              to-[#111827]
              px-6
              py-3
              font-semibold
              text-white
              shadow-md
              transition
              hover:brightness-110
            "
          >
            {saving ? "Loading question…" : "Next Question"}
          </button>
        </div>
      )}
    </section>
  );
}
