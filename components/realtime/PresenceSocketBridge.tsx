import { usePresenceSocket } from "@/hooks/community/usePresenceSocket";

/** Invisible bridge — mounts presence WebSocket lifecycle inside CommunityProvider. */
export function PresenceSocketBridge() {
  usePresenceSocket();
  return null;
}
