import type { TranslationParams } from "@/types/i18n/locale";

export type TranslateFn = (key: string, params?: TranslationParams) => string;

export function localizeCatalog<T extends { id: string }>(
  items: readonly T[],
  prefix: string,
  t: TranslateFn,
  fields: readonly string[] = ["label"],
): T[] {
  return items.map((item) => localizeCatalogItem(item, prefix, t, fields));
}

export function localizeCatalogItem<T extends { id: string }>(
  item: T,
  prefix: string,
  t: TranslateFn,
  fields: readonly string[] = ["label"],
): T {
  const next = { ...item };

  for (const field of fields) {
    const value = (item as Record<string, unknown>)[field];
    if (typeof value !== "string") continue;

    const key = `${prefix}.${item.id}.${field}`;
    const translated = t(key);
    if (translated !== key) {
      (next as Record<string, unknown>)[field] = translated;
    }
  }

  return next;
}

export function localizedLabel(
  prefix: string,
  id: string,
  t: TranslateFn,
  field = "label",
): string {
  const key = `${prefix}.${id}.${field}`;
  const translated = t(key);
  return translated === key ? id : translated;
}
