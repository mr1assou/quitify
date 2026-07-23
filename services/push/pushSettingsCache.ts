import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_HAS_TOKEN_STORAGE_KEY = "push:has-token-v1";

let cachedHasToken: boolean | null = null;
const listeners = new Set<(value: boolean | null) => void>();
let hydratePromise: Promise<void> | null = null;

export function getCachedPushTokenStatus(): boolean | null {
  return cachedHasToken;
}

export function setCachedPushTokenStatus(value: boolean): void {
  cachedHasToken = value;
  listeners.forEach((listener) => listener(value));
  void AsyncStorage.setItem(PUSH_HAS_TOKEN_STORAGE_KEY, value ? "1" : "0").catch(
    () => {},
  );
}

export function resetCachedPushTokenStatus(): void {
  cachedHasToken = null;
  listeners.forEach((listener) => listener(null));
  void AsyncStorage.removeItem(PUSH_HAS_TOKEN_STORAGE_KEY).catch(() => {});
}

/**
 * Restore last known in-app push status so home/settings don't flash
 * Motivate me / toggle off before the network catch-up finishes.
 */
export function hydrateCachedPushTokenStatus(): Promise<void> {
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    if (cachedHasToken !== null) return;

    try {
      const raw = await AsyncStorage.getItem(PUSH_HAS_TOKEN_STORAGE_KEY);
      if (cachedHasToken !== null) return;
      if (raw === "1") {
        cachedHasToken = true;
        listeners.forEach((listener) => listener(true));
      } else if (raw === "0") {
        cachedHasToken = false;
        listeners.forEach((listener) => listener(false));
      }
    } catch {
      // Keep null until the network status resolves.
    }
  })();

  return hydratePromise;
}

export function subscribeToCachedPushTokenStatus(
  listener: (value: boolean | null) => void,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
