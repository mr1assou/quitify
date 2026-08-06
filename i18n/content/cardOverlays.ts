import type { CardOverlay } from "./types";

import tipsEn from "./cards/tips-en.json";
import tipsFr from "./cards/tips-fr.json";
import motivationEn from "./cards/motivation-en.json";
import motivationFr from "./cards/motivation-fr.json";

import type { AppLocale } from "@/types/i18n/locale";

export function getCardOverlay(
  kind: "tips" | "motivation",
  locale: AppLocale = "en",
): CardOverlay {
  if (kind === "tips") {
    return locale === "fr" ? tipsFr : tipsEn;
  }
  return locale === "fr" ? motivationFr : motivationEn;
}
