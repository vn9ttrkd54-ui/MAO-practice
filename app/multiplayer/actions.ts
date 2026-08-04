"use server";

import { redirect } from "next/navigation";

import { beginPrivateRoom, createPrivateRoom, joinPrivateRoom, joinPublicRoom, leaveMultiplayerRoom, spectatePublicMatch } from "@/lib/services/multiplayerService";
import type { Division } from "@/types/question";
import type { MultiplayerQuestionTime, MultiplayerRoomMode } from "@/types/multiplayer";

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
      guestNickname: value(formData, "guestNickname"),
      settings: {
        division: value(formData, "division") as Division,
        questionCount: Number(value(formData, "questionCount")),
        secondsPerQuestion: Number(value(formData, "secondsPerQuestion")) as MultiplayerQuestionTime,
        mode: value(formData, "mode") as MultiplayerRoomMode,
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
  try {
    const room = await joinPrivateRoom({
      code: value(formData, "code"),
      guestNickname: value(formData, "guestNickname"),
    });
    roomId = room.id;
  } catch (error) {
    errorRedirect(error);
  }
  redirect(`/multiplayer/room/${roomId}`);
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
  try { await leaveMultiplayerRoom(roomId); } catch (error) { errorRedirect(error, `/multiplayer/room/${roomId}`); }
  redirect("/multiplayer");
}
