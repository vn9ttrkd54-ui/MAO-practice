import type {
  AnswerChoice,
  Question,
} from "@/types/question";

import MultipleChoice from "@/components/practice/MultipleChoice";
import SolutionPanel from "@/components/practice/SolutionPanel";
import MathText from "@/components/math/MathText";

type TrainerQuestionProps = {
  question: Question;
  selectedAnswer: AnswerChoice | null;
  submitted: boolean;
  onSelectAnswer: (answer: AnswerChoice) => void;
  onSubmit: () => void;
  onGiveUp: () => void;
  onNextQuestion: () => void;
};

export default function TrainerQuestion({
  question,
  selectedAnswer,
  submitted,
  onSelectAnswer,
  onSubmit,
  onGiveUp,
  onNextQuestion,
}: TrainerQuestionProps) {
  return (
    <section className="mt-8 border rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Question
      </h2>

      <div className="text-lg mb-8 leading-8"><MathText>{question.question}</MathText></div>

      <MultipleChoice
        choices={question.choices}
        selectedAnswer={selectedAnswer}
        submitted={submitted}
        onSelect={(answer) =>
          onSelectAnswer(answer as AnswerChoice)
        }
      />

      {!submitted && (
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!selectedAnswer}
            className="
              bg-black
              text-white
              px-6
              py-3
              rounded-lg
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Submit
          </button>

          <button
            type="button"
            onClick={onGiveUp}
            className="
              border
              px-6
              py-3
              rounded-lg
              hover:bg-gray-100
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
      />

      {submitted && (
        <div className="mt-8">
          <button
            type="button"
            onClick={onNextQuestion}
            className="
              bg-black
              text-white
              px-6
              py-3
              rounded-lg
              hover:bg-gray-800
            "
          >
            Next Question
          </button>
        </div>
      )}
    </section>
  );
}
