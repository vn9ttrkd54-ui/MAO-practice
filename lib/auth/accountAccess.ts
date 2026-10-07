import type { User } from "@supabase/supabase-js";

// Only use with a user returned by Auth.getUser(), never editable user_metadata
// or an unverified browser token. App metadata is a server-controlled mirror of
// the transactional database moderation record.
export function accountRestriction(user: Pick<User, "app_metadata"> | null): "suspended" | "rename" | null {
  if (user?.app_metadata.account_suspended === true) return "suspended";
  if (user?.app_metadata.requires_name_change === true) return "rename";
  return null;
}
