export interface BookmarkStorage {
  isBookmarked(questionId: number): Promise<boolean>;
  toggle(questionId: number): Promise<boolean>;
}
