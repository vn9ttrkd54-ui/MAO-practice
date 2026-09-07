import { notFound, redirect } from "next/navigation";

import MatchResults from "@/components/multiplayer/MatchResults";
import PodiumReveal from "@/components/multiplayer/PodiumReveal";
import ResultsPending from "@/components/multiplayer/ResultsPending";
import { getMultiplayerMatchResult, getMultiplayerRoom } from "@/lib/services/multiplayerService";

interface ResultsPageProps { params: Promise<{ id: string }> }

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const result = await getMultiplayerMatchResult(id).catch(() => null);
  if (result) return <PodiumReveal key={id} players={result.finalLeaderboard}><MatchResults result={result} /></PodiumReveal>;
  const access = await getMultiplayerRoom(id);
  if (!access) notFound();
  if (access.room.status !== "completed") redirect(`/multiplayer/room/${id}/play`);
  return <ResultsPending roomId={id} />;
}
