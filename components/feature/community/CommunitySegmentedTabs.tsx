import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export type CommunitySection = "feed" | "post" | "search";

const TABS: { id: CommunitySection; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "feed", label: "Feed", icon: "newspaper-outline" },
  { id: "post", label: "Post", icon: "create-outline" },
  { id: "search", label: "Search", icon: "search-outline" },
];

type Props = {
  value: CommunitySection;
  onChange: (next: CommunitySection) => void;
};

export function CommunitySegmentedTabs({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View className="mx-6 mt-4 flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {TABS.map((tab) => {
        const active = tab.id === value;
        const fg = active ? colors.white : colors.mutedForeground;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            className="flex-1 flex-row items-center justify-center rounded-xl py-2"
            style={{ backgroundColor: active ? colors.primary : "transparent" }}
          >
            <Ionicons name={tab.icon} size={16} color={fg} />
            <Text className="ml-1.5 text-sm font-bold" style={{ color: fg }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
