import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { KeyRound, Plus, Trophy, ArrowUpRight } from "lucide-react";
import styles from "./lobby.module.css";

import { spectatePublicRoomAction } from "@/app/multiplayer/actions";
import PublicRoomList from "@/components/multiplayer/PublicRoomList";
import PrivateRoomRecovery from "@/components/multiplayer/PrivateRoomRecovery";
import RatingHelp from "@/components/multiplayer/RatingHelp";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import { RankIcon, rankPageClass, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import { getMultiplayerProfile, getMultiplayerRatingLeaderboard, listMyActiveMultiplayerRooms, listOngoingPublicMatches, listPublicRooms, listRecentMultiplayerMatches } from "@/lib/services/multiplayerService";
import { createClient } from "@/lib/supabase/server";

interface MultiplayerPageProps { searchParams: Promise<{ error?: string }>; }

const rankSteps = [{ name: "Novice", rp: 0 }, { name: "Bronze", rp: 100 }, { name: "Silver", rp: 250 }, { name: "Gold", rp: 450 }, { name: "Platinum", rp: 700 }, { name: "Diamond", rp: 1000 }, { name: "Master", rp: 1350 }, { name: "Grandmaster", rp: 1750 }, { name: "Legend", rp: 2200 }];

async function retryFutureJwt<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!(error instanceof Error) || !error.message.toLowerCase().includes("jwt issued at future")) throw error;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return operation();
  }
}

interface MultiplayerLoadResult<T> {
  data: T;
  failed: boolean;
}

async function loadMultiplayerData<T>(operation: () => Promise<T>, fallback: T): Promise<MultiplayerLoadResult<T>> {
  try {
    return { data: await retryFutureJwt(operation), failed: false };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Multiplayer data refresh failed", error);
    return { data: fallback, failed: true };
  }
}

export default async function MultiplayerPage({ searchParams }: MultiplayerPageProps) {
  const [{ error }, supabase, publicRoomsResult, ongoingMatchesResult, activeRoomsResult, profileResult, ratingLeaderboardResult, recentMatchesResult] = await Promise.all([
    searchParams,
    createClient(),
    loadMultiplayerData(listPublicRooms, []),
    loadMultiplayerData(listOngoingPublicMatches, []),
    loadMultiplayerData(listMyActiveMultiplayerRooms, []),
    loadMultiplayerData(getMultiplayerProfile, null),
    loadMultiplayerData(getMultiplayerRatingLeaderboard, []),
    loadMultiplayerData(listRecentMultiplayerMatches, []),
  ]);
  const publicRooms = publicRoomsResult.data;
  const ongoingMatches = ongoingMatchesResult.data;
  const activeRooms = activeRoomsResult.data;
  const profile = profileResult.data;
  const ratingLeaderboard = ratingLeaderboardResult.data;
  const recentMatches = recentMatchesResult.data;
  const { data: { user } } = await supabase.auth.getUser();
  const activeInProgress = activeRooms.filter((room) => room.status === "in-progress");
  const activeRoomIds = new Set(activeInProgress.map((room) => room.id));
  const combinedOngoingMatches = [...new Map([...ongoingMatches, ...activeInProgress].map((room) => [room.id, room])).values()];
  const rankIndex = profile ? rankSteps.findIndex((rank) => rank.name === profile.rankTier) : -1;
  const nextRank = rankIndex >= 0 ? rankSteps[rankIndex + 1] : undefined;
  const currentRankRp = rankIndex >= 0 ? rankSteps[rankIndex].rp : 0;
  const progress = profile ? nextRank ? Math.min(100, Math.round((profile.rp - currentRankRp) / (nextRank.rp - currentRankRp) * 100)) : 100 : 0;

  return <div className={rankPageClass(profile?.rankTier ?? "Novice")}><main className={styles.lobby}>
    <header className={styles.header}><div><p className={styles.eyebrow}>Multiplayer</p><h1 className={styles.title}>Match Lobby</h1></div><p className={styles.subtitle}>Enter a code to join, or create a room with your own settings.</p></header>
    {error ? <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
    {activeRoomsResult.failed ? <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Unable to check your existing rooms. Refresh before creating another room.</p> : <PrivateRoomRecovery rooms={activeRooms} />}
    {profile ? <div className={styles.ratingPanel}><RatingHelp /><section aria-label="Your multiplayer rating" className={`${styles.rankBanner} ${rankThemeClass(profile.rankTier)}`}><div className={styles.rankIdentity}><p className="font-bold">{profile.username}</p><p className={`${rankSecondaryClass} mt-1 text-xs`}>#{profile.globalRank} globally</p></div><div><p className={styles.rp}>{profile.rp} RP</p><div className={styles.rankLabel}><RankIcon rank={profile.rankTier} size={18} /><span>{profile.rankTier}</span></div></div><div className={styles.rankProgress}><div className={styles.progressTrack} role="progressbar" aria-label="Progress to next rank" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${progress}%` }} /></div><p className={`${rankSecondaryClass} mt-2 text-xs font-medium`}>{nextRank ? `${nextRank.rp - profile.rp} RP to ${nextRank.name} · ${progress}%` : "Highest rank reached"}</p></div></section></div> : <section className={`${styles.actionCard} ${styles.guestRating}`}><h2 className="font-bold">Your multiplayer rating</h2><p className="mt-2 text-sm text-gray-600">Sign in to earn RP and climb the leaderboard.</p><Link href="/login" className="mt-4 inline-flex text-sm font-semibold text-blue-600">Sign in</Link></section>}
    <div className={styles.actions}>
      <section className={`${styles.actionCard} rounded-2xl border bg-white p-5 shadow-sm`}><div className={styles.cardHeading}><span className={styles.iconTile}><KeyRound size={20} aria-hidden="true" /></span><h2 className="text-lg font-bold">Join private room</h2></div><p className="mt-2 text-sm leading-5 text-gray-600">Have a room code? Join your friends with your account or a guest nickname.</p><Link href="/multiplayer/join" className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Join private room<ArrowUpRight className="ml-2" size={17} aria-hidden="true" /></Link></section>
      <section className={`${styles.actionCard} ${styles.createCard} rounded-2xl border bg-white p-5 shadow-sm`}><div className={styles.cardHeading}><span className={styles.iconTile}><Plus size={22} aria-hidden="true" /></span><h2 className="text-lg font-bold">Create a room</h2></div><p className="mt-2 text-sm leading-5 text-gray-600">Choose your division, question count, timer, and rating mode.</p><Link href="/multiplayer/create" className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Create Room<ArrowUpRight className="ml-2" size={17} aria-hidden="true" /></Link></section>
    </div>

    <div className={styles.publicLayout}>
      <PublicRoomList initialRooms={publicRooms} signedIn={!!user} />
      <aside className={`${styles.leaderboard} rounded-2xl border bg-white p-4 shadow-sm`}><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Trophy size={18} className="text-blue-600" aria-hidden="true" />RP leaderboard</h2><span className="text-xs text-gray-500">Top 10</span></div>{ratingLeaderboard.length ? <ol className="mt-3 space-y-2">{ratingLeaderboard.map((entry) => <li key={entry.userId} className={`${rankThemeClass(entry.rankTier)} flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-sm`}><div className="min-w-0"><p className="truncate font-semibold">#{entry.globalRank} {entry.username}</p><div className={`${rankSecondaryClass} mt-1 flex items-center gap-1.5 text-xs`}><RankIcon rank={entry.rankTier} size={13} /><span>{entry.rankTier}</span></div></div><span className="shrink-0 font-bold tabular-nums">{entry.rp} RP</span></li>)}</ol> : <p className="mt-3 text-sm text-gray-500">No ranked players yet.</p>}</aside>
    </div>

    {combinedOngoingMatches.length ? <section className="mt-8"><div><h2 className="text-xl font-bold">Ongoing games</h2><p className="mt-1 text-sm text-gray-600">Matches currently in progress</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{combinedOngoingMatches.map((room) => { const canRejoin = activeRoomIds.has(room.id); return <article key={room.id} className="rounded-2xl border bg-gray-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{room.settings.division} · {room.settings.questionCount}</p><p className="mt-1 text-sm text-gray-600">{room.visibility === "private" ? `Private · ${room.code}` : "Public"} · {room.playerCount} players</p></div><span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">Live</span></div>{canRejoin ? <Link href={`/multiplayer/room/${room.id}/play`} className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Rejoin Game</Link> : user ? <form action={spectatePublicRoomAction} className="mt-3"><input type="hidden" name="roomId" value={room.id} /><PendingSubmitButton pendingText="Opening game…" className="w-full rounded-lg border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700">Spectate</PendingSubmitButton></form> : <Link href="/login" className="mt-3 flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold">Sign in to spectate</Link>}</article>; })}</div></section> : null}
    {recentMatches.length ? <section className="mt-8 pb-8"><div><h2 className="text-xl font-bold">Recent matches</h2><p className="mt-1 text-sm text-gray-600">Your latest completed multiplayer games</p></div><div className="mt-4 space-y-3">{recentMatches.map((match) => <article key={match.roomId} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border bg-white/90 p-4 shadow-sm sm:grid-cols-[4rem_1fr_auto] sm:gap-4 [&>span]:col-span-2 [&>span]:justify-self-start sm:[&>span]:col-span-1 sm:[&>span]:justify-self-auto"><div className="text-center"><p className="text-2xl font-bold">#{match.placement}</p><p className="text-xs text-gray-500">Place</p></div><div><p className="font-bold">{match.division} · {match.questionCount} questions</p><p className="mt-1 text-sm text-gray-600">{match.score} points · {match.ranked ? "Ranked" : "Unranked"} · {new Date(match.completedAt).toLocaleDateString()}</p></div><span className={`rounded-full px-3 py-1 text-sm font-bold ${match.rpChange === null ? "bg-gray-100 text-gray-600" : match.rpChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{match.rpChange === null ? "No RP" : `${match.rpChange >= 0 ? "+" : ""}${match.rpChange} RP`}</span></article>)}</div></section> : null}
  </main></div>;
}
