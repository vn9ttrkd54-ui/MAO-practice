export function useRouter() {
  return { push: (url: string) => { document.body.dataset.destination = url; } };
}
export function useSearchParams() { return new URLSearchParams(location.search); }
