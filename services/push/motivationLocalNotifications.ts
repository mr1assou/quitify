import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  MOTIVATION_LOCAL_ANDROID_CHANNEL_ID,
  MOTIVATION_LOCAL_ID_PREFIX,
  MOTIVATION_SCHEDULE_DAYS_AHEAD,
} from "@/constants/push/motivationLocalNotifications";
import type { AppState } from "@/types/app/app";
import { buildMotivationLocalNotificationCopy } from "@/utils/push/motivationNotificationCopy";
import { listUpcomingMotivationLocalFireSlots } from "@/utils/push/motivationLocalFireAt";

export type MotivationLocalSyncInput = {
  enabled: boolean;
  userId: number;
  username: string | null | undefined;
  motivationCardIndex: number;
};

let syncInFlight: Promise<void> | null = null;

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

async function scheduleMotivationLocalNotifications(
  input: MotivationLocalSyncInput,
): Promise<void> {
  await cancelMotivationLocalNotifications();

  if (!input.enabled || !Device.isDevice) return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;

  await ensureAndroidMotivationChannel();

  const fireSlots = listUpcomingMotivationLocalFireSlots(MOTIVATION_SCHEDULE_DAYS_AHEAD);

  for (const { fireAt, slot, dayOffset, sequenceIndex } of fireSlots) {
    const { title, body } = buildMotivationLocalNotificationCopy({
      userId: input.userId,
      username: input.username,
      motivationCardIndex: input.motivationCardIndex,
      sequenceIndex,
    });

    await Notifications.scheduleNotificationAsync({
      identifier: `${MOTIVATION_LOCAL_ID_PREFIX}-${slot}-${dayOffset}`,
      content: {
        title,
        body,
        data: { type: "motivation_local", slot, dayOffset },
        ...(Platform.OS === "android"
          ? { channelId: MOTIVATION_LOCAL_ANDROID_CHANNEL_ID }
          : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
      },
    });
  }
}

export async function syncMotivationLocalNotifications(
  input: MotivationLocalSyncInput,
): Promise<void> {
  if (syncInFlight) {
    await syncInFlight;
    return;
  }

  syncInFlight = scheduleMotivationLocalNotifications(input).finally(() => {
    syncInFlight = null;
  });

  await syncInFlight;
}

export async function syncMotivationLocalFromAppState(
  state: AppState,
  enabled: boolean,
): Promise<void> {
  const userId = state.account?.userId;
  if (!userId) {
    await cancelMotivationLocalNotifications();
    return;
  }

  await syncMotivationLocalNotifications({
    enabled,
    userId,
    username: state.profile?.name ?? state.account?.name,
    motivationCardIndex: state.account.motivationCardIndex ?? 0,
  });
}
