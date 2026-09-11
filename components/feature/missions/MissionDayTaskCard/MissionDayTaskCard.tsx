import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { QuitPlanTaskType, ResolvedPlanTask } from "@/types";

type Props = {
  task: ResolvedPlanTask;
  index: number;
  interactive: boolean;
  onToggle: (taskId: string, value: boolean) => void;
};

const TASK_ICONS: Record<QuitPlanTaskType, keyof typeof Ionicons.glyphMap> = {
  action: "checkmark-circle-outline",
  breathing: "fitness",
  fact: "information-circle-outline",
  journal: "create-outline",
  game: "game-controller-outline",
  checkin: "pulse-outline",
  audio: "musical-notes-outline",
  reward: "ribbon-outline",
  social: "people-outline",
};

export function MissionDayTaskCard({ task, index, interactive, onToggle }: Props) {
  const { colors } = useTheme();
  const icon = TASK_ICONS[task.type] ?? "ellipse-outline";

  const onPress = () => {
    if (!interactive) return;
    onToggle(task.id, !task.done);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(320)}>
      <Pressable
        onPress={onPress}
        disabled={!interactive}
        className={interactive ? "active:opacity-85" : ""}
      >
        <Card
          variant="outline"
          className={task.done ? "border-accent/40 bg-accent/5 dark:bg-accent/10" : ""}
        >
          <View className="flex-row items-start">
            <View
              className={`mr-3 h-11 w-11 items-center justify-center rounded-2xl ${
                task.done ? "bg-accent" : "bg-section dark:bg-d-surface"
              }`}
            >
              {task.done ? (
                <Ionicons name="checkmark" size={20} color={colors.white} />
              ) : (
                <Ionicons
                  name={icon}
                  size={20}
                  color={task.done ? colors.white : colors.primary}
                />
              )}
            </View>

            <View className="min-w-0 flex-1">
              <Text
                className={`text-base font-semibold leading-5 ${
                  task.done
                    ? "text-muted-foreground line-through dark:text-d-muted"
                    : "text-foreground dark:text-d-text"
                }`}
              >
                {task.title}
              </Text>
              <Text className="mt-1 text-xs leading-4 text-muted-foreground dark:text-d-muted">
                {task.text}
              </Text>
            </View>

            {interactive ? (
              <View
                className={`ml-2 h-6 w-6 items-center justify-center rounded-full border-2 ${
                  task.done
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/40 dark:border-d-muted/50"
                }`}
              >
                {task.done ? (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                ) : null}
              </View>
            ) : null}
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}
