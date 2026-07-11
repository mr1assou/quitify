import type { TranslationMessages } from "./en";

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export type LocaleOverlay = DeepPartial<TranslationMessages>;

type MessageTree = Record<string, string | Record<string, unknown>>;

function isMessageTree(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMergeSection(base: MessageTree, overlay: MessageTree): MessageTree {
  const result: MessageTree = { ...base };

  for (const key of Object.keys(overlay)) {
    const overlayValue = overlay[key];
    const baseValue = base[key];

    if (isMessageTree(overlayValue) && isMessageTree(baseValue)) {
      result[key] = deepMergeSection(baseValue, overlayValue);
    } else if (typeof overlayValue === "string") {
      result[key] = overlayValue;
    }
  }

  return result;
}

export function mergeMessages(base: TranslationMessages, overlay: LocaleOverlay): TranslationMessages {
  const result = { ...base } as MessageTree;

  for (const section of Object.keys(overlay) as (keyof TranslationMessages)[]) {
    const overlaySection = overlay[section];
    if (overlaySection == null) continue;

    const baseSection = base[section];
    if (!isMessageTree(baseSection) || !isMessageTree(overlaySection)) continue;

    result[section] = deepMergeSection(baseSection, overlaySection);
  }

  return result as TranslationMessages;
}
