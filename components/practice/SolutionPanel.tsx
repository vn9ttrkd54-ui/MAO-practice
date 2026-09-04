import MathText from "@/components/math/MathText";
import QuestionReportButton from "@/components/feedback/QuestionReportButton";
import type { Division } from "@/types/question";

type SolutionPanelProps = {
  submitted: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
  solution: string;
  onReattempt?: () => void;
  showReattemptButton?: boolean;
  questionId?: number;
  division?: Division;
};

export default function SolutionPanel({
  submitted,
  selectedAnswer,
  correctAnswer,
  solution,
  onReattempt,
  showReattemptButton = true,
  questionId,
  division,
}: SolutionPanelProps) {
  if (!submitted) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-6 sm:mt-10 sm:pt-8">
      <h2 className="text-xl font-bold sm:text-2xl">
        {selectedAnswer === correctAnswer
          ? "Correct!"
          : selectedAnswer === null
            ? "Gave Up"
            : "Incorrect"}
      </h2>

      <div className="mt-4 min-w-0 overflow-hidden rounded-lg border bg-gray-50 p-4 sm:mt-5 sm:rounded-xl sm:p-6">
        <h3 className="text-lg font-semibold sm:text-xl">
          Solution
        </h3>

        <div className="mt-3 min-w-0 text-sm leading-7 sm:text-base sm:leading-8 [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto [&_.katex-display]:text-[0.84em] sm:[&_.katex-display]:text-[1em]">
          <MathText>{solution}</MathText>
        </div>
      </div>

      {questionId && division ? (
        <div className="mt-5">
          <QuestionReportButton questionId={questionId} division={division} />
        </div>
      ) : null}

      {showReattemptButton && onReattempt && (
        <button
          type="button"
          onClick={onReattempt}
          className="
            mt-6
            border
            px-6
            py-3
            rounded-lg
            hover:bg-gray-100
          "
        >
          Reattempt
        </button>
      )}
    </div>
  );
}
