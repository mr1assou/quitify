import { useChatSocket } from "@/hooks/useChatSocket";

/** Invisible bridge — mounts chat WebSocket lifecycle inside CommunityProvider. */
export function ChatSocketBridge() {
  useChatSocket();
  return null;
}
