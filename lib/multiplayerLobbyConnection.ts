export interface LobbyConnection { tabId: string; connectionId: string; generation: number }

// Stable tab identity, fresh monotonically numbered page generation. A copied tab
// cannot reuse an active generation to issue a delayed disconnect for another page.
export function nextLobbyConnection(roomId: string): LobbyConnection {
  const key = `mao:lobby-tab:${roomId}`;
  let tabId = crypto.randomUUID();
  let generation = 1;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) ?? "null");
    if (saved && typeof saved.tabId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(saved.tabId) &&
      Number.isSafeInteger(saved.generation) && saved.generation > 0 && saved.generation < Number.MAX_SAFE_INTEGER) {
      tabId = saved.tabId;
      generation = saved.generation + 1;
    }
    sessionStorage.setItem(key, JSON.stringify({ tabId, generation }));
  } catch { /* Storage-disabled browsers can still establish a fresh connection. */ }
  return { tabId, generation, connectionId: crypto.randomUUID() };
}
