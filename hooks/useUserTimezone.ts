import { useApp } from "@/context/AppContext";
import { getDeviceTimezone } from "@/utils/device/getDeviceTimezone";

/** Logged-in user's IANA timezone (profile), else device timezone — same as stats attempts. */
export function useUserTimezone(): string {
  const { state } = useApp();
  const tz = state.profile?.timezone?.trim();
  return tz && tz.length > 0 ? tz : getDeviceTimezone();
}
