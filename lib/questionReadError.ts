/** Safe support reference; never display raw database messages, SQL or tokens. */
export function questionReadError(scope: "PROGRESS" | "BOOKMARKS" | "DETAIL", error: unknown): Error {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  const reason = code === "42501" ? "PERMISSION" : code === "PGRST202" || code === "42703" || code === "42P01" ? "SCHEMA"
    : code === "PGRST301" || code === "PGRST303" ? "AUTH" : "REQUEST";
  const label = scope === "DETAIL" ? "question statistics and bookmark" : scope === "BOOKMARKS" ? "bookmarks" : "saved progress";
  return new Error(`Unable to load your ${label}. Please retry. Reference: QB-${scope}-${reason}.`);
}
