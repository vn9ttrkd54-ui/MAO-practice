import { createClient } from "@/lib/supabase/client";
import {
  calculateLevelChange,
  createDefaultLevel,
} from "@/lib/storage/levels/levelStorage";

import type { LevelStorage } from "@/lib/storage/levels/levelStorage";
import type { LevelProgress } from "@/types/level";

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Unable to read authentication session: ${error.message}`);
  }

  if (!session?.user) {
    throw new Error("A signed-in user is required.");
  }

  return session.user.id;
}

export const supabaseLevelStorage: LevelStorage = {
  async getLevelProgress() {
    const supabase = createClient();
    const userId = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("user_levels")
      .select("level, progress")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      const initial = createDefaultLevel();
      const { error: insertError } = await supabase
        .from("user_levels")
        .insert({
          user_id: userId,
          level: initial.level,
          progress: initial.progress,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      return initial;
    }

    return {
      level: data.level,
      progress: data.progress,
    } satisfies LevelProgress;
  },

  async applyTrainerResult(isCorrect) {
    const supabase = createClient();
    const userId = await getAuthenticatedUserId();
    const current = await this.getLevelProgress();
    const change = calculateLevelChange(current, isCorrect);

    const { error } = await supabase
      .from("user_levels")
      .update({
        level: change.level,
        progress: change.progress,
      })
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return change;
  },
};
