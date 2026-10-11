// Synthetic server verification for the isolated browser test only.
const valid = new URLSearchParams(location.search).get("state") !== "expired";

export async function cookies() {
  return { get: () => valid ? { value: "fixture-recovery-cookie" } : undefined };
}

export async function createClient() {
  return { auth: { getUser: async () => ({ data: { user: valid ? { id: "fixture-user" } : null } }) } };
}

export function verifyRecoveryToken(token: string | undefined, userId: string) {
  return valid && token === "fixture-recovery-cookie" && userId === "fixture-user";
}
