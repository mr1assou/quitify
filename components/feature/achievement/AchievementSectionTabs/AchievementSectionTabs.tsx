import { Pressable, Text, View } from "react-native";

import { ACHIEVEMENT_SECTIONS } from "@/constants/achievementSections";
import type { AchievementSection } from "@/constants/achievementSections";

type Props = {
  value: AchievementSection;
  onChange: (section: AchievementSection) => void;
};

export function AchievementSectionTabs({ value, onChange }: Props) {
  return (
    <View className="flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {ACHIEVEMENT_SECTIONS.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
              active ? "bg-background dark:bg-d-elevated" : ""
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
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
