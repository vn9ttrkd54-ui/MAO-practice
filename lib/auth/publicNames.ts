import rules from "./publicNameRules.json";

export const PUBLIC_NAME_ERROR = "Please choose a different name. This one contains inappropriate language.";
export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export function isPublicNameAllowed(value: string) {
  const normalized = value.normalize("NFKC").toLowerCase()
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/[0-9]+$/g, "")
    .replace(/[01345789@$!]/g, (char) => ({ "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "9": "g", "@": "a", "$": "s", "!": "i" })[char]!);
  const words = normalized.match(/[a-z]+/g) ?? [];
  const compact = words.join("");
  if (rules.allow.includes(compact)) return true;
  const squeeze = (word: string) => word.replace(/(.)\1+/g, "$1");
  const squeezed = squeeze(compact);
  return !rules.contains.some((term) => squeezed.includes(squeeze(term)))
    && !rules.words.some((term) => words.some((word) => squeeze(word) === squeeze(term)) || squeezed === squeeze(term));
}

export function getUsernameValidationError(value: unknown) {
  if (typeof value !== "string" || !USERNAME_PATTERN.test(value)) {
    return "Use 3-20 lowercase letters, numbers, or underscores.";
  }
  if (/^player_[0-9a-f]{12}$/.test(value)) return "That username is reserved. Please choose another.";
  return isPublicNameAllowed(value) ? null : PUBLIC_NAME_ERROR;
}
