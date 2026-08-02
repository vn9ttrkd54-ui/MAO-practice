import { createClient } from "@/lib/supabase/client";
import { memoryLevelStorage } from "@/lib/storage/levels/memoryLevelStorage";
import { supabaseLevelStorage } from "@/lib/storage/levels/supabaseLevelStorage";

import type { LevelStorage } from "@/lib/storage/levels/levelStorage";

async function getLevelStorage(): Promise<LevelStorage> {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Unable to read authentication session: ${error.message}`);
  }

  return session?.user
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
