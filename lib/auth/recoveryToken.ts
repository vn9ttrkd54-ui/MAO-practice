import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const RECOVERY_LIFETIME_SECONDS = 10 * 60;

function secret() {
  const value = process.env.SUPABASE_SECRET_KEY;
  if (!value) throw new Error("Supabase server environment variables are not configured.");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createRecoveryToken(userId: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + RECOVERY_LIFETIME_SECONDS;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyRecoveryToken(token: string | undefined, userId: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tokenUserId, expiresAtText, suppliedSignature] = parts;
  if (tokenUserId !== userId || !/^\d+$/.test(expiresAtText) || !/^[0-9a-f]{64}$/.test(suppliedSignature)) return false;

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;

  const payload = `${tokenUserId}.${expiresAtText}`;
  const expected = Buffer.from(signature(payload), "hex");
  const supplied = Buffer.from(suppliedSignature, "hex");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
