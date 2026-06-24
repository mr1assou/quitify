import { useCallback, useRef } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useGoals } from "@/context/GoalsContext";
import { usePlanContext } from "@/context/PlanContext";
import { mapAuthMeToSession } from "@/services/auth/loadUserSessionFromApi";
import { resetJourneyOnServer } from "@/services/auth/resetJourneyApi";
import { safeRouter } from "@/utils/app/safeRouter";

/** Wipes server + local quit progress while keeping the signed-in account. */
export function useResetJourney() {
  const { state, applyJourneyReset } = useApp();
  const { resetCommunity } = useCommunity();
  const { refresh: refreshGoals } = useGoals();
  const { refresh: refreshPlan } = usePlanContext();
  const resettingRef = useRef(false);

  return useCallback(async () => {
    if (resettingRef.current) return;
    resettingRef.current = true;

    try {
      const me = await resetJourneyOnServer();
      const session = mapAuthMeToSession(me, state.account);

      if (!session.profile || !session.account) {
        throw new Error("Could not load your profile after reset.");
      }

      applyJourneyReset(session);
      resetCommunity();
      await Promise.all([refreshPlan(), refreshGoals()]);
      safeRouter.replace("/(tabs)");
    } catch (error) {
      resettingRef.current = false;
      throw error;
    }
  }, [
    applyJourneyReset,
    refreshGoals,
    refreshPlan,
    resetCommunity,
    state.account,
  ]);
}
