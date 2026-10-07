import type { MultiplayerPublicRoom, MultiplayerRankTier } from "@/types/multiplayer";
const params = () => new URLSearchParams(location.search);
export const rooms: MultiplayerPublicRoom[] = (["Mu", "Alpha", "Theta"] as const).flatMap((division, index) => [5, 15, 30].map(count => ({
  id: `${division}-${count}`, code: null, visibility: "public", status: "waiting", settings: { division, questionCount: count, secondsPerQuestion: 90, mode: "ranked", difficultyBand: "2-4" },
  playerCount: count === 5 ? 1 : 0, spectatorCount: 0, capacity: 20, hostPlayerId: null, countdownEndsAt: null, createdAt: Date.now(), startedAt: null, stateVersion: 1, settingsVersion: 0, currentQuestionNumber: 0,
  players: count === 5 ? [{ playerId: `player-${index}`, displayName: "Fixture player", rankTier: "Silver" }] : [],
})));
export async function listPublicRooms() { return rooms; }
export async function listOngoingPublicMatches() { return []; }
export async function listMyActiveMultiplayerRooms() { return []; }
export async function listRecentMultiplayerMatches() { return []; }
export async function getMultiplayerProfile() {
  if (params().has("guest")) return null;
  const ranks = ["Novice", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Legend"];
  const rank = params().get("rank") ?? "Silver";
  return { username: "ricefarmer", globalRank: 2, rankTier: rank, rp: [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200][ranks.indexOf(rank)] + 23 };
}
export async function getMultiplayerRatingLeaderboard() {
  return [{ userId: "gold", username: "st2048", globalRank: 1, rankTier: "Gold", rp: 452 }, { userId: "silver", username: "ricefarmer", globalRank: 2, rankTier: "Silver", rp: 273 }, { userId: "novice", username: "mathematicsdaily", globalRank: 3, rankTier: "Novice", rp: 59 }];
}
const router = { refresh() {} };
export function useRouter() { return router; }
export function unstable_rethrow() {}
export function createClient() {
  const channel = { on() { return channel; }, subscribe() { return channel; } };
  return { auth: { getUser: async () => ({ data: { user: params().has("guest") ? null : { id: "fixture" } } }) }, channel: () => channel, removeChannel: async () => {} };
}
export async function joinPublicRoomAction(data: FormData) { document.body.dataset.joined = String(data.get("roomId")); }
export async function joinPrivateRoomAction(data: FormData) { document.body.dataset.code = String(data.get("code")); }
export async function closePrivateLobbyAction() {}
export async function spectatePublicRoomAction() {}
export const fixtureRanks: MultiplayerRankTier[] = ["Novice", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Legend"];
