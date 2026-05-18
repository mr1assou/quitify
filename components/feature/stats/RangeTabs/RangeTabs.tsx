import { Pressable, Text, View } from "react-native";

import { RANGE_OPTIONS } from "@/constants/statsRanges";
import type { StatsRange } from "@/types/statsDashboard";

type Props = {
  value: StatsRange;
  onChange: (range: StatsRange) => void;
};

export function RangeTabs({ value, onChange }: Props) {
  return (
    <View className="flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {RANGE_OPTIONS.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            className={`flex-1 items-center justify-center rounded-xl py-2 ${
              active ? "bg-background dark:bg-d-elevated" : ""
            }`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={`text-xs font-semibold ${
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
