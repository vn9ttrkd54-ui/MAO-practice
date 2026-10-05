import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { withRequestTimeout } from "@/lib/requestTimeout";

const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
const accepted = () => Response.json({ success: true,
  message: "If this email is linked to an account, you’ll receive a password-reset link. Check your inbox and spam folder." }, { headers });

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) return Response.json({ error: "Invalid request origin." }, { status: 403, headers });
  let email: string;
  try {
    const body = await readJsonBody<{ email?: unknown }>(request, 2048);
    if (typeof body.email !== "string" || body.email.length > 254
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
      || body.email.trim().toLowerCase().endsWith("@users.mao-practice.local")) {
      return Response.json({ error: "Enter your personal recovery email address." }, { status: 400, headers });
    }
    email = body.email.trim().toLowerCase();
  } catch (error) {
    return Response.json({ error: "Invalid request." }, { status: error instanceof RequestBodyError ? error.status : 400, headers });
  }
  const started = Date.now();
  try {
    return await withRequestTimeout(async signal => {
      const secret = process.env.SUPABASE_SECRET_KEY;
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!secret || !url || !key) throw new Error("Recovery configuration unavailable");
      const admin = createAdminClient();
      // Vercel overwrites x-real-ip. Other hosting must supply a trusted proxy
      // header; missing addresses share a conservative bucket, never a random ID.
      const ip = request.headers.get("x-real-ip") ?? "unknown";
      const consume = async (scope: string, value: string, limit: number, seconds: number) => {
        const identifier = createHmac("sha256", secret).update(`forgot-password:${scope}:${value}`).digest("hex");
        const { data, error } = await admin.rpc("consume_login_attempt", {
          attempt_identifier: identifier, max_attempts: limit, window_seconds: seconds, block_seconds: seconds,
        }).abortSignal(signal);
        if (error || typeof data !== "boolean") throw new Error("Recovery limiter unavailable");
        return data;
      };
      if (!await consume("ip", ip, 10, 900)) {
        return Response.json({ error: "Too many requests. Please try again in 15 minutes." },
          { status: 429, headers: { ...headers, "Retry-After": "900" } });
      }
      // Silence address-specific throttles to avoid exposing another user's activity.
      const allowed = await consume("email-minute", email, 1, 60)
        && await consume("email-hour", email, 3, 3600);
      if (allowed) {
        signal.throwIfAborted();
        // Public Auth recovery sends the email; never generate an admin link or
        // return a token here. No session/cookie mutation or account lookup.
        const endpoint = new URL("/auth/v1/recover", url);
        endpoint.searchParams.set("redirect_to", "https://www.mathematicsdaily.com/auth/confirm");
        const response = await fetch(endpoint, { method: "POST", signal, redirect: "error",
          headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
        await response.body?.cancel();
        if (response.status >= 500 || response.status === 401 || response.status === 403) {
          throw new Error("Email service unavailable");
        }
        // Unknown addresses, provider throttles and account-specific rejections
        // get the same response. A successful response is not proof of delivery.
      }
      // Reduce quick-return timing differences; this is not a constant-time claim.
      await new Promise(resolve => setTimeout(resolve, Math.max(0, 600 - (Date.now() - started))));
      signal.throwIfAborted();
      return accepted();
    }, { signal: request.signal, timeoutMs: 10_000 });
  } catch {
    return Response.json({ error: "Recovery is temporarily unavailable. Please try again later." }, { status: 503, headers });
  }
}
