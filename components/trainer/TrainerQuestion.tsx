import type {
  AnswerChoice,
  Question,
} from "@/types/question";

import MultipleChoice from "@/components/practice/MultipleChoice";
import SolutionPanel from "@/components/practice/SolutionPanel";
import MathText from "@/components/math/MathText";
import QuestionImage from "@/components/questions/QuestionImage";
import QuestionSourceCredit from "@/components/questions/QuestionSourceCredit";
import styles from "./trainer-session.module.css";

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
    <section className={styles.question}>
      <h2>
        Question
      </h2>
      <QuestionSourceCredit source={question.source} />

      <div className={styles.problem}>
        <MathText>{question.question}</MathText>
        <QuestionImage illustration={question.illustration} />
      </div>

      <MultipleChoice
        appearance="division"
        choices={question.choices}
        selectedAnswer={selectedAnswer}
        submitted={submitted || saving || answerLocked}
        onSelect={(answer) =>
          onSelectAnswer(answer as AnswerChoice)
        }
      />

      {!submitted && (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving || (!selectedAnswer && !answerLocked)}
            className={styles.primary}
          >
            {saving ? "Saving..." : answerLocked ? "Retry save" : "Submit"}
          </button>

          <button
            type="button"
            onClick={onGiveUp}
            disabled={saving || answerLocked}
            className={styles.secondary}
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
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onNextQuestion}
            disabled={saving}
            className={styles.primary}
          >
            {saving ? "Loading question…" : "Next Question"}
          </button>
        </div>
      )}
    </section>
  );
}
