import { parseCookieHeader, stringFromBase64URL } from "@supabase/ssr";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A UI race guard, NOT authentication. The API must independently verify the user.
 * Reading this hint does not wait for Auth initialization or a token refresh.
 * Malformed/partial cookies must never turn a signed-in read into guest progress.
 */
export function browserOwnerHint(): string | null {
  try {
    const project = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0];
    const key = `sb-${project}-auth-token`;
    const cookies = new Map(parseCookieHeader(document.cookie).map(cookie => [cookie.name, cookie.value]));
    const chunks = [...cookies.keys()].filter(name => name.startsWith(`${key}.`));
    let value = cookies.get(key);
    if (!value && chunks.length) {
      value = "";
      for (let index = 0; index < chunks.length; index++) {
        const chunk = cookies.get(`${key}.${index}`);
        if (!chunk) throw new Error();
        value += chunk;
      }
    }
    if (!value) {
      if (cookies.has(key) || chunks.length) throw new Error();
      return null;
    }
    const session = JSON.parse(value.startsWith("base64-") ? stringFromBase64URL(value.slice(7)) : value);
    const claims = JSON.parse(stringFromBase64URL(session.access_token.split(".")[1]));
    if (typeof claims.sub !== "string" || !uuid.test(claims.sub)) throw new Error();
    return claims.sub;
  } catch {
    throw new Error("Your account could not be confirmed. Reload before continuing.");
  }
}
