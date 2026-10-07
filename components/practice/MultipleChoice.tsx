import MathText from "@/components/math/MathText";
import { Circle } from "lucide-react";
import styles from "./question-detail.module.css";

type MultipleChoiceProps = {
  choices: string[];
  selectedAnswer: string | null;
  submitted: boolean;
  onSelect: (answer: string) => void;
  appearance?: "division";
};

export default function MultipleChoice({
  choices,
  selectedAnswer,
  submitted,
  onSelect,
  appearance,
}: MultipleChoiceProps) {
  return (
    <div className={appearance === "division" ? styles.choices : "space-y-3"}>
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
            className={appearance === "division" ? styles.choice : style}
            aria-pressed={selectedAnswer === letter}
            onClick={() => onSelect(letter)}
          >
            {appearance === "division" ? <><span className={styles.letter}>{letter}</span><span className={styles.choiceText}><MathText>{choice}</MathText></span><Circle size={16} aria-hidden="true" /></> : <><strong>{letter}.</strong>{" "}<MathText>{choice}</MathText></>}
          </button>
        );
      })}
    </div>
  );
}
