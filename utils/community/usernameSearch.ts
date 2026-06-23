export const USERNAME_SEARCH_MIN_LENGTH = 2;
export const USERNAME_SEARCH_DEBOUNCE_MS = 300;

/** Usernames are lowercase; strip leading @ and non-search characters. */
export function normalizeUsernameSearchQuery(raw: string): string {
  return raw
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
}

export function sanitizeUsernameSearchInput(raw: string): string {
  return normalizeUsernameSearchQuery(raw);
}
