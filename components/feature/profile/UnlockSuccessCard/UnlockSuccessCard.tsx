import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  daysQuit: number;
  /** Total day target for the "success story" milestone (e.g. 180). */
  target?: number;
};

/**
 * Big motivational card pinned to the top of the profile menu — counts
 * progress toward a long-horizon "success story" badge (default: 180 days).
 */
export function UnlockSuccessCard({ daysQuit, target = 180 }: Props) {
  const { colors } = useTheme();
  const day = Math.floor(daysQuit);
  const progress = Math.min(1, day / target);

  return (
    <Card variant="section">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="trophy" size={20} color={colors.white} />
          </View>
          <View>
            <Text className="text-base font-bold text-foreground dark:text-d-text">Unlock success story</Text>
            <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
              Reach day {target} smoke-free.
            </Text>
          </View>
        </View>
        <Text className="text-xs font-semibold text-muted-foreground dark:text-d-muted">
          day {day}/{target}
        </Text>
      </View>
      <View className="mt-4">
        <ProgressBar progress={progress} />
      </View>
    </Card>
  );
}
