import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import type { AutoMissionState, DailyMissionAccent, ThemeColors } from "@/types";

type Props = {
  mission: AutoMissionState;
  index: number;
};

const accentBg: Record<DailyMissionAccent, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  alert: "bg-alert",
};

const accentBar: Record<DailyMissionAccent, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  alert: "bg-alert",
};

function accentTint(colors: ThemeColors, accent: DailyMissionAccent) {
  switch (accent) {
    case "primary":
      return colors.primary;
    case "accent":
      return colors.accent;
    case "alert":
      return colors.alert;
  }
}

function formatValue(value: number) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

export function AutoMissionCard({ mission, index }: Props) {
  const { colors } = useTheme();
  const tint = accentTint(colors, mission.accent);
  const iconBg = mission.done ? "bg-accent" : accentBg[mission.accent];
  const barClass = mission.done ? "bg-accent" : accentBar[mission.accent];

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 70).springify().damping(18)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View
            className={`mr-3 h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}
          >
            <Ionicons
              name={mission.done ? "checkmark" : mission.icon}
              size={20}
              color={colors.white}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground dark:text-d-text">
              {mission.title}
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
              {formatValue(mission.current)} {mission.unitLabel}
            </Text>
          </View>
          <Text
            className="ml-2 text-sm font-bold tabular-nums"
            style={{ color: tint }}
          >
            {Math.round(mission.progress * 100)}%
          </Text>
        </View>

        <View className="mt-3">
          <ProgressBar progress={mission.progress} fillClassName={barClass} />
        </View>

        <Text className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground dark:text-d-muted">
          Auto · tracked from your activity
        </Text>
      </Card>
    </Animated.View>
  );
}
