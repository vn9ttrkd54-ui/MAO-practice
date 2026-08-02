import { createClient } from "@/lib/supabase/client";
import { memoryBookmarkStorage } from "@/lib/storage/bookmarks/memoryBookmarkStorage";
import { createSupabaseBookmarkStorage } from "@/lib/storage/bookmarks/supabaseBookmarkStorage";

async function getStorage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return memoryBookmarkStorage;
  }

  return createSupabaseBookmarkStorage(user.id);
}

export async function isQuestionBookmarked(
  questionId: number
): Promise<boolean> {
  const storage = await getStorage();
  return storage.isBookmarked(questionId);
}

export async function toggleQuestionBookmark(
  questionId: number
): Promise<boolean> {
  const storage = await getStorage();
  return storage.toggle(questionId);
}
