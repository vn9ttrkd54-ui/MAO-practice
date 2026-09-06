export function subscribeToMultiplayerRoom(_id: string, callback: (event: unknown) => void) {
  const listener = (event: Event) => callback((event as CustomEvent).detail);
  window.addEventListener("test-room-event", listener);
  return () => window.removeEventListener("test-room-event", listener);
}
