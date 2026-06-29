import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
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
}: Props) {
  const { colors } = useTheme();
  const iconColor = accent === "secondary" ? colors.foreground : colors.white;

  return (
    <Animated.View
      entering={FadeInDown.duration(420).delay(delay).springify().damping(16)}
      className="flex-1"
    >
      <Card variant="section">
        <View
          className={`h-10 w-10 items-center justify-center rounded-2xl ${accentBg[accent]}`}
        >
          {iconSet === "materialCommunity" ? (
            <MaterialCommunityIcons name={icon as MciName} size={20} color={iconColor} />
          ) : (
            <Ionicons name={icon as IonName} size={20} color={iconColor} />
          )}
        </View>
        {display !== undefined ? (
          <Text className="mt-3 text-2xl font-bold text-foreground dark:text-d-text">
            {display}
          </Text>
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
    </Animated.View>
  );
}
