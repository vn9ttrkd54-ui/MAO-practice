type Session = { user: { id: string } } | null;
let owner: string | null = "first";
export function browserOwnerHint() { return owner; }
const listeners = new Set<(event: string, session: Session) => void>();
window.addEventListener("bank-account", ((event: CustomEvent<string | null>) => {
  owner = event.detail;
  for (const listener of listeners) listener("SIGNED_IN", owner ? { user: { id: owner } } : null);
}) as EventListener);

export function createClient() {
  return {
    auth: {
      // Listing must not depend on the browser's pending Auth initialization.
      getSession: async () => new Promise(() => {}),
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
        select: () => query,
        eq: (_key: string, value: string) => { params.set("owner", value); return query; },
        gte: (_key: string, value: number) => { params.set("min", String(value)); return query; },
        lte: (_key: string, value: number) => { params.set("max", String(value)); return query; },
        order: () => query,
        range: (start: number, end: number) => { params.set("start", String(start)); params.set("end", String(end)); return query; },
        abortSignal: (value: AbortSignal) => { signal = value; return query; },
        then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => fetch(`/fixture/progress?${params}`, { signal }).then(response => response.json()).then(resolve, reject),
      };
      return query;
    },
  };
}
