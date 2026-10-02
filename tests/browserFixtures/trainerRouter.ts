export function useRouter() {
  return { push: (url: string) => { document.body.dataset.destination = url; } };
}
