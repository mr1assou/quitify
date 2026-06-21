import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { ActiveGoalType, GoalsStateResponse } from "@/types/goals/goal";

export async function fetchGoalsState(): Promise<GoalsStateResponse> {
  const res = await authenticatedFetch("/auth/me/goals");

  if (!res.ok) {
    throw new Error("Could not load goals");
  }

  return res.json() as Promise<GoalsStateResponse>;
}

export async function setUserGoal(
  type: ActiveGoalType,
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

export async function deleteUserGoal(goalId: number): Promise<GoalsStateResponse> {
  const res = await authenticatedFetch(`/auth/me/goals/${goalId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "Could not delete goal");
  }

  return res.json() as Promise<GoalsStateResponse>;
}
