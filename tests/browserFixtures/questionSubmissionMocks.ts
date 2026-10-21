export * from "./challengeStudioMocks";

export function createClient() {
  return { auth: { getUser: async () => ({ data: { user: location.search.includes("guest=1") ? null : { id: "fixture-user" } } }) } };
}

export function redirect(destination: string): never {
  document.body.dataset.destination = destination;
  throw new Error("fixture-redirect");
}
