import * as Notifications from "expo-notifications";

import {
  clearPushTokensOnBackend,
  fetchPushTokenStatus,
} from "@/services/push/pushTokenApi";
import { registerCurrentDevicePushTokenIfAuthorized } from "@/services/push/registerPushToken";
import {
  clearPushDisabledByUser,
  isPushDisabledByUser,
  markPushDisabledByUser,
} from "@/utils/push/pushDisabledStorage";

/**
 * Final in-app push status for this device.
 * Returns only after the phone permission and the saved token agree, so the
 * Home prompt is not shown and then hidden while a stale token is cleared.
 */
export async function resolveSettledPushTokenStatus(): Promise<boolean> {
  if (await isPushDisabledByUser()) {
    return false;
  }

  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== "granted") {
    if (await fetchPushTokenStatus()) {
      await clearPushTokensOnBackend();
    }
    return false;
  }

  if (await fetchPushTokenStatus()) {
    await clearPushDisabledByUser();
    return true;
  }

  const registered = await registerCurrentDevicePushTokenIfAuthorized();
  if (registered) {
    await clearPushDisabledByUser();
  }
  return registered;
}

export async function markNotificationsDisabledByUser(): Promise<void> {
  await markPushDisabledByUser();
}

export async function markNotificationsEnabledByUser(): Promise<void> {
  await clearPushDisabledByUser();
}
