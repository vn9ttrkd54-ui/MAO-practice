type QuestionNavigationProps = {
  previousDisabled: boolean;
  nextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function QuestionNavigation({
  previousDisabled,
  nextDisabled,
  onPrevious,
  onNext,
}: QuestionNavigationProps) {
  return (
    <div className="mt-6 flex flex-wrap justify-between gap-3">
      <button
        type="button"
        disabled={previousDisabled}
        onClick={onPrevious}
        className="
          bg-black
          text-white
          px-4
          py-3
          rounded-lg
          hover:bg-gray-800
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        ← Previous
      </button>

      <button
        type="button"
        disabled={nextDisabled}
        onClick={onNext}
        className="
          bg-black
          text-white
          px-4
          py-3
          rounded-lg
          hover:bg-gray-800
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        Next →
      </button>
    </div>
  );
}
