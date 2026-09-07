export const PODIUM_PLACEMENT_MS = 2500;

export function podiumPlayers<T extends { placement: number | null }>(players: readonly T[]): T[] {
  const places = players.length < 5 ? [1] : [3, 2, 1];
  return places.flatMap(place => players.filter(player => player.placement === place));
}
