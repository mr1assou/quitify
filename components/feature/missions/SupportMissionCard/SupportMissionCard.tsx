import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { DailyMissionAccent, SupportMissionState, ThemeColors } from "@/types";

type Props = {
  mission: SupportMissionState;
  index: number;
};

const accentBg: Record<DailyMissionAccent, string> = {
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

export function SupportMissionCard({ mission, index }: Props) {
  const { colors } = useTheme();
  const tint = accentTint(colors, mission.accent);

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 60).springify().damping(18)}>
      <Card variant="section" className="flex-row items-center">
        <View
          className={`mr-3 h-10 w-10 items-center justify-center rounded-2xl ${
            mission.capped ? "bg-accent" : accentBg[mission.accent]
          }`}
        >
          <Ionicons
            name={mission.capped ? "checkmark" : mission.icon}
            size={18}
            color={colors.white}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground dark:text-d-text">
            {mission.title}
          </Text>
          <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
            {mission.current}/{mission.cap} today · +{mission.xpPerStep} FP each
          </Text>
        </View>
        <Text
          className="ml-2 text-xs font-bold uppercase tracking-wider"
          style={{ color: mission.capped ? colors.accent : tint }}
        >
          {mission.capped ? "Maxed" : `${mission.cap - mission.current} left`}
        </Text>
      </Card>
    </Animated.View>
  );
}
