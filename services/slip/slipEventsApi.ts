import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { SlipEventResponse, SlipSubmitPayload, SlipUndoResponse } from "@/types/slip";

export async function createSlipEvent(payload: SlipSubmitPayload): Promise<SlipEventResponse> {
  const res = await authenticatedFetch("/auth/me/slip-events", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Could not log slip");
  }

  return res.json() as Promise<SlipEventResponse>;
}

export async function deleteSlipEvent(slipEventId: number): Promise<SlipUndoResponse> {
  const res = await authenticatedFetch(`/auth/me/slip-events/${slipEventId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Could not undo slip");
  }

  return res.json() as Promise<{ streakStart: string | null }>;
}
