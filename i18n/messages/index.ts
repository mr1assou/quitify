import type { AppLocale } from "@/types/i18n/locale";

import { en, type TranslationMessages } from "./en";
import { fr } from "./fr";

export type { TranslationMessages } from "./en";

export function getMessages(locale: AppLocale = "en"): TranslationMessages {
  switch (locale) {
    case "fr":
      return fr;
    default:
      return en;
  }
}
