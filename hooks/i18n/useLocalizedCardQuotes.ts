import { useMemo } from "react";

import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import type { SwipeableCardToolId } from "@/hooks/craving/useSwipeableCardSession";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export function useLocalizedTipQuotes(): readonly MotivationQuote[] {
  const { locale } = useTranslation();
  return useMemo(() => {
    const { buildTipQuotes } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/i18n/content/buildTipQuotes") as typeof import("@/i18n/content/buildTipQuotes");
    return buildTipQuotes(locale);
  }, [locale]);
}

export function useLocalizedMotivationQuotes(): readonly MotivationQuote[] {
  const { locale } = useTranslation();
  return useMemo(() => {
    const { buildMotivationQuotes } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/i18n/content/buildMotivationQuotes") as typeof import("@/i18n/content/buildMotivationQuotes");
    return buildMotivationQuotes(locale);
  }, [locale]);
}

/** Loads only the catalog for the active tool (tips XOR motivation). */
export function useLocalizedCardQuotes(
  tool: SwipeableCardToolId,
): readonly MotivationQuote[] {
  const { locale } = useTranslation();
  return useMemo(() => {
    if (tool === "tips") {
      const { buildTipQuotes } =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("@/i18n/content/buildTipQuotes") as typeof import("@/i18n/content/buildTipQuotes");
      return buildTipQuotes(locale);
    }
    const { buildMotivationQuotes } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/i18n/content/buildMotivationQuotes") as typeof import("@/i18n/content/buildMotivationQuotes");
    return buildMotivationQuotes(locale);
  }, [locale, tool]);
}
