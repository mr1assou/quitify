import { Pressable, Text, View } from "react-native";

import {
  SAVED_CARDS_SECTIONS,
  type SavedCardsSection,
} from "@/constants/craving/savedCardsSections";

type Props = {
  value: SavedCardsSection;
  onChange: (section: SavedCardsSection) => void;
};

export function SavedCardsSectionTabs({ value, onChange }: Props) {
  return (
    <View className="flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {SAVED_CARDS_SECTIONS.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
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
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
