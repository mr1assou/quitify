import type { AppLocale } from "@/types/i18n/locale";
import {
  CRAVING_SESSION_QUOTE_COUNT,
  getCravingSessionQuote,
  pickCravingSessionQuoteIndex,
} from "@/i18n/content/cravingSessionQuotes";

/** @deprecated Prefer getCravingSessionQuotes(locale) — kept for callers expecting a flat list. */
export const CRAVING_MOTIVATION_MESSAGES = Array.from(
  { length: CRAVING_SESSION_QUOTE_COUNT },
  (_, index) => getCravingSessionQuote("en", index),
);

/** Picks a random English line (legacy). Prefer locale-aware APIs. */
export function pickCravingMotivationMessage(locale: AppLocale = "en"): string {
  const index = pickCravingSessionQuoteIndex(locale);
  return getCravingSessionQuote(locale, index);
}

export {
  CRAVING_SESSION_QUOTE_COUNT,
  getCravingSessionQuote,
  pickCravingSessionQuoteIndex,
};
