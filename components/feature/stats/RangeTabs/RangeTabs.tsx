import { Pressable, Text, View } from "react-native";

import { RANGE_OPTIONS, STATS_FILTER_OPTIONS } from "@/constants/stats/statsRanges";
import type { StatsRange } from "@/types/stats/statsDashboard";
import type { StatsFilterRange } from "@/types/stats/userStats";

type FilterProps = {
  variant: "filter";
  value: StatsFilterRange;
  onChange: (range: StatsFilterRange) => void;
};

type ChartProps = {
  variant?: "chart";
  value: StatsRange;
  onChange: (range: StatsRange) => void;
};

type Props = FilterProps | ChartProps;

export function RangeTabs(props: Props) {
  const options =
    props.variant === "filter"
      ? STATS_FILTER_OPTIONS
      : RANGE_OPTIONS.map((opt) => ({ id: opt.id, label: opt.label }));

  return (
    <View className="flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {options.map((opt) => {
        const active = opt.id === props.value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => props.onChange(opt.id as never)}
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
