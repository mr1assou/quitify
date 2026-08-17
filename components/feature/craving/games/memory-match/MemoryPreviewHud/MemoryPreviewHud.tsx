import { Text, View } from "react-native";

import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  secondsLeft: number;
};

export function MemoryPreviewHud({ secondsLeft }: Props) {
  const { t } = useTranslation();

  return (
    <View className="items-center px-6 pb-3 pt-2">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        {t("craving.memorizeCards")}
      </Text>
      <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
        {t("craving.memorizeHint")}
      </Text>
      <Text className="mt-3 font-mono text-5xl font-bold tabular-nums text-accent">
        {secondsLeft}
      </Text>
    </View>
  );
}
