import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type GoogleMode = "signin" | "link" | "verify-delete";
export type GoogleIntent = { mode: GoogleMode; userId: string | null; nonce: string; expiresAt: number };
export const GOOGLE_INTENT_COOKIE = "md_google_intent";
export const GOOGLE_DELETE_COOKIE = "md_google_delete";
export const GOOGLE_FLOW_SECONDS = 600;
export const GOOGLE_DELETE_SECONDS = 300;
export const googleCookieOptions = {
  httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/",
};

function signature(payload: string) {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("Server authentication is not configured.");
  return createHmac("sha256", key).update(`google-intent:${payload}`).digest("hex");
}

export function createGoogleIntent(mode: GoogleMode, userId: string | null) {
  const intent: GoogleIntent = { mode, userId, nonce: randomBytes(24).toString("hex"), expiresAt: Date.now() + GOOGLE_FLOW_SECONDS * 1000 };
  const payload = Buffer.from(JSON.stringify(intent)).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readGoogleIntent(value: string | undefined): GoogleIntent | null {
  if (!value || value.length > 1024) return null;
  const parts = value.split(".");
  const [payload, signed] = parts;
  if (parts.length !== 2 || !payload || !signed || !/^[0-9a-f]{64}$/.test(signed)) return null;
  try {
    if (!timingSafeEqual(Buffer.from(signed, "hex"), Buffer.from(signature(payload), "hex"))) return null;
    const intent = JSON.parse(Buffer.from(payload, "base64url").toString()) as GoogleIntent;
    if (!["signin", "link", "verify-delete"].includes(intent.mode)
      || !/^[0-9a-f]{48}$/.test(intent.nonce)
      || !Number.isSafeInteger(intent.expiresAt) || intent.expiresAt <= Date.now()
      || intent.expiresAt > Date.now() + GOOGLE_FLOW_SECONDS * 1000
      || (intent.mode !== "signin" && typeof intent.userId !== "string")) return null;
    return intent;
  } catch { return null; }
}
