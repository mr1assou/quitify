import { Pressable, Text, View } from "react-native";

import { PROFILE_ACTIVITY_TABS } from "@/constants/community/profileActivityTabs";
import type { ProfileActivityTab } from "@/types/profile/profileActivity";

type Props = {
  value: ProfileActivityTab;
  onChange: (tab: ProfileActivityTab) => void;
};

export function UserProfileActivityTabs({ value, onChange }: Props) {
  return (
    <View className="flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {PROFILE_ACTIVITY_TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
              active ? "bg-section dark:bg-d-elevated" : ""
            }`}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={`text-xs font-semibold ${
                active
                  ? "text-foreground dark:text-d-text"
                  : "text-muted-foreground dark:text-d-muted"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
