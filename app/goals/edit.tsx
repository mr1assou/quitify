import { GoalTargetScreen } from "@/components/feature/goals/GoalTargetScreen";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function GoalEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const goalId = Number.parseInt(id ?? "", 10);

  if (!Number.isFinite(goalId)) {
    return <Redirect href="/(tabs)" />;
  }

  return <GoalTargetScreen mode="edit" goalId={goalId} />;
}
