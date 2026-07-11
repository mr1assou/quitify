import type { AppLocale, TranslationParams } from "@/types/i18n/locale";

import { getMessages, type TranslationMessages } from "./messages";
import { DEFAULT_LOCALE } from "@/constants/i18n/languages";

export type { TranslationMessages } from "./messages";

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? NestedKeyOf<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        : Prefix extends ""
          ? K
          : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationMessages>;

function getNested(messages: TranslationMessages, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    key in params ? String(params[key]) : "",
  );
}

export function createTranslator(locale: AppLocale) {
  const messages = getMessages(locale);
  const fallback = locale === DEFAULT_LOCALE ? null : getMessages(DEFAULT_LOCALE);

  return function t(key: TranslationKey | string, params?: TranslationParams): string {
    const value = getNested(messages, key) ?? (fallback ? getNested(fallback, key) : undefined);
    if (value == null) return key;
    return interpolate(value, params);
  };
}

export { getMessages };
