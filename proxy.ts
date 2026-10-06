import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  // This one endpoint is deliberately public and shared. Refreshing account
  // cookies here would add auth work and undermine safe CDN caching.
  if (request.nextUrl.pathname === "/api/multiplayer/public-rooms" &&
    (request.method === "GET" || request.method === "HEAD")) return NextResponse.next();
  // This read-only endpoint verifies the user itself with a bounded, abortable
  // auth request. Avoid a duplicate, unbounded refresh before its deadline starts.
  // It also enforces account setup and returns only the user's RLS-protected state.
  if (request.nextUrl.pathname === "/api/practice/question-bank/state" &&
    (request.method === "GET" || request.method === "HEAD")) return NextResponse.next();
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
