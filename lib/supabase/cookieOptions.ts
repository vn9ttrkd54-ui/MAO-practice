// Browser Auth needs to read its own tokens; HttpOnly would break that flow.
// OAuth redirects require Lax rather than Strict. HTTPS is mandatory in prod.
export const authCookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
