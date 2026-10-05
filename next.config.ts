import type { NextConfig } from "next";

const scriptSources = process.env.NODE_ENV === "development"
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

// Allow only this project's Auth/Realtime endpoint, not every Supabase tenant.
const connectSources = ["'self'"];
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const endpoint = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const localDevelopment = process.env.NODE_ENV === "development"
    && ["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname);
  if (endpoint.username || endpoint.password
    || (endpoint.protocol !== "https:" && !(localDevelopment && endpoint.protocol === "http:"))) {
    throw new Error("Supabase must use HTTPS outside local development.");
  }
  connectSources.push(endpoint.origin, endpoint.origin.replace(/^http/, "ws"));
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; ${scriptSources}; connect-src ${connectSources.join(" ")}; upgrade-insecure-requests`,
          },
        ],
      },
      ...["/auth/:path*", "/forgot-password", "/reset-password", "/account", "/admin/:path*",
        "/api/auth/:path*", "/api/account", "/api/admin/:path*"].map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      })),
    ];
  },
};

export default nextConfig;
