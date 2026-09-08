export function analyticsUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (/^\/(admin|account|auth|reset-password|api)(\/|$)/.test(url.pathname)) return null;
    url.search = "";
    url.hash = "";
    url.pathname = url.pathname.replace(/^(\/multiplayer\/room)\/[^/]+/, "$1/[id]");
    return url.toString();
  } catch {
    return null;
  }
}
