"use server";

import { redirect } from "next/navigation";

import { beginPrivateRoom, createPrivateRoom, joinPrivateRoom, joinPublicRoom, leaveMultiplayerRoom, spectatePublicMatch } from "@/lib/services/multiplayerService";
import type { Division } from "@/types/question";
import type { MultiplayerDifficultyBand, MultiplayerQuestionTime, MultiplayerRoomMode } from "@/types/multiplayer";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function errorRedirect(error: unknown, path = "/multiplayer"): never {
  const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createPrivateRoomAction(formData: FormData) {
  let roomId: string;
  try {
    const room = await createPrivateRoom({
      settings: {
        division: value(formData, "division") as Division,
        questionCount: Number(value(formData, "questionCount")),
        secondsPerQuestion: Number(value(formData, "secondsPerQuestion")) as MultiplayerQuestionTime,
        mode: value(formData, "mode") as MultiplayerRoomMode,
        difficultyBand: value(formData, "difficultyBand") as MultiplayerDifficultyBand,
      },
    });
    roomId = room.id;
  } catch (error) {
    errorRedirect(error, "/multiplayer/create");
  }
  redirect(`/multiplayer/room/${roomId}`);
}

export async function joinPrivateRoomAction(formData: FormData) {
  let roomId: string;
  let destination: "lobby" | "play" | "results" = "lobby";
  try {
    const room = await joinPrivateRoom({
      code: value(formData, "code"),
      guestNickname: value(formData, "guestNickname"),
    });
    roomId = room.id;
    if (room.status === "in-progress") destination = "play";
    if (room.status === "completed") destination = "results";
  } catch (error) {
    errorRedirect(error);
  }
  redirect(`/multiplayer/room/${roomId}${destination === "lobby" ? "" : `/${destination}`}`);
}

export async function startPrivateRoomAction(formData: FormData) {
  const roomId = value(formData, "roomId");
  try {
    await beginPrivateRoom(roomId);
  } catch (error) {
    errorRedirect(error, `/multiplayer/room/${roomId}`);
  }
  redirect(`/multiplayer/room/${roomId}/play`);
}

export async function joinPublicRoomAction(formData: FormData) {
  const roomId = value(formData, "roomId");
  try {
    await joinPublicRoom(roomId);
  } catch (error) {
    errorRedirect(error);
  }
  redirect(`/multiplayer/room/${roomId}`);
}

export async function spectatePublicRoomAction(formData: FormData) {
  const roomId = value(formData, "roomId");
  try { await spectatePublicMatch(roomId); } catch (error) { errorRedirect(error); }
  redirect(`/multiplayer/room/${roomId}/spectate`);
}

export async function leaveMultiplayerRoomAction(formData: FormData) {
  const roomId = value(formData, "roomId");
  const connectionId = value(formData, "connectionId");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(connectionId)) {
    errorRedirect(new Error("Reload the lobby before leaving."), `/multiplayer/room/${roomId}`);
  }
  try { await leaveMultiplayerRoom(roomId, connectionId); } catch (error) { errorRedirect(error, `/multiplayer/room/${roomId}`); }
  redirect("/multiplayer");
}
