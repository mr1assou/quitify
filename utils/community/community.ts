import type { AppLocale } from "@/types/i18n/locale";

type RelativeWords = {
  justNow: string;
  minAgo: (m: number) => string;
  hoursAgo: (h: number) => string;
  todayAt: (at: string) => string;
  yesterdayAt: (at: string) => string;
  dateAt: (date: string, at: string) => string;
  lastSeen: (fragment: string) => string;
  yesterday: string;
};

const RELATIVE_WORDS: Record<AppLocale, RelativeWords> = {
  en: {
    justNow: "just now",
    minAgo: (m) => `${m} min ago`,
    hoursAgo: (h) => `${h}h ago`,
    todayAt: (at) => `today at ${at}`,
    yesterdayAt: (at) => `yesterday at ${at}`,
    dateAt: (date, at) => `${date} at ${at}`,
    lastSeen: (fragment) => `Last seen ${fragment}`,
    yesterday: "Yesterday",
  },
  fr: {
    justNow: "à l'instant",
    minAgo: (m) => `il y a ${m} min`,
    hoursAgo: (h) => `il y a ${h} h`,
    todayAt: (at) => `aujourd'hui à ${at}`,
    yesterdayAt: (at) => `hier à ${at}`,
    dateAt: (date, at) => `le ${date} à ${at}`,
    lastSeen: (fragment) => `Vu ${fragment}`,
    yesterday: "Hier",
  },
};

function relativeWords(locale?: AppLocale): RelativeWords {
  return RELATIVE_WORDS[locale ?? "en"] ?? RELATIVE_WORDS.en;
}

/** Time-only last-seen fragment for chat headers (e.g. "2h ago", "today at 14:32"). */
export function formatLastSeenAgo(
  timestamp: number,
  locale?: AppLocale,
  now = Date.now(),
): string {
  const words = relativeWords(locale);
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return words.justNow;
  if (minutes < 60) return words.minAgo(minutes);

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return words.hoursAgo(hours);

  const at = formatClockTime(timestamp);
  const d = new Date(timestamp);
  const nowD = new Date(now);
  const sameDay =
    d.getFullYear() === nowD.getFullYear() &&
    d.getMonth() === nowD.getMonth() &&
    d.getDate() === nowD.getDate();

  if (sameDay) return words.todayAt(at);

  const yesterday = new Date(now - 24 * 60 * 60 * 1000);
  if (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  ) {
    return words.yesterdayAt(at);
  }

  const date = d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  return words.dateAt(date, at);
}

/** Human-readable last-seen line for chat headers (e.g. "Last seen 2h ago"). */
export function formatLastSeen(
  timestamp: number,
  locale?: AppLocale,
  now = Date.now(),
): string {
  return relativeWords(locale).lastSeen(formatLastSeenAgo(timestamp, locale, now));
}

/** Compact human-readable "X ago" string for community feed / chat. */
export function formatRelativeTime(timestamp: number, now = Date.now()): string {
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(days / 365);
  return `${years}y`;
}

/** Clock time used inside chat bubbles (e.g. "14:32"). */
export function formatClockTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Smarter chat-list label: today → "14:32", yesterday → "Yesterday", else date. */
export function formatChatRelativeDate(
  timestamp: number,
  locale?: AppLocale,
  now = Date.now(),
): string {
  const d = new Date(timestamp);
  const nowD = new Date(now);
  const sameDay =
    d.getFullYear() === nowD.getFullYear() &&
    d.getMonth() === nowD.getMonth() &&
    d.getDate() === nowD.getDate();

  if (sameDay) return formatClockTime(timestamp);

  const yesterday = new Date(now - 24 * 60 * 60 * 1000);
  if (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  ) {
    return relativeWords(locale).yesterday;
  }

  return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

/** Compact 1.2k / 12.4k / 1.3M style counts for likes / shares. */
export function formatCountCompact(n: number): string {
  if (n < 1_000) return String(n);
  if (n < 10_000) return `${(n / 1_000).toFixed(1)}k`;
  if (n < 1_000_000) return `${Math.round(n / 1_000)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/** Lowercased, accent-folded search needle. */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
