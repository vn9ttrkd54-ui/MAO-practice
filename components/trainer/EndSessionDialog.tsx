import { ArrowRight, ChartNoAxesColumn, Play } from "lucide-react";
import styles from "./end-session-dialog.module.css";

type EndSessionDialogProps = {
  open: boolean;
  questionsAnswered: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  onContinue: () => void;
  onConfirmEnd: () => void;
};

export default function EndSessionDialog({ open, questionsAnswered, correct, incorrect, giveUps, onContinue, onConfirmEnd }: EndSessionDialogProps) {
  if (!open) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="end-session-title" aria-describedby="end-session-description">
      <div className={styles.dialog}>
        <ChartNoAxesColumn size={24} className={styles.icon} aria-hidden="true" />
        <h2 id="end-session-title">End Daily Trainer?</h2>
        <p id="end-session-description" className={styles.description}>Your session summary will be shown after you end the session.</p>
        <div className={styles.summary}>
          <dl className={styles.total}><dt>Questions</dt><dd>{questionsAnswered}</dd></dl>
          <dl className={styles.results}>
            <div className={styles.correct}><dt>Correct</dt><dd>{correct}</dd></div>
            <div className={styles.incorrect}><dt>Incorrect</dt><dd>{incorrect}</dd></div>
            <div className={styles.gaveUp}><dt>Gave Up</dt><dd>{giveUps}</dd></div>
          </dl>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onContinue} className={styles.continue}><Play size={16} aria-hidden="true" />Continue Session</button>
          <button type="button" onClick={onConfirmEnd} className={styles.end}>End Session<ArrowRight size={16} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
