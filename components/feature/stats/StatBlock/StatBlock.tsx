import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";

type Accent = "primary" | "accent" | "alert" | "secondary";
type IonName = ComponentProps<typeof Ionicons>["name"];
type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
  label: string;
  value: number;
  display?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  icon: IonName | MciName;
  iconSet?: "ionicons" | "materialCommunity";
  accent?: Accent;
  delay?: number;
  locked?: boolean;
  onLockedPress?: () => void;
};

const accentBg: Record<Accent, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  alert: "bg-alert",
  secondary: "bg-secondary dark:bg-primary",
};

export function StatBlock({
  label,
  value,
  display,
  decimals = 0,
  prefix,
  suffix,
  icon,
  iconSet = "ionicons",
  accent = "primary",
  delay = 0,
  locked = false,
  onLockedPress,
}: Props) {
  const { colors } = useTheme();
  const iconColor = accent === "secondary" ? colors.foreground : colors.white;

  const card = (
    <Card variant="section">
      <View className="relative">
        <View
          className={`h-10 w-10 items-center justify-center rounded-2xl ${accentBg[accent]} ${
            locked ? "opacity-45" : ""
          }`}
        >
          {iconSet === "materialCommunity" ? (
            <MaterialCommunityIcons name={icon as MciName} size={20} color={iconColor} />
          ) : (
            <Ionicons name={icon as IonName} size={20} color={iconColor} />
          )}
        </View>
        {locked ? (
          <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-primary">
            <Ionicons name="lock-closed" size={10} color="#fff" />
          </View>
        ) : null}
      </View>
      {locked ? (
        <Text className="mt-3 text-2xl font-bold text-muted-foreground dark:text-d-muted">—</Text>
      ) : display !== undefined ? (
        <Text className="mt-3 text-2xl font-bold text-foreground dark:text-d-text">{display}</Text>
      ) : (
        <AnimatedNumber
          value={value}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          className="mt-3 text-2xl font-bold text-foreground dark:text-d-text"
        />
      )}
      <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">{label}</Text>
    </Card>
  );

  return (
    <Animated.View
      entering={FadeInDown.duration(420).delay(delay).springify().damping(16)}
      className="flex-1"
    >
      {locked ? (
        <Pressable
          onPress={onLockedPress}
          accessibilityRole="button"
          accessibilityLabel={`${label}, VIP feature. Tap to unlock.`}
          className="active:opacity-90"
        >
          {card}
        </Pressable>
      ) : (
        card
      )}
    </Animated.View>
  );
}
