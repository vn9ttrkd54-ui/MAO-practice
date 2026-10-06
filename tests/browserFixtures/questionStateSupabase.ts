let owner: string | null = new URLSearchParams(location.search).has("guest") ? null : "first";
export function browserOwnerHint() { return owner; }
const listeners = new Set<(event: string, session: { user: { id: string } } | null) => void>();
window.addEventListener("question-account", ((event: CustomEvent<string | null>) => {
  owner = event.detail;
  for (const listener of listeners) listener("SIGNED_IN", owner ? { user: { id: owner } } : null);
}) as EventListener);
function request(path: string, body: unknown) {
  let signal: AbortSignal | undefined;
  const query = {
    abortSignal(value: AbortSignal) { signal = value; return query; },
    then(resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) {
      return fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal })
        .then(response => response.json()).then(resolve, reject);
    },
  };
  return query;
}
export function createClient() {
  return {
    auth: {
      getSession: async () => new URLSearchParams(location.search).has("stalled-auth")
        ? new Promise(() => {}) : ({ data: { session: owner ? { user: { id: owner } } : null }, error: null }),
      onAuthStateChange(listener: (event: string, session: { user: { id: string } } | null) => void) {
        listeners.add(listener);
        queueMicrotask(() => { if (listeners.has(listener)) listener("INITIAL_SESSION", owner ? { user: { id: owner } } : null); });
        return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } };
      },
    },
    rpc(name: string, args: unknown) { return request("/fixture/question-state", { name, args, owner }); },
    from(table: string) {
      const body: Record<string, unknown> = { table };
      const query = {
        upsert(row: { user_id: string; question_id: number }, options: unknown) { Object.assign(body, { action: "add", ...row, options }); return query; },
        delete() { body.action = "remove"; return query; },
        eq(key: string, value: unknown) { body[key] = value; return query; },
        abortSignal(signal: AbortSignal) { return request("/fixture/bookmark", body).abortSignal(signal); },
      };
      return query;
    },
  };
}
