import { GoalTargetScreen } from "@/components/feature/goals/GoalTargetScreen/GoalTargetScreen";
import { isGoalType } from "@/types/goals/goal";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function GoalTypeRoute() {
  const { type } = useLocalSearchParams<{ type: string }>();

  if (!type || !isGoalType(type)) {
    return <Redirect href="/goals" />;
  }

  return <GoalTargetScreen type={type} />;
}
