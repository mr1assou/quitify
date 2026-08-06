import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { TaskRow } from "@/components/feature/missions/TaskRow";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { TodayMission } from "@/hooks/progress/useTodayMission";

type Props = {
  mission: TodayMission;
};

export function MissionCard({ mission }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { day, title, intro, tasks, completedCount, totalCount, progress, isComplete, toggleTask } =
    mission;

  return (
    <Animated.View entering={FadeIn.duration(450)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View
            className={`mr-3 h-12 w-12 items-center justify-center rounded-2xl ${
              isComplete ? "bg-accent" : "bg-primary"
            }`}
          >
            <Ionicons
              name={isComplete ? "trophy" : "flag"}
              size={22}
              color={colors.white}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-d-muted">
              {t("missions.dayShort", { day })} ·{" "}
              {isComplete ? t("missions.missionComplete") : t("missions.missionOfDay")}
            </Text>
            <Text className="mt-0.5 text-lg font-bold text-foreground dark:text-d-text">
              {title}
            </Text>
          </View>
        </View>

        <Text className="mt-3 text-sm text-muted-foreground dark:text-d-muted">{intro}</Text>

        <View className="mt-4">
          <ProgressBar
            progress={progress}
            fillClassName={isComplete ? "bg-accent" : "bg-primary"}
          />
          <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
            {t("missions.stepsDone", { done: completedCount, total: totalCount })}
          </Text>
        </View>

        <View className="mt-4 gap-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}
