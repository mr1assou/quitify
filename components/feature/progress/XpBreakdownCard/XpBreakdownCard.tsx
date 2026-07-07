import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  XP_PER_COMPLETED_MISSION,
  XP_PER_RESISTED_CRAVING,
  XP_PER_SMOKE_FREE_DAY,
} from "@/constants/progress/levels";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import { formatNumber } from "@/utils/shared/format";

type Props = {
  smokeFreeDays: number;
  resistedCravings: number;
  completedMissions: number;
};

type Row = {
  id: string;
  icon: "leaf" | "shield-checkmark" | "flag";
  label: string;
  count: number;
  perEach: number;
};

export function XpBreakdownCard({
  smokeFreeDays,
  resistedCravings,
  completedMissions,
}: Props) {
  const { colors } = useTheme();
  const days = Math.max(0, Math.floor(smokeFreeDays));

  const rows: Row[] = [
    {
      id: "days",
      icon: "leaf",
      label: "Smoke-free days",
      count: days,
      perEach: XP_PER_SMOKE_FREE_DAY,
    },
    {
      id: "cravings",
      icon: "shield-checkmark",
      label: "Cravings resisted",
      count: resistedCravings,
      perEach: XP_PER_RESISTED_CRAVING,
    },
    {
      id: "missions",
      icon: "flag",
      label: "Missions completed",
      count: completedMissions,
      perEach: XP_PER_COMPLETED_MISSION,
    },
  ];

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          How you earned Freedom points
        </Text>

        <View className="mt-3 gap-2">
          {rows.map((row) => (
            <View
              key={row.id}
              className="flex-row items-center rounded-2xl bg-elevated p-3 dark:bg-d-elevated"
            >
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-2xl bg-primary">
                <Ionicons name={row.icon} size={16} color={colors.white} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground dark:text-d-text">
                  {row.label}
                </Text>
                <Text className="text-xs text-muted-foreground dark:text-d-muted">
                  {row.count} × {row.perEach} FP
                </Text>
              </View>
              <Text className="text-sm font-bold tabular-nums text-foreground dark:text-d-text">
                +{formatNumber(row.count * row.perEach)}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}
