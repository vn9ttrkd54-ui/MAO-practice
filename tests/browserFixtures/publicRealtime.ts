export function createClient() {
  let listener: ((event: Event) => void) | undefined;
  const channel = {
    on(_kind: string, _filter: unknown, callback: (data: unknown) => void) {
      listener = event => callback((event as CustomEvent).detail);
      return channel;
    },
    subscribe(callback: (status: string) => void) {
      if (listener) window.addEventListener("test-public-event", listener);
      callback("SUBSCRIBED");
      return channel;
    },
  };
  return { channel: () => channel, removeChannel: async () => {
    if (listener) window.removeEventListener("test-public-event", listener);
  } };
}
