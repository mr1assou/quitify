import { useMemo, useRef } from "react";

import {
  getCravingSessionQuote,
  pickCravingSessionQuoteIndex,
} from "@/i18n/content/cravingSessionQuotes";
import { useTranslation } from "@/hooks/i18n/useTranslation";

/** One random motivation line for the current craving session (follows app language). */
export function useCravingMotivationMessage(): string {
  const { locale } = useTranslation();
  const indexRef = useRef<number | null>(null);

  if (indexRef.current == null) {
    indexRef.current = pickCravingSessionQuoteIndex(locale);
  }

  return useMemo(
    () => getCravingSessionQuote(locale, indexRef.current ?? 0),
    [locale],
  );
}
