import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountRestriction } from "@/lib/auth/accountAccess";
import { authCookieOptions } from "./cookieOptions";

export async function createClient(signal?: AbortSignal, options: { allowRestricted?: boolean } = {}) {
  const cookieStore = await cookies();

  const client = createServerClient(
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
  // Reuse the authoritative Auth lookup already made by server actions and
  // routes. No extra database or authentication round trip on multiplayer polls.
  if (!options.allowRestricted) {
    const getUser = client.auth.getUser.bind(client.auth);
    client.auth.getUser = async (...args: Parameters<typeof getUser>) => {
      const result = await getUser(...args);
      if (accountRestriction(result.data.user)) redirect("/auth/resolve");
      return result;
    };
  }
  return client;
}
