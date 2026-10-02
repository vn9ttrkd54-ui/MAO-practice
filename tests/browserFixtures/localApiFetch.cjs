// Test process preload only. Even build-time-inlined provider URLs cannot escape.
if (process.env.MAO_LOCAL_API_FIXTURE !== "1") throw new Error("Local API fixture must be explicitly enabled.");
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  const method = init?.method ?? (input instanceof Request ? input.method : "GET");
  if (url.pathname.endsWith("/rest/v1/multiplayer_rooms") && method === "GET") {
    // Exercise the real public-directory handler without a database connection.
    return Response.json([]);
  }
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) {
    throw new Error("External fetch blocked by local API fixture.");
  }
  return originalFetch(input, init);
};
