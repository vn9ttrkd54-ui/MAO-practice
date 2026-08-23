export type AccountRole = "user" | "admin" | "owner";

export function hasAdminAccess(role: string | null | undefined) {
  return role === "admin" || role === "owner";
}

export function hasOwnerAccess(role: string | null | undefined) {
  return role === "owner";
}
