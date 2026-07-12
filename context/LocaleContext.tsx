import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { DEFAULT_LOCALE, languageMeta } from "@/constants/i18n/languages";
import { initQuitPlanLocale } from "@/i18n/content/quitPlanStore";
import { createTranslator } from "@/i18n/translate";
import type { AppLocale } from "@/types/i18n/locale";
import type { TranslationKey } from "@/i18n/translate";
import type { TranslationParams } from "@/types/i18n/locale";

export type { AppLocale } from "@/types/i18n/locale";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

initQuitPlanLocale(DEFAULT_LOCALE);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const t = useMemo(() => createTranslator(DEFAULT_LOCALE), []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t,
    }),
    [t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useTranslation() {
  const { locale, setLocale, t } = useLocale();
  return { locale, setLocale, t, language: languageMeta(locale) };
}
