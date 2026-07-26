import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  MOTIVATION_LOCAL_ANDROID_CHANNEL_ID,
  MOTIVATION_LOCAL_ID_PREFIX,
} from "@/constants/push/motivationLocalNotifications";
import type { AppState } from "@/types/app/app";

export type MotivationLocalSyncInput = {
  enabled: boolean;
  userId: number;
  username: string | null | undefined;
  motivationCardIndex: number;
};

/**
 * Motivation alerts are sent as Expo push from the Nest cron
 * (12:30 PM + 8:30 PM US Eastern). Local scheduling is disabled to avoid duplicates.
 * These helpers only cancel any leftover local motivation jobs.
 */

async function ensureAndroidMotivationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(MOTIVATION_LOCAL_ANDROID_CHANNEL_ID, {
    name: "Motivation",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function cancelMotivationLocalNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const ids = scheduled
    .filter((request) => request.identifier.startsWith(MOTIVATION_LOCAL_ID_PREFIX))
    .map((request) => request.identifier);

  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

/** No-op schedule — clears legacy local motivation notifications only. */
export async function syncMotivationLocalNotifications(
  _input: MotivationLocalSyncInput,
): Promise<void> {
  await ensureAndroidMotivationChannel();
  await cancelMotivationLocalNotifications();
}

export async function syncMotivationLocalFromAppState(
  state: AppState,
  _enabled: boolean,
): Promise<void> {
  if (!state.account?.userId) {
    await cancelMotivationLocalNotifications();
    return;
  }
  await cancelMotivationLocalNotifications();
}
