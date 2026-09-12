import type { CardOverlay } from "./types";

import tipsEn from "./cards/tips-en.json";
import tipsFr from "./cards/tips-fr.json";

import type { AppLocale } from "@/types/i18n/locale";

/** Tips overlays only — keep motivation JSON out of the tips route graph. */
export function getTipCardOverlay(locale: AppLocale = "en"): CardOverlay {
  return locale === "fr" ? tipsFr : tipsEn;
}
