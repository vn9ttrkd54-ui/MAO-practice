import type { BookmarkStorage } from "@/lib/storage/bookmarks/bookmarkStorage";

const bookmarkedQuestionIds = new Set<number>();

export function setMemoryQuestionBookmark(questionId: number, bookmarked: boolean) {
  if (bookmarked) bookmarkedQuestionIds.add(questionId);
  else bookmarkedQuestionIds.delete(questionId);
}

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
