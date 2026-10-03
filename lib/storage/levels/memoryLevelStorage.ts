import type { LevelProgress } from "@/types/level";

import {
  calculateLevelChange,
  createDefaultLevel,
} from "@/lib/storage/levels/levelStorage";

import type { LevelStorage } from "@/lib/storage/levels/levelStorage";

let currentLevel: LevelProgress = createDefaultLevel();

// Only guest recovery uses this; signed-in levels remain server-controlled.
export function restoreGuestTrainerLevel(level: LevelProgress) {
  currentLevel = { ...level };
}

export const memoryLevelStorage: LevelStorage = {
  async getLevelProgress() {
    return { ...currentLevel };
  },

  async applyTrainerResult(isCorrect) {
    const change = calculateLevelChange(
      currentLevel,
      isCorrect
    );

    currentLevel = {
      level: change.level,
      progress: change.progress,
    };

    return change;
  },
};
