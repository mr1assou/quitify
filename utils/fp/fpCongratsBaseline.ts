import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Last Freedom Points total the user was already congratulated for.
 * Stored per user so the same grant never triggers a second popup,
 * even across app restarts.
 */
const KEY_PREFIX = "fp:congrats-baseline:";

function storageKey(userId: number): string {
  return `${KEY_PREFIX}${userId}`;
}

export async function readFpCongratsBaseline(userId: number): Promise<number | null> {
  const raw = await AsyncStorage.getItem(storageKey(userId));
  if (raw == null) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function writeFpCongratsBaseline(
  userId: number,
  total: number,
): Promise<void> {
  await AsyncStorage.setItem(storageKey(userId), String(total));
}
