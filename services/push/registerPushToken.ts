import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  clearPushTokensOnBackend,
  fetchPushTokenStatus,
  registerPushTokenOnBackend,
  type PushPlatform,
} from "@/services/push/pushTokenApi";

function getEasProjectId(): string {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    throw new Error("EAS projectId is missing from app config.");
  }
  return projectId;
}

async function ensureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function resolvePushPlatform(): PushPlatform | null {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return null;
}

async function saveCurrentDevicePushToken(
  platform: PushPlatform,
): Promise<boolean> {
  await ensureAndroidNotificationChannel();

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId: getEasProjectId(),
  });

  if (!token) {
    throw new Error("Expo did not return a push token.");
  }

  // The backend upsert moves this installation token to the signed-in user.
  await registerPushTokenOnBackend({ token, platform });
  return true;
}

/**
 * Shows the OS notification permission dialog, then saves the Expo push token
 * on the server when the user allows.
 */
export async function requestPushPermissionAndSaveToken(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const platform = resolvePushPlatform();
  if (!platform) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  return saveCurrentDevicePushToken(platform);
}

/**
 * Reassigns this installation's existing push token to the signed-in user
 * without showing the OS permission dialog.
 */
export async function registerCurrentDevicePushTokenIfAuthorized(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const platform = resolvePushPlatform();
  if (!platform) return false;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return false;

  return saveCurrentDevicePushToken(platform);
}

/**
 * Keeps the DB in sync with the device after reinstall or permission changes.
 * - Notifications ON in app + OS allowed → save a fresh push token
 * - Notifications ON in app + OS denied → clear stale token from DB
 * - Notifications OFF in app → do nothing (respect user choice)
 */
export async function syncPushTokenWithBackend(): Promise<void> {
  if (!Device.isDevice) return;

  const platform = resolvePushPlatform();
  if (!platform) return;

  let hasTokenInDb = false;
  try {
    hasTokenInDb = await fetchPushTokenStatus();
  } catch {
    return;
  }

  if (!hasTokenInDb) return;

  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    await clearPushTokensOnBackend();
    return;
  }

  await saveCurrentDevicePushToken(platform);
}
