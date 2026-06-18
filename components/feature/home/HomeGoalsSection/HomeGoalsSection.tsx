import { View } from "react-native";

import { ActiveGoalCard } from "@/components/feature/goals/ActiveGoalCard";
import { CreateGoalButton } from "@/components/feature/goals/CreateGoalButton";
import { HomeSectionTitle } from "@/components/feature/home/HomeSectionTitle";
import type { GoalProgressSnapshot, UserGoal } from "@/types/goals/goal";
import { computeGoalProgress } from "@/utils/goals/goalProgress";

type Props = {
  goals: UserGoal[];
  progress: GoalProgressSnapshot;
  currencySymbol: string;
  hasOpenGoalSlot: boolean;
  isLoadingGoals?: boolean;
  onPress: () => void;
};

export function HomeGoalsSection({
  goals,
  progress,
  currencySymbol,
  hasOpenGoalSlot,
  isLoadingGoals = false,
  onPress,
}: Props) {
  const showGoalCards = !isLoadingGoals && goals.length > 0;

  return (
    <View>
      <HomeSectionTitle title="Your goals" />
      {showGoalCards ? (
        <View className="gap-3">
          {goals.map((goal) => (
            <ActiveGoalCard
              key={goal.id}
              goal={goal}
              progress={computeGoalProgress(goal, progress)}
              currencySymbol={currencySymbol}
              onPress={onPress}
            />
          ))}
        </View>
      ) : null}
      {hasOpenGoalSlot ? (
        <View className={showGoalCards ? "mt-3" : undefined}>
          <CreateGoalButton onPress={onPress} />
        </View>
      ) : null}
    </View>
  );
}
