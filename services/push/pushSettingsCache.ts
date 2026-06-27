let cachedHasToken: boolean | null = null;

export function getCachedPushTokenStatus(): boolean | null {
  return cachedHasToken;
}

export function setCachedPushTokenStatus(value: boolean): void {
  cachedHasToken = value;
}
