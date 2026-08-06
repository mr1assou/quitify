import { Text } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

import { MissionPlanMap } from "@/components/feature/missions/MissionPlanMap";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { MissionPlan } from "@/hooks/progress/useMissionPlan";

type Props = {
  plan: MissionPlan;
  onSelectDay: (day: number) => void;
};

export function MissionPlanModuleSection({ plan, onSelectDay }: Props) {
  const { t } = useTranslation();

  return (
    <Animated.View
      key={plan.selectedModule}
      entering={FadeInRight.duration(380).springify().damping(22)}
      exiting={FadeOutLeft.duration(220)}
    >
      <Text className="mt-4 px-6 text-lg font-semibold text-foreground dark:text-d-text">
        {t("missions.moduleHeading", { n: plan.chapterNumber, name: plan.chapterName })}
      </Text>
      <Text className="mt-1 px-6 text-sm text-muted-foreground dark:text-d-muted">
        {plan.chapterRole}
      </Text>

      <MissionPlanMap
        days={plan.mapDays}
        currentDay={plan.currentDay}
        selectedDay={plan.selectedDay}
        onSelectDay={onSelectDay}
        onLockedDayPress={plan.showLockedDayMessage}
      />
    </Animated.View>
  );
}
