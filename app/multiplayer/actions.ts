perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
	LC_ALL = "C.UTF-8",
	LC_CTYPE = "C.UTF-8",
	LANG = "C.UTF-8"
    are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
"use server";

import { redirect } from "next/navigation";

import { createPrivateRoom, joinPrivateRoom } from "@/lib/services/multiplayerService";
import type { Division } from "@/types/question";
import type { MultiplayerQuestionTime, MultiplayerRoomMode } from "@/types/multiplayer";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function errorRedirect(error: unknown): never {
  const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
  redirect(`/multiplayer?error=${encodeURIComponent(message)}`);
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
    errorRedirect(error);
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
