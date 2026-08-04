import { notFound } from "next/navigation";

import SpectatorView from "@/components/multiplayer/SpectatorView";
import { spectatePublicMatch } from "@/lib/services/multiplayerService";

interface SpectatePageProps { params: Promise<{ id: string }>; }

export default async function SpectatePage({ params }: SpectatePageProps) {
  const { id } = await params;
  const initialState = await spectatePublicMatch(id).catch(() => null);
  if (!initialState) notFound();
  return <SpectatorView initialState={initialState} />;
}
