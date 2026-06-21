import { getGoalTypeConfig } from "@/constants/goals/goals";
import type { ActiveGoalType, GoalType, UserGoal } from "@/types/goals/goal";
import { formatNumber } from "@/utils/shared/format";

export function formatGoalTitle(goal: UserGoal, currencySymbol = "$"): string {
  switch (goal.type) {
    case "money_saved":
      return `Save ${currencySymbol}${formatNumber(goal.target)}`;
    case "smoke_free_days":
      return `Stay smoke-free for ${goal.target} days`;
    case "cigarettes_avoided":
      return `Avoid ${formatNumber(goal.target)} cigarettes`;
  }
}

export function formatGoalProgressLabel(
  goal: UserGoal,
  current: number,
  currencySymbol = "$",
): string {
  switch (goal.type) {
    case "money_saved":
      return `${currencySymbol}${current.toLocaleString(undefined, {
        minimumFractionDigits: current < 100 ? 2 : 0,
        maximumFractionDigits: 2,
      })} / ${currencySymbol}${formatNumber(goal.target)}`;
    case "smoke_free_days":
      return `${current} / ${goal.target} days`;
    case "cigarettes_avoided":
      return `${formatNumber(current)} / ${formatNumber(goal.target)} cigarettes`;
  }
}

export function goalTargetHint(type: ActiveGoalType): string {
  switch (type) {
    case "smoke_free_days":
      return "Set your smoke-free day target. Money saved updates automatically.";
    case "cigarettes_avoided":
      return "Enter how many cigarettes you want to avoid on this attempt.";
  }
}

export function formatMinTargetError(type: ActiveGoalType, minTarget: number): string {
  switch (type) {
    case "smoke_free_days":
      return `Choose at least ${minTarget} days`;
    case "cigarettes_avoided":
      return `Enter at least ${formatNumber(minTarget)} cigarettes`;
  }
}

export function formatMinTargetLabel(type: ActiveGoalType, minTarget: number): string {
  switch (type) {
    case "smoke_free_days":
      return `Minimum: ${minTarget} days`;
    case "cigarettes_avoided":
      return `Minimum: ${formatNumber(minTarget)} cigarettes`;
  }
}

export function goalTypeIcon(type: GoalType): "flame" | "ban" | "cash" {
  if (type === "money_saved") return "cash";
  return getGoalTypeConfig(type).icon;
}
