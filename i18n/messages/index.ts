import type { AppLocale } from "@/types/i18n/locale";

import { de } from "./locales/de";
import { en, type TranslationMessages } from "./en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { mergeMessages, type LocaleOverlay } from "./merge";
import { pt } from "./locales/pt";

export type { TranslationMessages } from "./en";
export type { LocaleOverlay } from "./merge";

const LOCALE_OVERLAYS: Record<Exclude<AppLocale, "en">, LocaleOverlay> = {
  fr,
  de,
  es,
  pt,
};

export function getMessages(locale: AppLocale): TranslationMessages {
  if (locale === "en") return en;
  return mergeMessages(en, LOCALE_OVERLAYS[locale] ?? {});
}
