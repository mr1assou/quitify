import { getDeviceTimezone } from "@/utils/device/getDeviceTimezone";

/** Device IANA timezone for displaying UTC instants in chat (not profile/DB). */
export function useUserTimezone(): string {
  return getDeviceTimezone();
}
