const router = {
  push: (url: string) => { document.body.dataset.destination = url; },
  replace: (url: string) => { document.body.dataset.destination = url; },
  refresh: () => {},
};
export function useRouter() { return router; }
export function useSearchParams() { return new URLSearchParams(location.search); }
