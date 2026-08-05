import MathText from "@/components/math/MathText";

type MultipleChoiceProps = {
  choices: string[];
  selectedAnswer: string | null;
  submitted: boolean;
  onSelect: (answer: string) => void;
};

export default function MultipleChoice({
  choices,
  selectedAnswer,
  submitted,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <div className="space-y-3">
      {choices.map((choice, index) => {
        const letter = String.fromCharCode(65 + index);

        let style =
          "w-full border rounded-lg p-4 text-left transition";

        if (selectedAnswer === letter) {
          style += " border-blue-500 bg-blue-100";
        } else {
          style += " hover:bg-gray-50";
        }

        return (
          <button
            key={letter}
            disabled={submitted}
            className={style}
            onClick={() => onSelect(letter)}
          >
            <strong>{letter}.</strong>{" "}<MathText>{choice}</MathText>
          </button>
        );
      })}
    </div>
  );
}
