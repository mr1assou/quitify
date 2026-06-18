import { getGoalTypeConfig } from "@/constants/goals/goals";
import type { UserGoal } from "@/types/goals/goal";
import { formatNumber } from "@/utils/shared/format";

export function formatGoalTitle(goal: UserGoal, currencySymbol = "$"): string {
  const config = getGoalTypeConfig(goal.type);

  switch (goal.type) {
    case "money_saved":
      return `Save ${currencySymbol}${formatNumber(goal.target)}`;
    case "smoke_free_days":
      return `Stay smoke-free for ${goal.target} days`;
    case "cigarettes_avoided":
      return `Avoid ${formatNumber(goal.target)} cigarettes`;
    default:
      return config.title;
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

export function formatGoalTargetLabel(
  type: UserGoal["type"],
  target: number,
  currencySymbol = "$",
): string {
  switch (type) {
    case "money_saved":
      return `${currencySymbol}${formatNumber(target)}`;
    case "smoke_free_days":
      return `${target} days`;
    case "cigarettes_avoided":
      return `${formatNumber(target)} cigarettes`;
  }
}

export function goalTargetHint(type: UserGoal["type"], strictMinTargets: boolean): string {
  if (!strictMinTargets) {
    return "Choose any target ahead of where you are now.";
  }

  switch (type) {
    case "money_saved":
      return "Enter how much you want to save on this attempt.";
    case "smoke_free_days":
      return "Enter how many smoke-free days you are aiming for.";
    case "cigarettes_avoided":
      return "Enter how many cigarettes you want to avoid.";
  }
}

export function formatMinTargetError(
  type: UserGoal["type"],
  minTarget: number,
  currencySymbol = "$",
  strictMinTargets = true,
): string {
  if (!strictMinTargets) {
    return "Must be ahead of your current progress.";
  }

  switch (type) {
    case "money_saved":
      return `Enter at least ${currencySymbol}${formatNumber(minTarget)}`;
    case "smoke_free_days":
      return `Enter at least ${minTarget} days`;
    case "cigarettes_avoided":
      return `Enter at least ${formatNumber(minTarget)} cigarettes`;
  }
}

export function formatMinTargetLabel(
  type: UserGoal["type"],
  minTarget: number,
  currencySymbol = "$",
  strictMinTargets = true,
): string {
  if (!strictMinTargets) {
    return "Any target ahead of your current progress";
  }

  switch (type) {
    case "money_saved":
      return `Minimum: ${currencySymbol}${formatNumber(minTarget)}`;
    case "smoke_free_days":
      return `Minimum: ${minTarget} days`;
    case "cigarettes_avoided":
      return `Minimum: ${formatNumber(minTarget)} cigarettes`;
  }
}
