import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DashboardSection from "./DashboardSection";
import StatCard from "./StatCard";
import styles from "./dashboard.module.css";

interface QuestionBankSectionProps {
  questionBank: { totalQuestions: number; solved: number; attempted: number; newQuestions: number; bookmarked: number };
}

export default function QuestionBankSection({ questionBank }: QuestionBankSectionProps) {
  const percentage = (count: number) => questionBank.totalQuestions > 0 ? count / questionBank.totalQuestions * 100 : 0;
  return <DashboardSection title="Question Bank" label="Practice Library" theme="bank"
    action={<Link href="/practice/question-bank" className={styles.action}>Open Question Bank<ArrowRight size={16} aria-hidden="true" /></Link>}>
    <div className={styles.bankMetrics}>
      <StatCard label="Solved" value={questionBank.solved} />
      <StatCard label="Attempted" value={questionBank.attempted} />
      <StatCard label="New" value={questionBank.newQuestions} />
      <StatCard label="Bookmarked" value={questionBank.bookmarked} />
    </div>
    <div className={styles.bankBar} role="img" aria-label={`${questionBank.totalQuestions} questions: ${questionBank.solved} solved, ${questionBank.attempted} attempted, ${questionBank.newQuestions} new`}>
      <span className={styles.solved} style={{ width: `${percentage(questionBank.solved)}%` }} />
      <span className={styles.attempted} style={{ width: `${percentage(questionBank.attempted)}%` }} />
    </div>
    <div className={styles.bankCaption}><span>{Math.round(percentage(questionBank.solved))}% solved</span><span>{questionBank.totalQuestions} total questions</span></div>
  </DashboardSection>;
}
