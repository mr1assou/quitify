import { ActivityIndicator, View } from "react-native";

import { ActiveGoalCard } from "@/components/feature/goals/ActiveGoalCard";
import { CreateGoalButton } from "@/components/feature/goals/CreateGoalButton";
import { HomeSectionTitle } from "@/components/feature/home/HomeSectionTitle";
import type { GoalProgressSnapshot, UserGoal } from "@/types/goals/goal";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { computeGoalProgress } from "@/utils/goals/goalProgress";

type Props = {
  goals: UserGoal[];
  progress: GoalProgressSnapshot;
  currencySymbol: string;
  hasOpenGoalSlot: boolean;
  isLoadingGoals?: boolean;
  onCreateGoal: () => void;
  onGoalPress: (goal: UserGoal) => void;
};

export function HomeGoalsSection({
  goals,
  progress,
  currencySymbol,
  hasOpenGoalSlot,
  isLoadingGoals = false,
  onCreateGoal,
  onGoalPress,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const showGoalCards = !isLoadingGoals && goals.length > 0;

  return (
    <View>
      <HomeSectionTitle title={t("home.goalsTitle")} />
      {isLoadingGoals ? (
        <View className="min-h-[88px] items-center justify-center rounded-3xl bg-section py-8 dark:bg-d-surface">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : null}
      {showGoalCards ? (
        <View className="gap-3">
          {goals.map((goal) => (
            <ActiveGoalCard
              key={goal.id}
              goal={goal}
              progress={computeGoalProgress(goal, progress)}
              currencySymbol={currencySymbol}
              onPress={() => onGoalPress(goal)}
            />
          ))}
        </View>
      ) : null}
      {hasOpenGoalSlot && !isLoadingGoals ? (
        <View className={showGoalCards ? "mt-3" : undefined}>
          <CreateGoalButton onPress={onCreateGoal} />
        </View>
      ) : null}
    </View>
  );
}
