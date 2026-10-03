type Session = { user: { id: string } } | null;
const params = new URLSearchParams(location.search);
let owner: string | null = params.has("guest") ? null : params.has("second") ? "second" : "first";
const listeners = new Set<(event: string, session: Session) => void>();
window.addEventListener("trainer-account", ((event: CustomEvent<string | null>) => {
  owner = event.detail;
  for (const listener of listeners) listener("SIGNED_IN", owner ? { user: { id: owner } } : null);
}) as EventListener);

export function createClient() {
  return {
    rpc(name: string, args: unknown) {
      let signal: AbortSignal | undefined;
      const query = {
        abortSignal(value: AbortSignal) { signal = value; return query; },
        then(resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) {
          return fetch("/fixture/trainer-save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, args }), signal })
            .then(response => response.json()).then(resolve, reject);
        },
      };
      return query;
    },
    auth: {
      getSession: async () => ({ data: { session: owner ? { user: { id: owner } } : null }, error: null }),
      onAuthStateChange(listener: (event: string, session: Session) => void) {
        listeners.add(listener);
        queueMicrotask(() => { if (listeners.has(listener)) listener("INITIAL_SESSION", owner ? { user: { id: owner } } : null); });
        return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } };
      },
    },
    from(table: string) {
      const params = new URLSearchParams({ table });
      let signal: AbortSignal | undefined;
      const query = {
        select: (fields: string) => { params.set("fields", fields); return query; },
        eq: (_key: string, value: string) => { params.set("owner", value); return query; },
        gte: (_key: string, value: number) => { params.set("min", String(value)); return query; },
        lte: (_key: string, value: number) => { params.set("max", String(value)); return query; },
        order: () => query,
        range: (start: number, end: number) => { params.set("start", String(start)); params.set("end", String(end)); return query; },
        maybeSingle: () => query,
        abortSignal: (value: AbortSignal) => { signal = value; return query; },
        then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => fetch(`/fixture/trainer-read?${params}`, { signal }).then(response => response.json()).then(resolve, reject),
      };
      return query;
    },
  };
}
