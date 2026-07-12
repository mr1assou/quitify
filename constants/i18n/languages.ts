import type { AppLocale } from "@/types/i18n/locale";

export type LanguageMeta = {
  id: AppLocale;
  /** Endonym shown in pickers (always native script). */
  nativeName: string;
  shortLabel: string;
};

export const LANGUAGES: readonly LanguageMeta[] = [
  { id: "en", nativeName: "English", shortLabel: "EN" },
] as const;

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_STORAGE_KEY = "@quit_smoking/app_locale";

export function isAppLocale(value: unknown): value is AppLocale {
  return value === "en";
}

export function languageMeta(locale: AppLocale): LanguageMeta {
  return LANGUAGES.find((l) => l.id === locale) ?? LANGUAGES[0];
}

/** Any previously stored non-English locale maps back to English. */
export function normalizeStoredLocale(value: unknown): AppLocale | null {
  if (isAppLocale(value)) return value;
  if (typeof value === "string" && value.length > 0) return DEFAULT_LOCALE;
  return null;
}
