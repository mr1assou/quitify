import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { GoalType, GoalsStateResponse } from "@/types/goals/goal";

export async function fetchGoalsState(): Promise<GoalsStateResponse> {
  const res = await authenticatedFetch("/auth/me/goals");

  if (!res.ok) {
    throw new Error("Could not load goals");
  }

  return res.json() as Promise<GoalsStateResponse>;
}

export async function setUserGoal(
  type: GoalType,
  target: number,
): Promise<GoalsStateResponse> {
  const res = await authenticatedFetch("/auth/me/goals", {
    method: "PUT",
    body: JSON.stringify({ type, target }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "Could not save goal");
  }

  return res.json() as Promise<GoalsStateResponse>;
}
