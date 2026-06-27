export const USERNAME_MAX_LENGTH = 30;

/** Trim, lowercase, and cap length for onboarding username input. */
export function normalizeOnboardingUsername(raw: string): string {
  return raw.trim().toLowerCase().slice(0, USERNAME_MAX_LENGTH);
}
