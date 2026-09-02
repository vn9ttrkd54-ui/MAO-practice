import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_MS = 4 * 60 * 60 * 1_000;

function signingSecret() {
  const secret = process.env.TUTOR_REVEAL_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("Tutor reveal signing secret is not configured.");
  return secret;
}

function signature(userId: string, questionId: number, issuedAt: number) {
  return createHmac("sha256", signingSecret())
    .update(`${userId}:${questionId}:${issuedAt}`)
    .digest("base64url");
}

export function createTutorRevealToken(userId: string, questionId: number, now = Date.now()) {
  return `${now}.${signature(userId, questionId, now)}`;
}

export function verifyTutorRevealToken(token: string, userId: string, questionId: number, now = Date.now()) {
  const [issuedAtText, suppliedSignature, extra] = token.split(".");
  const issuedAt = Number(issuedAtText);
  if (extra || !Number.isSafeInteger(issuedAt) || !suppliedSignature) return false;
  if (issuedAt > now || now - issuedAt > TOKEN_LIFETIME_MS) return false;

  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(signature(userId, questionId, issuedAt));
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
