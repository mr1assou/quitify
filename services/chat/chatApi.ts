import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import { CHAT_MESSAGES_PAGE_SIZE } from "@/constants/chat/chatMessages";
import type {
  BackendChatMessagesPage,
  BackendChatThreadSummary,
  BackendChatUploadUrl,
  BackendMessagesSeenPayload,
  BackendChatMessage,
  SendChatMessagePayload,
} from "@/types/chat/chatApi";

async function parseError(res: Response, fallback: string): Promise<never> {
  try {
    const body = (await res.json()) as { message?: string };
    throw new Error(body.message ?? fallback);
  } catch (error) {
    if (error instanceof Error && error.message !== fallback) throw error;
    throw new Error(fallback);
  }
}

export async function fetchChatThreads(): Promise<BackendChatThreadSummary[]> {
  const res = await authenticatedFetch("/chat/threads");
  if (!res.ok) return parseError(res, "Could not load chats");
  return res.json() as Promise<BackendChatThreadSummary[]>;
}

export async function openChatThread(
  peerUserId: number,
): Promise<BackendChatThreadSummary> {
  const res = await authenticatedFetch("/chat/threads", {
    method: "POST",
    body: JSON.stringify({ peer_user_id: peerUserId }),
  });
  if (!res.ok) return parseError(res, "Could not open chat");
  return res.json() as Promise<BackendChatThreadSummary>;
}

export async function fetchChatMessages(
  threadId: number,
  before?: string,
  limit = CHAT_MESSAGES_PAGE_SIZE,
): Promise<BackendChatMessagesPage> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set("before", before);
  const res = await authenticatedFetch(
    `/chat/threads/${threadId}/messages?${params.toString()}`,
  );
  if (!res.ok) return parseError(res, "Could not load messages");
  return res.json() as Promise<BackendChatMessagesPage>;
}

export async function sendChatMessage(
  threadId: number,
  payload: SendChatMessagePayload,
): Promise<BackendChatMessage> {
  const res = await authenticatedFetch(`/chat/threads/${threadId}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseError(res, "Could not send message");
  return res.json() as Promise<BackendChatMessage>;
}

export async function markChatThreadRead(
  threadId: number,
): Promise<BackendMessagesSeenPayload> {
  const res = await authenticatedFetch(`/chat/threads/${threadId}/read`, {
    method: "POST",
  });
  if (!res.ok) return parseError(res, "Could not mark chat as read");
  return res.json() as Promise<BackendMessagesSeenPayload>;
}

export async function createChatUploadUrl(
  contentType: string,
): Promise<BackendChatUploadUrl> {
  const res = await authenticatedFetch("/chat/upload-url", {
    method: "POST",
    body: JSON.stringify({ contentType }),
  });
  if (!res.ok) return parseError(res, "Could not create upload URL");
  return res.json() as Promise<BackendChatUploadUrl>;
}
