import { Pressable, Text, View } from "react-native";

import { RANGE_OPTIONS, STATS_FILTER_OPTIONS } from "@/constants/stats/statsRanges";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/translate";
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

const FILTER_LABEL_KEY: Record<StatsFilterRange, TranslationKey> = {
  "7d": "stats.range7d",
  "30d": "stats.range30d",
  "90d": "stats.range90d",
  lifetime: "stats.rangeLifetime",
};

const CHART_LABEL_KEY: Record<StatsRange, TranslationKey> = {
  "7d": "stats.range7d",
  "30d": "stats.range30d",
  "90d": "stats.range90d",
};

export function RangeTabs(props: Props) {
  const { t } = useTranslation();
  const options =
    props.variant === "filter"
      ? STATS_FILTER_OPTIONS.map((opt) => ({
          id: opt.id,
          label: t(FILTER_LABEL_KEY[opt.id]),
        }))
      : RANGE_OPTIONS.map((opt) => ({
          id: opt.id,
          label: t(CHART_LABEL_KEY[opt.id]),
        }));

  return (
    <View className="flex-row rounded-2xl bg-section p-1 dark:bg-d-surface">
      {options.map((opt) => {
        const active = opt.id === props.value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => props.onChange(opt.id as never)}
            className={`flex-1 items-center justify-center rounded-xl py-2 ${
              active ? "bg-section dark:bg-d-elevated" : ""
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
