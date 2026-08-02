import { createClient } from "@/lib/supabase/client";

import type { BookmarkStorage } from "@/lib/storage/bookmarks/bookmarkStorage";

export function createSupabaseBookmarkStorage(
  userId: string
): BookmarkStorage {
  const supabase = createClient();

  return {
    async isBookmarked(questionId) {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("question_id")
        .eq("user_id", userId)
        .eq("question_id", questionId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return Boolean(data);
    },

    async toggle(questionId) {
      const { data: existing, error: readError } = await supabase
        .from("bookmarks")
        .select("question_id")
        .eq("user_id", userId)
        .eq("question_id", questionId)
        .maybeSingle();

      if (readError) {
        throw readError;
      }

      if (existing) {
        const { error: deleteError } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("question_id", questionId);

        if (deleteError) {
          throw deleteError;
        }

        return false;
      }

      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          user_id: userId,
          question_id: questionId,
        });

      if (insertError) {
        throw insertError;
      }

      return true;
    },
  };
}
