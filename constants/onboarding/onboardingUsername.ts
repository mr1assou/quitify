export const USERNAME_MAX_LENGTH = 15;
/** Stored value includes the leading `@`. */
export const USERNAME_STORED_MAX_LENGTH = USERNAME_MAX_LENGTH + 1;

/** Strip leading `@` characters and lowercase. */
export function stripUsernameAtPrefix(raw: string): string {
  return raw.trim().replace(/^@+/, "").toLowerCase();
}

/**
 * Usernames are always `@handle` (lowercase, handle capped at 15).
 * Empty / `@`-only input becomes `""`.
 */
export function normalizeOnboardingUsername(raw: string): string {
  const handle = stripUsernameAtPrefix(raw).slice(0, USERNAME_MAX_LENGTH);
  if (!handle) return "";
  return `@${handle}`;
}

/** True when username has a real handle after normalization. */
export function isValidOnboardingUsername(raw: string): boolean {
  return normalizeOnboardingUsername(raw).length > 1;
}

/** Handle length without the leading `@` (for character counters). */
export function usernameHandleLength(raw: string): number {
  return stripUsernameAtPrefix(raw).slice(0, USERNAME_MAX_LENGTH).length;
}

/** Display / mention form with a single leading `@`. */
export function formatUsernameMention(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}
