const router = { replace: (url: string) => { document.body.dataset.destination = url; }, refresh: () => {} };
export function useRouter() { return router; }
