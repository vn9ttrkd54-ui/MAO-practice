const fixture=window as unknown as {closeCalls?: Record<string, FormDataEntryValue>[]; finishClose?: () => void};
export async function closePrivateLobbyAction(form: FormData) {
  (fixture.closeCalls ??= []).push(Object.fromEntries(form));
  await new Promise<void>(resolve => { fixture.finishClose=resolve; });
}
