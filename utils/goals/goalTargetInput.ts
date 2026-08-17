import type { ActiveGoalType } from "@/types/goals/goal";

export function sanitizeGoalTargetInput(type: ActiveGoalType, raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

export function parseGoalTargetInput(type: ActiveGoalType, raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const value = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function isGoalTargetValid(
  type: ActiveGoalType,
  value: number,
  minTarget: number,
  maxTarget?: number | null,
): boolean {
  if (!Number.isInteger(value) || value < minTarget) return false;
  if (maxTarget != null && value > maxTarget) return false;
  return true;
}

export function goalTargetInputPlaceholder(type: ActiveGoalType): string {
  switch (type) {
    case "smoke_free_days":
      return "30";
    case "cigarettes_avoided":
      return "200";
  }
}
