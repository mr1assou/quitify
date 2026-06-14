const CLOCK_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

const LIST_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

function calendarDayKeyInTimezone(ms: number, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(ms));
  } catch {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(ms));
  }
}

function formatTimestampInTimezone(
  timestamp: number,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";

  try {
    return new Intl.DateTimeFormat(undefined, { ...options, timeZone }).format(date);
  } catch {
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }
}

/** Clock time for a message bubble (e.g. "14:32") in the user's timezone. */
export function formatMessageClockTime(timestamp: number, timeZone: string): string {
  return formatTimestampInTimezone(timestamp, timeZone, CLOCK_OPTIONS);
}

/** Chat list label: today → clock, yesterday → "Yesterday", else short date. */
export function formatMessageListTime(
  timestamp: number,
  timeZone: string,
  now = Date.now(),
): string {
  const day = calendarDayKeyInTimezone(timestamp, timeZone);
  const today = calendarDayKeyInTimezone(now, timeZone);

  if (day === today) return formatMessageClockTime(timestamp, timeZone);

  const yesterday = calendarDayKeyInTimezone(now - 86_400_000, timeZone);
  if (day === yesterday) return "Yesterday";

  return formatTimestampInTimezone(timestamp, timeZone, LIST_DATE_OPTIONS);
}
