export const MODERATION_ACTIONS = ["require_name_change", "suspend", "restore", "delete"] as const;
export type ModerationAction = typeof MODERATION_ACTIONS[number];
export const UUID_PATTERN = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
export type ModerationState = {
  version: number; suspended: boolean; requires_name_change: boolean; previous_login_username: string | null;
};
export type ModerationAuditEntry = { request_id: string; actor_id: string | null; action: string; reason: string; created_at: string };
