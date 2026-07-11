import { buildMotivationQuotes } from "@/i18n/content/buildMotivationQuotes";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, normalizeStoredLocale } from "@/constants/i18n/languages";
import type { AppLocale } from "@/types/i18n/locale";
import AsyncStorage from "@react-native-async-storage/async-storage";

function pickFromList<T>(items: readonly T[], seed: number): T {
  return items[((seed % items.length) + items.length) % items.length]!;
}

async function readNotificationLocale(): Promise<AppLocale> {
  try {
    const raw = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    return normalizeStoredLocale(raw) ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function pickMotivationForLocalNotification(input: {
  userId: number;
  motivationCardIndex: number;
  /** Monotonic slot index so each scheduled notification gets different copy. */
  sequenceIndex: number;
}): Promise<string> {
  const locale = await readNotificationLocale();
  const quotes = buildMotivationQuotes(locale);
  const seed = input.userId + input.motivationCardIndex + input.sequenceIndex;
  return pickFromList(quotes, seed).text;
}

/** @deprecated sync API for tests; prefers async picker in production. */
export function pickMotivationForLocalNotificationSync(
  input: {
    userId: number;
    motivationCardIndex: number;
    sequenceIndex: number;
  },
  locale: AppLocale = DEFAULT_LOCALE,
): string {
  const quotes = buildMotivationQuotes(locale);
  const seed = input.userId + input.motivationCardIndex + input.sequenceIndex;
  return pickFromList(quotes, seed).text;
}
