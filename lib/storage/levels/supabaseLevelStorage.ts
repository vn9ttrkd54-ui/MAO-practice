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
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("A signed-in user is required.");
  }

  return user.id;
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
      throw error;
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
        throw insertError;
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
      throw error;
    }

    return change;
  },
};
