import { useChatSocket } from "@/hooks/chat/useChatSocket";

/** Invisible bridge — mounts chat WebSocket lifecycle inside CommunityProvider. */
export function ChatSocketBridge() {
  useChatSocket();
  return null;
}
