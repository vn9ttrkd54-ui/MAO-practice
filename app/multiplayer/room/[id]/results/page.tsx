import { notFound, redirect } from "next/navigation";

import MatchResults from "@/components/multiplayer/MatchResults";
import { getMultiplayerMatchResult, getMultiplayerRoom } from "@/lib/services/multiplayerService";

interface ResultsPageProps { params: Promise<{ id: string }> }

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const access = await getMultiplayerRoom(id);
  if (!access) notFound();
  if (access.room.status !== "completed") redirect(`/multiplayer/room/${id}/play`);
  const result = await getMultiplayerMatchResult(id);
  if (!result) notFound();
  return <MatchResults result={result} />;
}
