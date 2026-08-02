import { createClient } from "@/lib/supabase/client";
import { memoryLevelStorage } from "@/lib/storage/levels/memoryLevelStorage";
import { supabaseLevelStorage } from "@/lib/storage/levels/supabaseLevelStorage";

import type { LevelStorage } from "@/lib/storage/levels/levelStorage";

async function getLevelStorage(): Promise<LevelStorage> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user
    ? supabaseLevelStorage
    : memoryLevelStorage;
}

export async function getLevelProgress() {
  const storage = await getLevelStorage();
  return storage.getLevelProgress();
}

export async function applyTrainerResult(
  isCorrect: boolean
) {
  const storage = await getLevelStorage();
  return storage.applyTrainerResult(isCorrect);
}
