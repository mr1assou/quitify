import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import { formatNumber } from "@/utils/format";

type Props = {
  xp: number;
};

export function FreedomPointsCard({ xp }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <Ionicons name="flash" size={26} color={colors.white} />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Freedom points
            </Text>
            <Text className="mt-0.5 text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
              {formatNumber(xp)}
            </Text>
            <Text className="mt-1 text-xs leading-5 text-muted-foreground dark:text-d-muted">
              From smoke-free days, resisted cravings, and completed missions.
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}
