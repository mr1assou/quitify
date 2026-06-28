import type { CallKind } from "@/types/call/signaling";

export type CallHistoryStatus = "completed" | "missed" | "declined";

export type CallHistoryPayload = {
  v: 1;
  callKind: CallKind;
  status: CallHistoryStatus;
  durationMs?: number;
};

export function parseCallHistoryPayload(
  raw: string | null | undefined,
): CallHistoryPayload | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CallHistoryPayload>;
    if (parsed.v !== 1) return null;
    if (parsed.callKind !== "audio" && parsed.callKind !== "video") return null;
    if (
      parsed.status !== "completed" &&
      parsed.status !== "missed" &&
      parsed.status !== "declined"
    ) {
      return null;
    }
    return {
      v: 1,
      callKind: parsed.callKind,
      status: parsed.status,
      durationMs:
        typeof parsed.durationMs === "number" && parsed.durationMs >= 0
          ? parsed.durationMs
          : undefined,
    };
  } catch {
    return null;
  }
}

function formatCallDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function callTypeLabel(callKind: CallKind): string {
  return callKind === "video" ? "Video call" : "Voice call";
}

/** Human-readable label for a call-history row in the chat thread. */
export function formatCallHistoryLabel(
  payload: CallHistoryPayload,
  fromMe: boolean,
): string {
  const type = callTypeLabel(payload.callKind);

  if (payload.status === "completed") {
    const duration = formatCallDuration(payload.durationMs ?? 0);
    return fromMe ? `${type} · ${duration}` : `${type} · ${duration}`;
  }

  if (payload.status === "missed") {
    return fromMe ? "No answer" : `Missed ${payload.callKind === "video" ? "video" : "voice"} call`;
  }

  if (payload.status === "declined") {
    return fromMe ? "Call declined" : `${type} declined`;
  }

  return type;
}

/** Short preview for the chats list row. */
export function formatCallHistoryPreview(
  payload: CallHistoryPayload,
  fromMe: boolean,
): string {
  const icon = payload.callKind === "video" ? "🎥" : "📞";
  return `${icon} ${formatCallHistoryLabel(payload, fromMe)}`;
}
