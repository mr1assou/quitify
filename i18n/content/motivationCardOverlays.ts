import type { CardOverlay } from "./types";

import motivationEn from "./cards/motivation-en.json";
import motivationFr from "./cards/motivation-fr.json";

import type { AppLocale } from "@/types/i18n/locale";

/** Motivation overlays only — keep tips JSON out of the motivation route graph. */
export function getMotivationCardOverlay(locale: AppLocale = "en"): CardOverlay {
  return locale === "fr" ? motivationFr : motivationEn;
}
