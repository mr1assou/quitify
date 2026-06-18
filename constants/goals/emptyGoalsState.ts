import type { GoalsStateResponse } from "@/types/goals/goal";

export const EMPTY_GOALS_STATE: GoalsStateResponse = {
  currency: "USD",
  progress: {
    moneySaved: 0,
    smokeFreeDays: 0,
    cigarettesAvoided: 0,
  },
  goals: [],
  minTargets: {
    money_saved: 1,
    smoke_free_days: 1,
    cigarettes_avoided: 1,
  },
  strictMinTargets: false,
};
