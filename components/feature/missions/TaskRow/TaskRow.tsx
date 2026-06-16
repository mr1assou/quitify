import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import type { ResolvedTask } from "@/hooks/progress/useTodayMission";

type Props = {
  task: ResolvedTask;
  onToggle: (taskId: string, value: boolean) => void;
};

export function TaskRow({ task, onToggle }: Props) {
  const { colors } = useTheme();
  const interactive = task.type === "manual";

  const onPress = () => {
    if (!interactive) return;
    Haptics.selectionAsync().catch(() => {});
    onToggle(task.id, !task.done);
  };

  return (
    <Animated.View layout={LinearTransition.springify().damping(18)}>
      <Pressable
        onPress={onPress}
        disabled={!interactive}
        className={`flex-row items-center rounded-2xl bg-background p-3 dark:bg-d-elevated ${
          interactive ? "active:opacity-70" : ""
        }`}
      >
        <View
          className={`mr-3 h-7 w-7 items-center justify-center rounded-full ${
            task.done ? "bg-accent" : "bg-section dark:bg-d-surface"
          }`}
        >
          {task.done ? (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          ) : null}
        </View>
        <Text
          className={`flex-1 text-sm ${
            task.done
              ? "text-muted-foreground line-through dark:text-d-muted"
              : "text-foreground dark:text-d-text"
          }`}
        >
          {task.label}
        </Text>
        {!interactive ? (
          <Text className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground dark:text-d-muted">
            auto
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}
