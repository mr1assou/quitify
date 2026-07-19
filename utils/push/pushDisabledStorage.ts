import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Records that the user explicitly turned notifications OFF in app settings.
 * Auto-registration flows (login sync, foreground sync) respect this choice
 * and never silently re-register a push token on this device.
 */
const PUSH_DISABLED_BY_USER_KEY = "push:disabled-by-user";

export async function markPushDisabledByUser(): Promise<void> {
  await AsyncStorage.setItem(PUSH_DISABLED_BY_USER_KEY, "1");
}

export async function clearPushDisabledByUser(): Promise<void> {
  await AsyncStorage.removeItem(PUSH_DISABLED_BY_USER_KEY);
}

export async function isPushDisabledByUser(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PUSH_DISABLED_BY_USER_KEY);
  return value === "1";
}
