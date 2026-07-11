import { Pressable, Text, View } from "react-native";

import { ACHIEVEMENT_SECTIONS } from "@/constants/progress/achievementSections";
import type { AchievementSection } from "@/constants/progress/achievementSections";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  value: AchievementSection;
  onChange: (section: AchievementSection) => void;
};

const SECTION_LABEL_KEYS = {
  rank: "achievements.tabRank",
  badges: "achievements.tabBadges",
} as const satisfies Record<AchievementSection, "achievements.tabRank" | "achievements.tabBadges">;

export function AchievementSectionTabs({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View className="flex-row rounded-2xl bg-elevated p-1 dark:bg-d-surface">
      {ACHIEVEMENT_SECTIONS.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
              active ? "bg-section dark:bg-d-elevated" : ""
            }`}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={`text-sm font-semibold ${
                active
                  ? "text-foreground dark:text-d-text"
                  : "text-muted-foreground dark:text-d-muted"
              }`}
            >
              {t(SECTION_LABEL_KEYS[opt.id])}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
