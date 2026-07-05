/** Prefix for scheduled local motivation notification identifiers. */
export const MOTIVATION_LOCAL_ID_PREFIX = "quitify-motivation-local";

export const MOTIVATION_LOCAL_ANDROID_CHANNEL_ID = "motivation";

/** Matches former server motivation push timezone. */
export const MOTIVATION_LOCAL_TIMEZONE = "America/New_York";

/** Daily local motivation times in US Eastern (same as former server cron). */
export const MOTIVATION_LOCAL_SCHEDULES = [
  { hour: 12, minute: 30, slot: "midday" },
  { hour: 20, minute: 30, slot: "evening" },
] as const;

/** How many days ahead to pre-schedule (refreshed on app open). */
export const MOTIVATION_SCHEDULE_DAYS_AHEAD = 14;
