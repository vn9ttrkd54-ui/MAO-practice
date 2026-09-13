// Shared by forms and server routes. Never apply this to an existing password
// during login/reauthentication, and never trim or rewrite a user's password.
export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_REQUIREMENT_MESSAGE = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;

export function getPasswordValidationError(password: unknown): string | null {
  if (typeof password !== "string") return PASSWORD_REQUIREMENT_MESSAGE;
  let length = 0;
  for (const character of password) {
    void character;
    if (++length >= MIN_PASSWORD_LENGTH) return null;
  }
  return PASSWORD_REQUIREMENT_MESSAGE;
}
