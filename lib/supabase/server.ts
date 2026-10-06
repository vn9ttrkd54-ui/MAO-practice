import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authCookieOptions } from "./cookieOptions";

export async function createClient(signal?: AbortSignal) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: authCookieOptions,
      ...(signal ? { global: { fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, {
        ...init, signal: init?.signal ? AbortSignal.any([signal, init.signal]) : signal,
      }) } } : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) =>
                cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components cannot write cookies.
            // The root proxy refreshes and persists auth cookies.
          }
        },
      },
    }
  );
}
