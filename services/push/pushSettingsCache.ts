let cachedHasToken: boolean | null = null;
const listeners = new Set<(value: boolean | null) => void>();

export function getCachedPushTokenStatus(): boolean | null {
  return cachedHasToken;
}

export function setCachedPushTokenStatus(value: boolean): void {
  cachedHasToken = value;
  listeners.forEach((listener) => listener(value));
}

export function resetCachedPushTokenStatus(): void {
  cachedHasToken = null;
  listeners.forEach((listener) => listener(null));
}

export function subscribeToCachedPushTokenStatus(
  listener: (value: boolean | null) => void,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
