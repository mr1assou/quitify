import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ProgressRing } from "@/components/ui/ProgressRing";
import { useTheme } from "@/context/ThemeContext";
import type { RecoveryRingAccent, RecoveryRingIcon, ThemeColors } from "@/types";
import { progressToPercent } from "@/utils/progress/achievementProgress";

type IonName = ComponentProps<typeof Ionicons>["name"];
type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
  index: number;
  icon: RecoveryRingIcon;
  label: string;
  progress: number;
  accent: RecoveryRingAccent;
};

function accentColor(colors: ThemeColors, accent: RecoveryRingAccent) {
  switch (accent) {
    case "primary":
      return colors.primary;
    case "accent":
      return colors.accent;
    case "alert":
      return colors.alert;
  }
}

function RecoveryRingCenterIcon({
  icon,
  color,
  size,
}: {
  icon: RecoveryRingIcon;
  color: string;
  size: number;
}) {
  if (icon.family === "materialCommunity") {
    return (
      <MaterialCommunityIcons
        name={icon.name as MciName}
        size={size}
        color={color}
      />
    );
  }
  return <Ionicons name={icon.name as IonName} size={size} color={color} />;
}

const RING = { size: 108, stroke: 9 } as const;

export function RecoveryRingCard({ index, icon, label, progress, accent }: Props) {
  const { colors } = useTheme();
  const tint = accentColor(colors, accent);
  const pct = progressToPercent(progress);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 70).springify().damping(18)}
      className="min-w-0 flex-1 items-center"
    >
      <ProgressRing
        progress={progress}
        size={RING.size}
        strokeWidth={RING.stroke}
        color={tint}
        trackColor={colors.border}
      >
        <View className="items-center justify-center px-1">
          <RecoveryRingCenterIcon icon={icon} color={tint} size={24} />
          <Text className="mt-1 text-xl font-bold tabular-nums text-foreground dark:text-d-text">
            {pct}%
          </Text>
        </View>
      </ProgressRing>
      <Text
        className="mt-2.5 px-0.5 text-center text-sm font-semibold leading-snug text-foreground dark:text-d-text"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.82}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
