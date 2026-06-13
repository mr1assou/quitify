import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/config/api";

let socket: Socket | null = null;

export type PresenceUpdatePayload = {
  userId: number;
  isOnline: boolean;
};

export type PresenceSnapshotPayload = {
  onlineUserIds: number[];
};

export type PresenceSocketHandlers = {
  onSnapshot?: (payload: PresenceSnapshotPayload) => void;
  onUpdate?: (payload: PresenceUpdatePayload) => void;
};

function registerHandlers(sock: Socket, handlers: PresenceSocketHandlers) {
  sock.off("presence:snapshot");
  sock.off("presence:update");
  sock.off("connect");

  sock.on("presence:snapshot", (payload: PresenceSnapshotPayload) => {
    handlers.onSnapshot?.(payload);
  });

  sock.on("presence:update", (payload: PresenceUpdatePayload) => {
    handlers.onUpdate?.(payload);
  });

  sock.on("connect", () => {
    sock.emit("presence:sync");
  });
}

export function connectPresenceSocket(
  accessToken: string,
  handlers: PresenceSocketHandlers = {},
): Socket {
  if (socket?.connected) {
    registerHandlers(socket, handlers);
    socket.emit("presence:sync");
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(`${API_URL}/presence`, {
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    extraHeaders: { "ngrok-skip-browser-warning": "1" },
    reconnection: true,
    reconnectionAttempts: 8,
  });

  registerHandlers(socket, handlers);

  return socket;
}

export function getPresenceSocket(): Socket | null {
  return socket;
}

export function disconnectPresenceSocket(): void {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
