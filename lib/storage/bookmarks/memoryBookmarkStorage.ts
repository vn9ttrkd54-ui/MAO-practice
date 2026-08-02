import type { BookmarkStorage } from "@/lib/storage/bookmarks/bookmarkStorage";

const bookmarkedQuestionIds = new Set<number>();

export function getMemoryBookmarkIds(): number[] {
  return Array.from(bookmarkedQuestionIds);
}

export const memoryBookmarkStorage: BookmarkStorage = {
  async isBookmarked(questionId) {
    return bookmarkedQuestionIds.has(questionId);
  },

  async toggle(questionId) {
    if (bookmarkedQuestionIds.has(questionId)) {
      bookmarkedQuestionIds.delete(questionId);
      return false;
    }

    bookmarkedQuestionIds.add(questionId);
    return true;
  },
};
