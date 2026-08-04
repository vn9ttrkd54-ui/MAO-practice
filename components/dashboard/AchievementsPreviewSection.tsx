import {
  Award,
  Brain,
  Check,
  Lock,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

interface AchievementsPreviewSectionProps {
  level: {
    level: number;
  };
  trainer: {
    sessionsCompleted: number;
    questionsAnswered: number;
    accuracy: number;
  };
  questionBank: {
    solved: number;
  };
}

interface AchievementPreview {
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  goal: number;
  progressLabel: string;
  icon: typeof Award;
}

function clampPercentage(value: number, goal: number) {
  if (goal <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / goal) * 100));
}

export default function AchievementsPreviewSection({
  level,
  trainer,
  questionBank,
}: AchievementsPreviewSectionProps) {
  const accuracyGoalProgress =
    trainer.questionsAnswered >= 10
      ? trainer.accuracy
      : Math.round(
          (trainer.questionsAnswered / 10) * 80
        );

  const achievements: AchievementPreview[] = [
    {
      title: "First Steps",
      description: "Solve your first Question Bank problem.",
      unlocked: questionBank.solved >= 1,
      progress: questionBank.solved,
      goal: 1,
      progressLabel: `${Math.min(questionBank.solved, 1)} / 1 solved`,
      icon: Check,
    },
    {
      title: "Training Day",
      description: "Complete your first Trainer session.",
      unlocked: trainer.sessionsCompleted >= 1,
      progress: trainer.sessionsCompleted,
      goal: 1,
      progressLabel: `${Math.min(trainer.sessionsCompleted, 1)} / 1 session`,
      icon: Brain,
    },
    {
      title: "Sharp Shooter",
      description: "Reach 80% accuracy after answering 10 Trainer questions.",
      unlocked:
        trainer.questionsAnswered >= 10 &&
        trainer.accuracy >= 80,
      progress: accuracyGoalProgress,
      goal: 80,
      progressLabel:
        trainer.questionsAnswered < 10
          ? `${trainer.questionsAnswered} / 10 questions`
          : `${trainer.accuracy}% / 80% accuracy`,
      icon: Target,
    },
    {
      title: "Rising Contender",
      description: "Reach Trainer Level 5.",
      unlocked: level.level >= 5,
      progress: level.level,
      goal: 5,
      progressLabel: `Level ${level.level} / 5`,
      icon: Trophy,
    },
  ];

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <section className="mt-12">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
            <Award size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Achievement Preview
            </h2>

            <p className="mt-1 max-w-2xl text-gray-600">
              Preview milestone progress using your current MAO activity.
              Permanent badges and unlock dates will arrive with the full
              achievement system.
            </p>
          </div>
        </div>

        <div className="hidden rounded-full border bg-white px-4 py-2 text-sm font-semibold text-gray-700 sm:block">
          {unlockedCount} / {achievements.length} preview milestones
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const percentage = clampPercentage(
            achievement.progress,
            achievement.goal
          );

          return (
            <article
              key={achievement.title}
              className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                achievement.unlocked
                  ? "border-violet-200 bg-gradient-to-br from-violet-50 to-white"
                  : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`rounded-xl p-3 ${
                    achievement.unlocked
                      ? "bg-violet-100 text-violet-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    achievement.unlocked
                      ? "bg-violet-100 text-violet-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {achievement.unlocked ? (
                    <Sparkles size={13} />
                  ) : (
                    <Lock size={13} />
                  )}

                  {achievement.unlocked ? "Unlocked" : "In progress"}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-950">
                {achievement.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                {achievement.description}
              </p>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-500">
                  <span>{achievement.progressLabel}</span>
                  <span>{percentage}%</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      achievement.unlocked
                        ? "bg-violet-600"
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
