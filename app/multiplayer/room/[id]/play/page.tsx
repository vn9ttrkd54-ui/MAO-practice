import { notFound, redirect } from "next/navigation";

import MatchQuestion from "@/components/multiplayer/MatchQuestion";
import { getMultiplayerRoom, getMultiplayerRoundState } from "@/lib/services/multiplayerService";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const access = await getMultiplayerRoom(id);
  if (!access) notFound();
  if (access.room.status === "waiting") redirect(`/multiplayer/room/${id}`);

  const round = await getMultiplayerRoundState(id);
  if (!round) notFound();
  return <MatchQuestion round={round} />;
}
