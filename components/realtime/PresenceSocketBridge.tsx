import { usePresenceSocket } from "@/hooks/usePresenceSocket";

/** Invisible bridge — mounts presence WebSocket lifecycle inside CommunityProvider. */
export function PresenceSocketBridge() {
  usePresenceSocket();
  return null;
}
