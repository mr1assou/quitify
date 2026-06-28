/**
 * ICE servers for WebRTC peer connections.
 *
 * STUN handles most home/Wi‑Fi networks. Strict/mobile NATs often need a TURN
 * relay — set the EXPO_PUBLIC_TURN_* env vars (e.g. coturn / Twilio / Metered)
 * and it is appended automatically. No code change required to add TURN later.
 */
type IceServer = {
  urls: string | string[];
  username?: string;
  credential?: string;
};

const STUN_SERVERS: IceServer[] = [
  {
    urls: [
      "stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302",
    ],
  },
];

function turnServerFromEnv(): IceServer | null {
  const urls = process.env.EXPO_PUBLIC_TURN_URL?.trim();
  if (!urls) return null;

  return {
    urls,
    username: process.env.EXPO_PUBLIC_TURN_USERNAME?.trim() || undefined,
    credential: process.env.EXPO_PUBLIC_TURN_CREDENTIAL?.trim() || undefined,
  };
}

export function getIceServers(): IceServer[] {
  const turn = turnServerFromEnv();
  return turn ? [...STUN_SERVERS, turn] : STUN_SERVERS;
}

/** Caller waits this long for an answer before giving up. */
export const CALL_RING_TIMEOUT_MS = 45_000;
