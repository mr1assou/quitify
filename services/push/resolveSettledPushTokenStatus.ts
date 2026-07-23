import * as Notifications from "expo-notifications";

import { fetchPushTokenStatus } from "@/services/push/pushTokenApi";
import { registerCurrentDevicePushTokenIfAuthorized } from "@/services/push/registerPushToken";
import {
  clearPushDisabledByUser,
  isPushDisabledByUser,
  markPushDisabledByUser,
} from "@/utils/push/pushDisabledStorage";

/**
 * Settled in-app push status for this device.
 * Avoids a false→true flash when OS permission is already granted but the
 * token row is missing until re-registration finishes.
 */
export async function resolveSettledPushTokenStatus(): Promise<boolean> {
  const hasToken = await fetchPushTokenStatus();
  if (hasToken) {
    await clearPushDisabledByUser();
    return true;
  }

  if (await isPushDisabledByUser()) {
    return false;
  }

  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== "granted") {
    return false;
  }

  return registerCurrentDevicePushTokenIfAuthorized();
}

export async function markNotificationsDisabledByUser(): Promise<void> {
  await markPushDisabledByUser();
}

export async function markNotificationsEnabledByUser(): Promise<void> {
  await clearPushDisabledByUser();
}
