import type { CardOverlay } from "./types";

import tipsEn from "./cards/tips-en.json";
import motivationEn from "./cards/motivation-en.json";

import type { AppLocale } from "@/types/i18n/locale";

export function getCardOverlay(
  kind: "tips" | "motivation",
  _locale: AppLocale = "en",
): CardOverlay {
  return kind === "tips" ? tipsEn : motivationEn;
}
