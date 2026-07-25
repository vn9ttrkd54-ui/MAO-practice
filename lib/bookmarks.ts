const BOOKMARK_STORAGE_KEY =
  "bookmarked-question-ids";

function getStoredBookmarkIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedData = localStorage.getItem(
    BOOKMARK_STORAGE_KEY
  );

  if (!storedData) {
    return [];
  }

  try {
    const parsedData = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return Array.from(
      new Set(
        parsedData.filter(
          (id): id is number =>
            typeof id === "number"
        )
      )
    );
  } catch {
    return [];
  }
}

function saveBookmarkIds(ids: number[]): void {
  localStorage.setItem(
    BOOKMARK_STORAGE_KEY,
    JSON.stringify(ids)
  );
}

export function getBookmarkedQuestionIds(): number[] {
  return getStoredBookmarkIds();
}

export function isQuestionBookmarked(
  questionId: number
): boolean {
  return getStoredBookmarkIds().includes(
    questionId
  );
}

export function setQuestionBookmark(
  questionId: number,
  bookmarked: boolean
): boolean {
  const currentIds = getStoredBookmarkIds();

  const updatedIds = bookmarked
    ? Array.from(
        new Set([...currentIds, questionId])
      )
    : currentIds.filter(
        (id) => id !== questionId
      );

  saveBookmarkIds(updatedIds);

  return bookmarked;
}

export function toggleQuestionBookmark(
  questionId: number
): boolean {
  const currentlyBookmarked =
    isQuestionBookmarked(questionId);

  return setQuestionBookmark(
    questionId,
    !currentlyBookmarked
  );
}