import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/config/api";
import type {
  BackendChatMessage,
  BackendChatTypingPayload,
  BackendMessagesSeenPayload,
} from "@/types/chat/chatApi";

let socket: Socket | null = null;
let wired = false;

const messageListeners = new Set<(payload: BackendChatMessage) => void>();
const messageUpdatedListeners = new Set<(payload: BackendChatMessage) => void>();
const messageDeletedListeners = new Set<(payload: BackendChatMessage) => void>();
const seenListeners = new Set<(payload: BackendMessagesSeenPayload) => void>();
const typingListeners = new Set<(payload: BackendChatTypingPayload) => void>();
const connectedListeners = new Set<() => void>();

function wireSocket(sock: Socket) {
  if (wired) return;
  wired = true;

  // Fires on the first connection AND after every automatic reconnection.
  // Listeners use it to re-join rooms and fetch messages missed while offline.
  sock.on("connect", () => {
    connectedListeners.forEach((listener) => listener());
  });

  sock.on("chat:message", (payload: BackendChatMessage) => {
    messageListeners.forEach((listener) => listener(payload));
  });

  sock.on("chat:message_updated", (payload: BackendChatMessage) => {
    messageUpdatedListeners.forEach((listener) => listener(payload));
  });

  sock.on("chat:message_deleted", (payload: BackendChatMessage) => {
    messageDeletedListeners.forEach((listener) => listener(payload));
  });

  sock.on("messages_seen", (payload: BackendMessagesSeenPayload) => {
    seenListeners.forEach((listener) => listener(payload));
  });

  sock.on("chat:typing", (payload: BackendChatTypingPayload) => {
    typingListeners.forEach((listener) => listener(payload));
  });
}

export type ChatSocketHandlers = {
  onMessage?: (message: BackendChatMessage) => void;
  onMessageUpdated?: (message: BackendChatMessage) => void;
  onMessageDeleted?: (message: BackendChatMessage) => void;
  onMessagesSeen?: (payload: BackendMessagesSeenPayload) => void;
  onTyping?: (payload: BackendChatTypingPayload) => void;
  /** Called on every (re)connection — used to catch up on missed messages. */
  onConnected?: () => void;
};

export function subscribeChatSocket(handlers: ChatSocketHandlers): () => void {
  const cleanups: Array<() => void> = [];

  if (handlers.onMessage) {
    messageListeners.add(handlers.onMessage);
    cleanups.push(() => messageListeners.delete(handlers.onMessage!));
  }
  if (handlers.onMessageUpdated) {
    messageUpdatedListeners.add(handlers.onMessageUpdated);
    cleanups.push(() => messageUpdatedListeners.delete(handlers.onMessageUpdated!));
  }
  if (handlers.onMessageDeleted) {
    messageDeletedListeners.add(handlers.onMessageDeleted);
    cleanups.push(() => messageDeletedListeners.delete(handlers.onMessageDeleted!));
  }
  if (handlers.onMessagesSeen) {
    seenListeners.add(handlers.onMessagesSeen);
    cleanups.push(() => seenListeners.delete(handlers.onMessagesSeen!));
  }
  if (handlers.onTyping) {
    typingListeners.add(handlers.onTyping);
    cleanups.push(() => typingListeners.delete(handlers.onTyping!));
  }
  if (handlers.onConnected) {
    connectedListeners.add(handlers.onConnected);
    cleanups.push(() => connectedListeners.delete(handlers.onConnected!));
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

export function connectChatSocket(accessToken: string): Socket {
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
    wired = false;
  }

  socket = io(`${API_URL}/chat`, {
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    extraHeaders: { "ngrok-skip-browser-warning": "1" },
    // Retry forever with backoff: a free-tier server cold start can take
    // 30-60s, which would exhaust any small fixed attempt limit and leave
    // the app with a permanently dead socket.
    reconnection: true,
    reconnectionDelayMax: 10000,
  });

  wireSocket(socket);

  socket.on("disconnect", () => {
    wired = false;
  });

  return socket;
}

export function joinChatThread(threadId: number): void {
  socket?.emit("chat:join", { threadId });
}

export function leaveChatThread(threadId: number): void {
  socket?.emit("chat:leave", { threadId });
}

export function emitChatMarkSeen(threadId: number): void {
  socket?.emit("chat:mark_seen", { threadId });
}

export function emitChatTyping(threadId: number, isTyping: boolean): void {
  socket?.emit("chat:typing", { threadId, isTyping });
}

export function disconnectChatSocket(): void {
  if (!socket) return;
  messageListeners.clear();
  messageUpdatedListeners.clear();
  messageDeletedListeners.clear();
  seenListeners.clear();
  typingListeners.clear();
  connectedListeners.clear();
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  wired = false;
}

export function getChatSocket(): Socket | null {
  return socket;
}

export function addChatSocketListener<K extends keyof ChatSocketHandlers>(
  event: K,
  handler: NonNullable<ChatSocketHandlers[K]>,
): () => void {
  return subscribeChatSocket({ [event]: handler } as ChatSocketHandlers);
}
