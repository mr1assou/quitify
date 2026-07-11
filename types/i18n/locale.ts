export const APP_LOCALES = ["en", "fr", "de", "es", "pt"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export type TranslationParams = Record<string, string | number>;
