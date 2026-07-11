import { useMemo } from "react";

import { buildMotivationQuotes } from "@/i18n/content/buildMotivationQuotes";
import { buildTipQuotes } from "@/i18n/content/buildTipQuotes";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { SwipeableCardToolId } from "@/hooks/craving/useSwipeableCardSession";

export function useLocalizedTipQuotes() {
  const { locale } = useTranslation();
  return useMemo(() => buildTipQuotes(locale), [locale]);
}

export function useLocalizedMotivationQuotes() {
  const { locale } = useTranslation();
  return useMemo(() => buildMotivationQuotes(locale), [locale]);
}

export function useLocalizedCardQuotes(tool: SwipeableCardToolId) {
  const tips = useLocalizedTipQuotes();
  const motivation = useLocalizedMotivationQuotes();
  return tool === "tips" ? tips : motivation;
}
