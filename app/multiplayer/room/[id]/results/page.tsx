import { notFound, redirect } from "next/navigation";

import MatchResults from "@/components/multiplayer/MatchResults";
import { getMultiplayerMatchResult, getMultiplayerRoom } from "@/lib/services/multiplayerService";

interface ResultsPageProps { params: Promise<{ id: string }> }

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const result = await getMultiplayerMatchResult(id);
  if (result) return <MatchResults result={result} />;
  const access = await getMultiplayerRoom(id);
  if (!access) notFound();
  if (access.room.status !== "completed") redirect(`/multiplayer/room/${id}/play`);
  notFound();
}
