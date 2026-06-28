import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { CallKind } from "@/types/call/signaling";
import type { CallHistoryStatus } from "@/utils/call/callHistoryMessage";

export type RecordCallHistoryInput = {
  peerUserId: number;
  callId: string;
  callKind: CallKind;
  status: CallHistoryStatus;
  durationMs?: number;
};

/** Logs a completed, missed, or declined call as a message in the peer's chat. */
export async function reportCallHistory(
  input: RecordCallHistoryInput,
): Promise<void> {
  try {
    const res = await authenticatedFetch("/chat/call-history", {
      method: "POST",
      body: JSON.stringify({
        peer_user_id: input.peerUserId,
        call_id: input.callId,
        call_kind: input.callKind,
        status: input.status,
        duration_ms: input.durationMs,
      }),
    });
    if (!res.ok) return;
  } catch {
    // Non-fatal — call already ended for the user.
  }
}
