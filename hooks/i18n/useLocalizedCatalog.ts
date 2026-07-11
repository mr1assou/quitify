import { useCallback } from "react";

import { useTranslation } from "@/hooks/i18n/useTranslation";
import {
  localizeCatalog,
  localizeCatalogItem,
  localizedLabel,
  type TranslateFn,
} from "@/utils/i18n/localizeCatalog";

export function useLocalizedCatalog() {
  const { t } = useTranslation();

  const translate: TranslateFn = useCallback(
    (key, params) => t(key as Parameters<typeof t>[0], params),
    [t],
  );

  return {
    t: translate,
    localize: <T extends { id: string }>(
      items: readonly T[],
      prefix: string,
      fields?: readonly string[],
    ) => localizeCatalog(items, prefix, translate, fields),
    localizeItem: <T extends { id: string }>(
      item: T,
      prefix: string,
      fields?: readonly string[],
    ) => localizeCatalogItem(item, prefix, translate, fields),
    label: (prefix: string, id: string, field = "label") =>
      localizedLabel(prefix, id, translate, field),
  };
}
