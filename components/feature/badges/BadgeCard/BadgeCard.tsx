import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { Badge } from "@/types";

type Props = {
  badge: Badge;
  unlocked: boolean;
  delay?: number;
};

export function BadgeCard({ badge, unlocked, delay = 0 }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(400).delay(delay)} className="flex-1">
      <Card
        variant={unlocked ? "section" : "outline"}
        className={unlocked ? "" : "opacity-60"}
      >
        <View
          className={`mb-3 h-12 w-12 items-center justify-center rounded-2xl ${
            unlocked ? badge.accent : "bg-section dark:bg-d-elevated"
          }`}
        >
          <Ionicons
            name={unlocked ? "ribbon" : "lock-closed"}
            size={22}
            color={unlocked ? colors.white : colors.mutedForeground}
          />
        </View>
        <Text className="text-base font-bold text-foreground dark:text-d-text" numberOfLines={1}>
          {badge.name}
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted" numberOfLines={2}>
          {badge.description}
        </Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-d-muted">
            Day {badge.daysRequired}
          </Text>
          {badge.premium ? (
            <View className="rounded-full bg-primary px-2 py-0.5">
              <Text className="text-[10px] font-bold uppercase text-white">Premium</Text>
            </View>
          ) : null}
        </View>
      </Card>
    </Animated.View>
  );
}
