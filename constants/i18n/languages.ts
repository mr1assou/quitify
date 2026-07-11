import type { AppLocale } from "@/types/i18n/locale";

export type LanguageMeta = {
  id: AppLocale;
  /** Endonym shown in pickers (always native script). */
  nativeName: string;
  shortLabel: string;
};

export const LANGUAGES: readonly LanguageMeta[] = [
  { id: "en", nativeName: "English", shortLabel: "EN" },
  { id: "fr", nativeName: "Français", shortLabel: "FR" },
  { id: "de", nativeName: "Deutsch", shortLabel: "DE" },
  { id: "es", nativeName: "Español", shortLabel: "ES" },
  { id: "pt", nativeName: "Português", shortLabel: "PT" },
] as const;

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_STORAGE_KEY = "@quit_smoking/app_locale";

export function isAppLocale(value: unknown): value is AppLocale {
  return (
    value === "en" ||
    value === "fr" ||
    value === "de" ||
    value === "es" ||
    value === "pt"
  );
}

export function languageMeta(locale: AppLocale): LanguageMeta {
  return LANGUAGES.find((l) => l.id === locale) ?? LANGUAGES[0];
}

/** Legacy locale codes removed from the app map back to the default. */
export function normalizeStoredLocale(value: unknown): AppLocale | null {
  if (isAppLocale(value)) return value;
  if (value === "ar") return DEFAULT_LOCALE;
  return null;
}
