import { Alert } from "react-native";

import { GOAL_DAYS_AHEAD_INFO } from "@/constants/goals/goalDaysAheadInfo";

export function showGoalDaysAheadInfo(daysAhead?: number) {
  const parts = [GOAL_DAYS_AHEAD_INFO.tiersSection, GOAL_DAYS_AHEAD_INFO.fpSection];

  if (daysAhead != null && daysAhead > 0) {
    parts.push(GOAL_DAYS_AHEAD_INFO.fpExampleForDays(daysAhead));
  }

  Alert.alert(GOAL_DAYS_AHEAD_INFO.title, parts.join("\n\n"));
}
