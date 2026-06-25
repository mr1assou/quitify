import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { AuthMeResponse } from "@/services/auth/meApi";

export type UpdateHabitSettingsPayload = {
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packCost: number;
};

export async function updateHabitSettingsOnServer(
  payload: UpdateHabitSettingsPayload,
): Promise<AuthMeResponse> {
  const res = await authenticatedFetch("/auth/me/habit-settings", {
    method: "PATCH",
    body: JSON.stringify({
      cigarettesPerDay: payload.cigarettesPerDay,
      cigarettesPerPack: payload.cigarettesPerPack,
      packCost: payload.packCost,
    }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Could not save habit settings (${res.status})`);
  }

  return res.json() as Promise<AuthMeResponse>;
}
