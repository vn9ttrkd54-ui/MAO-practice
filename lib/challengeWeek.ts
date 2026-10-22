/** Monday–Sunday calendar keys. Input is already a New York date; UTC arithmetic avoids DST shifts. */
export function getChallengeWeekDates(today: string): string[] {
  const monday = new Date(`${today}T00:00:00.000Z`);
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setUTCDate(day.getUTCDate() + index);
    return day.toISOString().slice(0, 10);
  });
}
