import type { CardOverlay } from "./types";

import { getMotivationCardOverlay } from "@/i18n/content/motivationCardOverlays";
import { getTipCardOverlay } from "@/i18n/content/tipCardOverlays";
import type { AppLocale } from "@/types/i18n/locale";

/** Prefer tip/motivation-specific overlay modules for route-level code splitting. */
export function getCardOverlay(
  kind: "tips" | "motivation",
  locale: AppLocale = "en",
): CardOverlay {
  return kind === "tips"
    ? getTipCardOverlay(locale)
    : getMotivationCardOverlay(locale);
}
