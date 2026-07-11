import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
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
  isAppLocale,
  languageMeta,
  LOCALE_STORAGE_KEY,
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

function resolveDeviceLocale(): AppLocale {
  const code = getLocales()[0]?.languageCode;
  if (isAppLocale(code)) return code;
  if (code === "ar") return DEFAULT_LOCALE;
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    const initial = resolveDeviceLocale();
    initQuitPlanLocale(initial);
    return initial;
  });

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE_KEY)
      .then((raw) => {
        const stored = normalizeStoredLocale(raw);
        if (stored == null) return;
        if (stored !== raw) {
          AsyncStorage.setItem(LOCALE_STORAGE_KEY, stored).catch(() => {});
        }
        initQuitPlanLocale(stored);
        setLocaleState(stored);
      })
      .catch(() => {});
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState((current) => {
      if (next === current) return current;
      setQuitPlanLocale(next);
      AsyncStorage.setItem(LOCALE_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
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
