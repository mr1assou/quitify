const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  ...DATE_OPTIONS,
  hour: "2-digit",
  minute: "2-digit",
};

function formatInTimezone(
  iso: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  try {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(date);
  } catch {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
}

/** Formats a UTC ISO instant as day, month, and year in the user's timezone. */
export function formatUtcDateInTimezone(
  iso: string,
  timeZone: string,
  locale?: string,
): string {
  return formatInTimezone(iso, timeZone, DATE_OPTIONS, locale);
}

/** Formats a UTC ISO instant with date and time in the user's timezone. */
export function formatUtcIsoInTimezone(
  iso: string,
  timeZone: string,
  locale?: string,
): string {
  return formatInTimezone(iso, timeZone, DATE_TIME_OPTIONS, locale);
}
