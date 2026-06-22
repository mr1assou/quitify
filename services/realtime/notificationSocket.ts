import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/config/api";
import type { BackendNotification } from "@/types/notifications/notification";

let socket: Socket | null = null;
let wired = false;

const newNotificationListeners = new Set<
  (payload: BackendNotification) => void
>();

function wireSocket(sock: Socket) {
  if (wired) return;
  wired = true;

  sock.on("notification:new", (payload: BackendNotification) => {
    newNotificationListeners.forEach((listener) => listener(payload));
  });

  sock.on("disconnect", () => {
    wired = false;
  });
}

export type NotificationSocketHandlers = {
  onNew?: (payload: BackendNotification) => void;
};

export function subscribeNotificationSocket(
  handlers: NotificationSocketHandlers,
): () => void {
  const cleanups: Array<() => void> = [];

  if (handlers.onNew) {
    newNotificationListeners.add(handlers.onNew);
    cleanups.push(() => newNotificationListeners.delete(handlers.onNew!));
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

export function connectNotificationSocket(accessToken: string): Socket {
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
    wired = false;
  }

  socket = io(`${API_URL}/notifications`, {
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    extraHeaders: { "ngrok-skip-browser-warning": "1" },
    reconnection: true,
    reconnectionAttempts: 8,
  });

  wireSocket(socket);

  return socket;
}

export function disconnectNotificationSocket(): void {
  if (!socket) return;
  newNotificationListeners.clear();
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  wired = false;
}

export function getNotificationSocket(): Socket | null {
  return socket;
}
