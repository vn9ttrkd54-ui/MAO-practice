import { useSyncExternalStore } from "react";

const originalReplace = window.history.replaceState.bind(window.history);
window.history.replaceState = (...args) => { originalReplace(...args); window.dispatchEvent(new Event("bank-url")); };
const subscribe = (changed: () => void) => {
  window.addEventListener("bank-url", changed);
  window.addEventListener("popstate", changed);
  return () => { window.removeEventListener("bank-url", changed); window.removeEventListener("popstate", changed); };
};
export function useSearchParams() {
  return new URLSearchParams(useSyncExternalStore(subscribe, () => window.location.search));
}
export function usePathname() { return window.location.pathname; }
