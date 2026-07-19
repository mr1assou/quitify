export const USERNAME_MAX_LENGTH = 15;

/** Trim, lowercase, and cap length for onboarding username input. */
export function normalizeOnboardingUsername(raw: string): string {
  return raw.trim().toLowerCase().slice(0, USERNAME_MAX_LENGTH);
}

/** True when username has at least one character after normalization. */
export function isValidOnboardingUsername(raw: string): boolean {
  return normalizeOnboardingUsername(raw).length > 0;
}
