import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  MOTIVATION_LOCAL_ANDROID_CHANNEL_ID,
  MOTIVATION_LOCAL_ID_PREFIX,
  MOTIVATION_LOCAL_SCHEDULES,
  MOTIVATION_SCHEDULE_DAYS_AHEAD,
} from "@/constants/push/motivationLocalNotifications";
import type { AppState } from "@/types/app/app";
import { buildMotivationLocalNotificationCopy } from "@/utils/push/motivationNotificationCopy";

export type MotivationLocalSyncInput = {
  enabled: boolean;
  userId: number;
  username: string | null | undefined;
  motivationCardIndex: number;
  streakStart: number | null | undefined;
};

function dateAtDayOffset(hour: number, minute: number, dayOffset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
}

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

export async function syncMotivationLocalNotifications(
  input: MotivationLocalSyncInput,
): Promise<void> {
  await cancelMotivationLocalNotifications();

  if (!input.enabled || !Device.isDevice) return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;

  await ensureAndroidMotivationChannel();

  for (let dayOffset = 0; dayOffset < MOTIVATION_SCHEDULE_DAYS_AHEAD; dayOffset++) {
    for (const schedule of MOTIVATION_LOCAL_SCHEDULES) {
      const fireAt = dateAtDayOffset(schedule.hour, schedule.minute, dayOffset);
      if (fireAt.getTime() <= Date.now()) continue;

      const { title, body } = buildMotivationLocalNotificationCopy({
        userId: input.userId,
        username: input.username,
        motivationCardIndex: input.motivationCardIndex,
        streakStart: input.streakStart,
        fireAt,
      });

      await Notifications.scheduleNotificationAsync({
        identifier: `${MOTIVATION_LOCAL_ID_PREFIX}-${schedule.slot}-${dayOffset}`,
        content: {
          title,
          body,
          data: { type: "motivation_local" },
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
    streakStart: state.profile?.streakStart,
  });
}
