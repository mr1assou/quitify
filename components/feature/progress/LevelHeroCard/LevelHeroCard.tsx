import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useTheme } from "@/context/ThemeContext";
import type { Level } from "@/types/progress/progress";
import { formatNumber } from "@/utils/shared/format";

type Props = {
  xp: number;
  level: Level;
};

export function LevelHeroCard({ xp, level }: Props) {
  const { colors } = useTheme();
  const xpDisplay = formatNumber(xp);
  const targetXp = level.next?.xpRequired ?? level.xpRequired;
  const targetDisplay = formatNumber(targetXp);

  return (
    <Animated.View entering={FadeIn.duration(420)}>
      <Card variant="section">
        <View className="items-center">
          <ProgressRing
            progress={level.progress}
            size={156}
            strokeWidth={12}
            color={colors.accent}
            trackColor={colors.border}
            openTop
          >
            <View className="items-center justify-center px-2">
              <Text className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Level
              </Text>
              <Text className="text-5xl font-bold tabular-nums text-foreground dark:text-d-text">
                {level.level}
              </Text>
              <Text className="mt-0.5 text-xs font-semibold text-foreground dark:text-d-text">
                {level.title}
              </Text>
            </View>
          </ProgressRing>

          <View className="mt-4 w-full flex-row items-center justify-center gap-2">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-accent">
              <Ionicons name="flash" size={14} color={colors.white} />
            </View>
            <Text className="text-base font-bold text-foreground dark:text-d-text">
              {xpDisplay}
              <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                {" / "}
                {targetDisplay}
              </Text>
              <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                {" Freedom points"}
              </Text>
            </Text>
          </View>

          <Text className="mt-2 text-center text-xs text-muted-foreground dark:text-d-muted">
            {level.next
              ? `${formatNumber(level.xpToNext)} Freedom points to ${level.next.title}`
              : "You've reached the top tier."}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}
