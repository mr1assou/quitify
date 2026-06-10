/** IANA timezone from the device, e.g. "Europe/Berlin". */
export function getDeviceTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.length > 0) return tz;
  } catch {
    // fall through
  }
  return "UTC";
}
