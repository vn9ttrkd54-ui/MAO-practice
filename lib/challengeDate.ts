export const CHALLENGE_TIME_ZONE = "America/New_York";

const challengeDateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: CHALLENGE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getChallengeDate(now = new Date()): string {
  const parts = Object.fromEntries(
    challengeDateFormat.formatToParts(now).map(part => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}
