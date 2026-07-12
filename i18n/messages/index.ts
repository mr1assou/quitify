import type { AppLocale } from "@/types/i18n/locale";

import { en, type TranslationMessages } from "./en";

export type { TranslationMessages } from "./en";

export function getMessages(_locale: AppLocale = "en"): TranslationMessages {
  return en;
}
