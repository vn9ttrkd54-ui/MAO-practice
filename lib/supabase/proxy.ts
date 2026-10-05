import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authCookieOptions } from "./cookieOptions";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: authCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) =>
              request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) =>
              response.cookies.set(
                name,
                value,
                options
              )
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const path = request.nextUrl.pathname;
  const allowedDuringSetup = ["/", "/login", "/signup", "/auth/setup", "/auth/callback", "/api/auth/setup", "/api/auth/google", "/privacy", "/terms"];
  const metadata = data?.claims.app_metadata;
  let needsSetup = metadata?.needs_username === true;
  // Consult Auth only during setup or the first-token window. Completed
  // accounts keep the existing lightweight claims-only refresh path.
  if (needsSetup || (metadata?.provider === "google" && metadata.needs_username === undefined)) {
    const { data: account } = await supabase.auth.getUser();
    needsSetup = account.user?.app_metadata.needs_username !== false;
    if (!needsSetup && metadata?.needs_username !== false) {
      const refreshed = await supabase.auth.refreshSession();
      if (refreshed.error) {
        await supabase.auth.signOut({ scope: "local" });
        const retry = path.startsWith("/api/")
          ? NextResponse.json({ error: "Sign in again to continue." }, { status: 401 })
          : NextResponse.redirect(new URL("/login", request.url));
        for (const cookie of response.cookies.getAll()) retry.cookies.set(cookie);
        return retry;
      }
    }
  }
  if (needsSetup
    && !allowedDuringSetup.includes(path) && !path.startsWith("/_next/")) {
    const blocked = path.startsWith("/api/")
      ? NextResponse.json({ error: "Choose your username and complete account setup first." }, { status: 403 })
      : NextResponse.redirect(new URL("/auth/setup", request.url));
    for (const cookie of response.cookies.getAll()) blocked.cookies.set(cookie);
    return blocked;
  }

  return response;
}
