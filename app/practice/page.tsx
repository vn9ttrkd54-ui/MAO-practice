import Link from "next/link";
import { BookOpen, ChevronRight, Zap } from "lucide-react";

import styles from "./practice.module.css";

export default function PracticePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>What do you want to practice?</h1>
          <p>Choose a mode to begin.</p>
        </header>

        <div className={styles.options}>
          <Link
            href="/practice/question-bank"
            className={`${styles.option} ${styles.questionBank}`}
          >
            <span className={styles.icon} aria-hidden="true">
              <BookOpen size={23} />
            </span>

            <span className={styles.copy}>
              <strong>Browse the question bank</strong>
              <span>Choose a division and apply filters.</span>
            </span>

            <ChevronRight className={styles.arrow} size={21} aria-hidden="true" />
          </Link>

          <Link
            href="/practice/trainer"
            className={`${styles.option} ${styles.dailyTrainer}`}
          >
            <span className={styles.icon} aria-hidden="true">
              <Zap size={23} />
            </span>

            <span className={styles.copy}>
              <strong>Start the daily trainer</strong>
              <span>Get an adaptive set selected for you.</span>
            </span>

            <ChevronRight className={styles.arrow} size={21} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
