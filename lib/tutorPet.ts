export type TutorPetState = "idle" | "thinking" | "ready" | "sleeping" | "error";

export function tutorPetState({ loading, remaining, errorCode, hasError, hasAnswer }: {
  loading: boolean;
  remaining: number | null;
  errorCode: string | null;
  hasError: boolean;
  hasAnswer: boolean;
}): TutorPetState {
  if (loading) return "thinking";
  if (remaining === 0 || errorCode === "daily_limit" || errorCode === "pool_exhausted") return "sleeping";
  if (hasError) return "error";
  return hasAnswer ? "ready" : "idle";
}
