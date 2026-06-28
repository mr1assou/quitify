import { useCallback } from "react";

import { PLAN_PREVIEW_UNLOCK_ALL } from "@/config/plan";
import { useMissionPlan } from "@/hooks/progress/useMissionPlan";
import { safeRouter } from "@/utils/app/safeRouter";

export function useOpenPlanDay() {
  const plan = useMissionPlan();

  const openDay = useCallback(
    (day: number) => {
      if (!PLAN_PREVIEW_UNLOCK_ALL && day > plan.unlockedThroughDay) {
        plan.showLockedDayMessage(day);
        return;
      }

      plan.selectDay(day);
      safeRouter.pushStack({
        pathname: "/plan-day/[day]",
        params: { day: String(day) },
      });
    },
    [plan],
  );

  return {
    openDay,
    lockedDayModal: plan.lockedDayModal,
    closeLockedDayModal: plan.closeLockedDayModal,
  };
}
