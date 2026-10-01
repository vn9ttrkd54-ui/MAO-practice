const router = { replace: (url: string) => { document.body.dataset.destination = url; }, refresh: () => {
  document.body.dataset.refreshes = String(Number(document.body.dataset.refreshes ?? 0) + 1);
} };
export function useRouter() { return router; }
