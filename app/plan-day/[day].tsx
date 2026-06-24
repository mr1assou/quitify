import { Redirect, useLocalSearchParams } from "expo-router";

import { MissionDayTasksScreen } from "@/components/feature/missions/MissionDayTasksScreen";
import { PLAN_TOTAL_DAYS } from "@/constants/progress/plan";

export default function PlanDayRoute() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const missionDay = Number.parseInt(day ?? "", 10);

  if (!Number.isFinite(missionDay) || missionDay < 1 || missionDay > PLAN_TOTAL_DAYS) {
    return <Redirect href="/(tabs)/missions" />;
  }

  return <MissionDayTasksScreen missionDay={missionDay} />;
}
