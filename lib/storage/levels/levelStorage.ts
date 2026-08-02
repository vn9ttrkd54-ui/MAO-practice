import type {
  LevelChangeResult,
  LevelProgress,
} from "@/types/level";

export interface LevelStorage {
  getLevelProgress(): Promise<LevelProgress>;
  applyTrainerResult(
    isCorrect: boolean
  ): Promise<LevelChangeResult>;
}

export const POINTS_PER_LEVEL = 30;

export function createDefaultLevel(): LevelProgress {
  return {
    level: 1,
    progress: 0,
  };
}

export function calculateLevelChange(
  current: LevelProgress,
  isCorrect: boolean
): LevelChangeResult {
  const previousLevel = current.level;
  const previousProgress = current.progress;

  if (!isCorrect) {
    return {
      previousLevel,
      previousProgress,
      level: current.level,
      progress: Math.max(0, current.progress - 1),
      leveledUp: false,
    };
  }

  const nextProgress = current.progress + 1;

  if (nextProgress >= POINTS_PER_LEVEL) {
    return {
      previousLevel,
      previousProgress,
      level: current.level + 1,
      progress: 0,
      leveledUp: true,
    };
  }

  return {
    previousLevel,
    previousProgress,
    level: current.level,
    progress: nextProgress,
    leveledUp: false,
  };
}
