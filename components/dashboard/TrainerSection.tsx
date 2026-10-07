import DashboardSection from "./DashboardSection";
import StatCard from "./StatCard";
import styles from "./dashboard.module.css";

interface TrainerSectionProps {
  level: { level: number; progress: number };
  trainer: { sessionsCompleted: number; questionsAnswered: number; accuracy: number;
    averageQuestionsPerSession: number; averageSessionDurationSeconds: number; bestSessionAccuracy: number; bestSessionCorrect: number };
}

function formatDuration(totalSeconds: number) {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60), seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

export default function TrainerSection({ level, trainer }: TrainerSectionProps) {
  return <DashboardSection title="Trainer Analytics" label="Training" theme="training">
    <div className={styles.trainerMetrics}>
      <StatCard label="Current Level" value={`Level ${level.level}`} detail={`${level.progress} / 30 progress`} />
      <StatCard label="Lifetime Accuracy" value={`${trainer.accuracy}%`} detail={`${trainer.questionsAnswered} total answers`} />
      <StatCard label="Sessions Completed" value={trainer.sessionsCompleted} detail={`${trainer.sessionsCompleted} saved ${trainer.sessionsCompleted === 1 ? "session" : "sessions"}`} />
      <StatCard label="Questions per Session" value={trainer.averageQuestionsPerSession} detail="Lifetime average" />
      <StatCard label="Average Session Length" value={formatDuration(trainer.averageSessionDurationSeconds)} detail="From start to finish" />
      <StatCard label="Best Session" value={`${trainer.bestSessionAccuracy}%`} detail={trainer.sessionsCompleted > 0 ? `${trainer.bestSessionCorrect} correct answers` : "Complete a session to begin"} />
    </div>
  </DashboardSection>;
}
