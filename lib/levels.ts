import type {
  LevelChangeResult,
  LevelProgress,
} from "@/types/level";

const LEVEL_STORAGE_KEY =
  "mao-trainer-level";

const POINTS_PER_LEVEL = 30;

function createDefaultLevel(): LevelProgress {
  return {
    level: 1,
    progress: 0,
  };
}

export function getLevelProgress(): LevelProgress {
  if (typeof window === "undefined") {
    return createDefaultLevel();
  }

  const storedData = localStorage.getItem(
    LEVEL_STORAGE_KEY
  );

  if (!storedData) {
    return createDefaultLevel();
  }

  try {
    const parsedData = JSON.parse(
      storedData
    ) as Partial<LevelProgress>;

    const level =
      typeof parsedData.level === "number" &&
      Number.isInteger(parsedData.level) &&
      parsedData.level >= 1
        ? parsedData.level
        : 1;

    const progress =
      typeof parsedData.progress === "number" &&
      Number.isInteger(parsedData.progress)
        ? Math.min(
            POINTS_PER_LEVEL - 1,
            Math.max(0, parsedData.progress)
          )
        : 0;

    return {
      level,
      progress,
    };
  } catch {
    return createDefaultLevel();
  }
}

function saveLevelProgress(
  levelProgress: LevelProgress
): LevelProgress {
  localStorage.setItem(
    LEVEL_STORAGE_KEY,
    JSON.stringify(levelProgress)
  );

  return levelProgress;
}

export function applyTrainerResult(
  isCorrect: boolean
): LevelChangeResult {
  const current = getLevelProgress();

  const previousLevel = current.level;
  const previousProgress = current.progress;

  if (!isCorrect) {
    const updated = saveLevelProgress({
      level: current.level,
      progress: Math.max(
        0,
        current.progress - 1
      ),
    });

    return {
      previousLevel,
      previousProgress,
      level: updated.level,
      progress: updated.progress,
      leveledUp: false,
    };
  }

  const nextProgress =
    current.progress + 1;

  if (
    nextProgress >=
    POINTS_PER_LEVEL
  ) {
    const updated = saveLevelProgress({
      level: current.level + 1,
      progress: 0,
    });

    return {
      previousLevel,
      previousProgress,
      level: updated.level,
      progress: updated.progress,
      leveledUp: true,
    };
  }

  const updated = saveLevelProgress({
    level: current.level,
    progress: nextProgress,
  });

  return {
    previousLevel,
    previousProgress,
    level: updated.level,
    progress: updated.progress,
    leveledUp: false,
  };
}