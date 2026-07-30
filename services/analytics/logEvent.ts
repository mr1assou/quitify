import {
  getAnalytics,
  logEvent,
  setUserId,
} from "@react-native-firebase/analytics";

/**
 * Thin Firebase Analytics wrapper.
 * Safe to call on any platform — failures are swallowed (e.g. Expo Go / web).
 */
export async function logAnalyticsEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    await logEvent(getAnalytics(), name, params);
  } catch (error) {
    if (__DEV__) {
      console.warn("[analytics] logEvent failed:", name, params, error);
    }
  }
}

export async function setAnalyticsUserId(userId: string | null): Promise<void> {
  try {
    await setUserId(getAnalytics(), userId);
  } catch (error) {
    if (__DEV__) {
      console.warn("[analytics] setUserId failed:", userId, error);
    }
  }
}
