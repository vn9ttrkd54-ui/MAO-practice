import { notFound, redirect } from "next/navigation";

import MatchResults from "@/components/multiplayer/MatchResults";
import PodiumReveal from "@/components/multiplayer/PodiumReveal";
import ResultDeliveryReceipt from "@/components/multiplayer/ResultDeliveryReceipt";
import ResultsPending from "@/components/multiplayer/ResultsPending";
import { getMultiplayerMatchResult, getMultiplayerRoom, hasAcknowledgedMultiplayerResult } from "@/lib/services/multiplayerService";

interface ResultsPageProps { params: Promise<{ id: string }> }

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const result = await getMultiplayerMatchResult(id).catch(() => null);
  if (result) return <PodiumReveal key={id} players={result.finalLeaderboard}><ResultDeliveryReceipt roomId={id} enabled={result.viewerMode === "player"} /><MatchResults result={result} /></PodiumReveal>;
  if (await hasAcknowledgedMultiplayerResult(id)) notFound();
  const access = await getMultiplayerRoom(id);
  if (!access) notFound();
  if (access.room.status !== "completed") redirect(`/multiplayer/room/${id}/play`);
  return <ResultsPending roomId={id} />;
}
