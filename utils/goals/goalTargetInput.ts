import type { GoalType } from "@/types/goals/goal";

export function sanitizeGoalTargetInput(type: GoalType, raw: string): string {
  if (type === "money_saved") {
    const cleaned = raw.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
    const [whole, ...rest] = cleaned.split(".");
    if (rest.length === 0) return whole;
    return `${whole}.${rest.join("")}`;
  }

  return raw.replace(/[^0-9]/g, "");
}

export function parseGoalTargetInput(type: GoalType, raw: string): number | null {
  const trimmed = raw.trim().replace(",", ".");
  if (!trimmed) return null;

  const value = Number.parseFloat(trimmed);
  if (!Number.isFinite(value) || value <= 0) return null;

  if (type === "money_saved") return value;

  if (!Number.isInteger(value)) return null;
  return value;
}

export function isGoalTargetValid(
  type: GoalType,
  value: number,
  minTarget: number,
): boolean {
  if (type === "money_saved") return value >= minTarget;
  return Number.isInteger(value) && value >= minTarget;
}

export function goalTargetInputPlaceholder(type: GoalType): string {
  switch (type) {
    case "money_saved":
      return "0.00";
    case "smoke_free_days":
      return "30";
    case "cigarettes_avoided":
      return "200";
  }
}
