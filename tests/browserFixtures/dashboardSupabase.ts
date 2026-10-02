import { dashboardOwner } from "./dashboardData";

type Session = { user: { id: string } } | null;
let owner: string | null = dashboardOwner;
const listeners = new Set<(event: string, session: Session) => void>();
window.addEventListener("dashboard-account", ((event: CustomEvent<string | null>) => {
  owner = event.detail;
  for (const listener of listeners) listener(owner ? "SIGNED_IN" : "SIGNED_OUT", owner ? { user: { id: owner } } : null);
}) as EventListener);

export function createClient() {
  return {
    auth: {
      onAuthStateChange(listener: (event: string, session: Session) => void) {
        listeners.add(listener);
        queueMicrotask(() => { if (listeners.has(listener)) listener("INITIAL_SESSION", owner ? { user: { id: owner } } : null); });
        return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } };
      },
    },
    from() { throw new Error("Dashboard must not read tables from the browser."); },
    rpc() { throw new Error("Dashboard must use its authenticated server endpoint."); },
  };
}
