import type { CardOverlay } from "./types";

import tipsDe from "./cards/tips-de.json";
import tipsEn from "./cards/tips-en.json";
import tipsEs from "./cards/tips-es.json";
import tipsFr from "./cards/tips-fr.json";
import tipsPt from "./cards/tips-pt.json";
import motivationDe from "./cards/motivation-de.json";
import motivationEn from "./cards/motivation-en.json";
import motivationEs from "./cards/motivation-es.json";
import motivationFr from "./cards/motivation-fr.json";
import motivationPt from "./cards/motivation-pt.json";

import type { AppLocale } from "@/types/i18n/locale";

const TIPS: Record<AppLocale, CardOverlay> = {
  en: tipsEn,
  fr: tipsFr,
  de: tipsDe,
  es: tipsEs,
  pt: tipsPt,
};

const MOTIVATION: Record<AppLocale, CardOverlay> = {
  en: motivationEn,
  fr: motivationFr,
  de: motivationDe,
  es: motivationEs,
  pt: motivationPt,
};

export function getCardOverlay(
  kind: "tips" | "motivation",
  locale: AppLocale,
): CardOverlay {
  const table = kind === "tips" ? TIPS : MOTIVATION;
  return table[locale] ?? table.en;
}
