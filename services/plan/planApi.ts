import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { PlanState } from "@/types/plan/planState";
import { getDeviceTimezone } from "@/utils/device/getDeviceTimezone";

function planRequestHeaders(): Record<string, string> {
  return { "X-Timezone": getDeviceTimezone() };
}

export async function fetchPlanState(): Promise<PlanState> {
  const res = await authenticatedFetch("/auth/me/plan", {
    headers: planRequestHeaders(),
  });
  if (!res.ok) {
    throw new Error("Could not load plan progress");
  }
  return (await res.json()) as PlanState;
}

export async function togglePlanTask(
  planDay: number,
  taskId: string,
  done: boolean,
): Promise<PlanState> {
  const res = await authenticatedFetch(
    `/auth/me/plan/days/${planDay}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "PATCH",
      headers: planRequestHeaders(),
      body: JSON.stringify({ done }),
    },
  );

  if (!res.ok) {
    throw new Error("Could not update plan task");
  }

  return (await res.json()) as PlanState;
}

export async function savePlanTaskNote(
  planDay: number,
  taskId: string,
  note: string,
): Promise<PlanState> {
  const res = await authenticatedFetch(
    `/auth/me/plan/days/${planDay}/tasks/${encodeURIComponent(taskId)}/note`,
    {
      method: "PATCH",
      headers: planRequestHeaders(),
      body: JSON.stringify({ note }),
    },
  );

  if (!res.ok) {
    throw new Error("Could not save task note");
  }

  return (await res.json()) as PlanState;
}
