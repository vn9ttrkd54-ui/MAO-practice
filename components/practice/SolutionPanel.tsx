type SolutionPanelProps = {
  submitted: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
  solution: string;
  onReattempt?: () => void;
  showReattemptButton?: boolean;
};

export default function SolutionPanel({
  submitted,
  selectedAnswer,
  correctAnswer,
  solution,
  onReattempt,
  showReattemptButton = true,
}: SolutionPanelProps) {
  if (!submitted) {
    return null;
  }

  return (
    <div className="mt-10 border-t pt-8">
      <h2 className="text-2xl font-bold">
        {selectedAnswer === correctAnswer
          ? "Correct!"
          : selectedAnswer === null
            ? "Gave Up"
            : "Incorrect"}
      </h2>

      <div className="mt-5 border rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-xl">
          Solution
        </h3>

        <p className="mt-3">
          {solution}
        </p>
      </div>

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