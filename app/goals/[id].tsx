import { GoalManageScreen } from "@/components/feature/goals/GoalManageScreen";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function GoalManageRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const goalId = Number.parseInt(id ?? "", 10);

  if (!Number.isFinite(goalId)) {
    return <Redirect href="/(tabs)" />;
  }

  return <GoalManageScreen goalId={goalId} />;
}
