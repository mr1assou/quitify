import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  languageMeta,
  normalizeStoredLocale,
} from "@/constants/i18n/languages";
import { initQuitPlanLocale, setQuitPlanLocale } from "@/i18n/content/quitPlanStore";
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
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        const stored = normalizeStoredLocale(raw);
        if (!cancelled && stored) {
          setLocaleState(stored);
          setQuitPlanLocale(stored);
        }
      } catch {
        // Keep DEFAULT_LOCALE until the user chooses.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    setQuitPlanLocale(next);
    void AsyncStorage.setItem(LOCALE_STORAGE_KEY, next).catch(() => {});
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
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
