import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  noteCount: number;
  onPress: () => void;
};

export function MissionPlanNotesButton({ noteCount, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("missions.yourNotes")}
      className="flex-row items-center gap-1.5 rounded-full border border-border/50 bg-section px-3 py-2 active:opacity-80 dark:border-d-border/60 dark:bg-d-surface"
    >
      <Ionicons name="document-text-outline" size={15} color={colors.primary} />
      <Text className="text-xs font-semibold text-foreground dark:text-d-text">
        {t("missions.yourNotes")}
      </Text>
      {noteCount > 0 ? (
        <View className="min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1">
          <Text className="text-[10px] font-bold leading-none text-white">
            {noteCount > 99 ? "99+" : noteCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
