import { notFound, redirect } from "next/navigation";

import MatchQuestion from "@/components/multiplayer/MatchQuestion";
import { getMultiplayerRoom, getMultiplayerRoundState } from "@/lib/services/multiplayerService";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const round = await getMultiplayerRoundState(id);
  if (round && "completed" in round) redirect(`/multiplayer/room/${id}/results`);
  if (!round) {
    const access = await getMultiplayerRoom(id);
    if (!access) notFound();
    if (access.room.status === "waiting" || access.room.status === "countdown") redirect(`/multiplayer/room/${id}`);
    notFound();
  }
  return <MatchQuestion round={round} />;
}
