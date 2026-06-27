import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { registerPushTokenOnBackend, type PushPlatform } from "@/services/push/pushTokenApi";

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

  await ensureAndroidNotificationChannel();

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId: getEasProjectId(),
  });

  if (!token) {
    throw new Error("Expo did not return a push token.");
  }

  await registerPushTokenOnBackend({ token, platform });
  return true;
}
