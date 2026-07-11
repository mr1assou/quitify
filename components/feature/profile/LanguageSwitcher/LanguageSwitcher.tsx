import { useState } from "react";

import { LanguagePickerSheet } from "@/components/i18n/LanguagePickerSheet";
import { ListGroup } from "@/components/ui/ListGroup";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export function LanguageSwitcher() {
  const { t, language } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListGroup
        rows={[
          {
            id: "language",
            icon: "language-outline",
            label: t("settings.language"),
            value: language.nativeName,
            onPress: () => setOpen(true),
          },
        ]}
      />
      <LanguagePickerSheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
