import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import type { TodayMission } from "@/hooks/progress/useTodayMission";

type Props = {
  mission: TodayMission;
  onPress: () => void;
};

export function TodayMissionPreview({ mission, onPress }: Props) {
  const { colors } = useTheme();
  const { mission: m, completedCount, totalCount, progress, isComplete } = mission;

  return (
    <Animated.View entering={FadeIn.duration(450)}>
      <Pressable onPress={onPress} className="active:opacity-80">
        <Card variant="section">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className={`mr-3 h-10 w-10 items-center justify-center rounded-2xl ${
                  isComplete ? "bg-accent" : "bg-primary"
                }`}
              >
                <Ionicons
                  name={isComplete ? "checkmark" : "flag"}
                  size={18}
                  color={colors.white}
                />
              </View>
              <View>
                <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-d-muted">
                  Today&apos;s mission · Day {m.day}
                </Text>
                <Text className="text-base font-bold text-foreground dark:text-d-text">
                  {m.title}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
          </View>

          <View className="mt-4">
            <ProgressBar
              progress={progress}
              fillClassName={isComplete ? "bg-accent" : "bg-primary"}
            />
            <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
              {completedCount}/{totalCount} steps done
              {isComplete ? " · mission complete" : ""}
            </Text>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}
