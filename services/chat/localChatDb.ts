import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";

import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import type { ChatMessage, ChatMessageKind, MessageSyncStatus } from "@/types/chat/chat";

/**
 * On-device chat store (WhatsApp-style local-first).
 *
 * - Every message the phone knows about lives here, keyed by a stable
 *   `client_key` so a bubble never remounts when the server id arrives.
 * - Sends are written here first (`sync_status = pending`) and shown at once;
 *   the network happens afterwards from the outbox.
 * - One database file per signed-in user so accounts never see each other's chats.
 */

type MessageRow = {
  client_key: string;
  server_id: string | null;
  thread_id: string;
  sender_id: string;
  kind: string;
  text: string;
  media_url: string | null;
  media_mime_type: string | null;
  media_duration_ms: number | null;
  media_size_bytes: number | null;
  media_local_uri: string | null;
  is_deleted: number;
  edited_at: number | null;
  created_at: number;
  sync_status: string;
};

/** Media still waiting to upload (kept until the outbox sends it). */
export type PendingMediaSource = {
  uri: string;
  mimeType?: string;
  sizeBytes?: number;
};

export type OutboxItem = {
  message: ChatMessage;
  media: PendingMediaSource | null;
};

const SCHEMA = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS chat_messages (
    client_key        TEXT PRIMARY KEY NOT NULL,
    server_id         TEXT,
    thread_id         TEXT NOT NULL,
    sender_id         TEXT NOT NULL,
    kind              TEXT NOT NULL,
    text              TEXT NOT NULL DEFAULT '',
    media_url         TEXT,
    media_mime_type   TEXT,
    media_duration_ms INTEGER,
    media_size_bytes  INTEGER,
    media_local_uri   TEXT,
    is_deleted        INTEGER NOT NULL DEFAULT 0,
    edited_at         INTEGER,
    created_at        INTEGER NOT NULL,
    sync_status       TEXT NOT NULL DEFAULT 'sent'
  );
  CREATE UNIQUE INDEX IF NOT EXISTS chat_messages_server_id_idx
    ON chat_messages(server_id);
  CREATE INDEX IF NOT EXISTS chat_messages_thread_created_idx
    ON chat_messages(thread_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS chat_messages_outbox_idx
    ON chat_messages(sync_status, created_at ASC);
`;

const handles = new Map<number, Promise<SQLiteDatabase>>();

function dbName(userId: number): string {
  return `quitify-chat-${userId}.db`;
}

async function open(userId: number): Promise<SQLiteDatabase> {
  let handle = handles.get(userId);
  if (!handle) {
    handle = openDatabaseAsync(dbName(userId)).then(async (db) => {
      await db.execAsync(SCHEMA);
      return db;
    });
    handles.set(userId, handle);
  }
  return handle;
}

function serverClientKey(serverId: string): string {
  return `srv-${serverId}`;
}

function rowToMessage(row: MessageRow): ChatMessage {
  const syncStatus = row.sync_status as MessageSyncStatus;
  return {
    id: row.server_id ?? row.client_key,
    // Server-origin rows render under their id (same as API-mapped messages);
    // our own sends keep the temp key so the bubble never remounts.
    clientKey: row.client_key.startsWith("srv-") ? undefined : row.client_key,
    threadId: row.thread_id,
    senderId: row.sender_id,
    text: row.text,
    createdAt: row.created_at,
    kind: row.kind as ChatMessageKind,
    // Pending media shows the local file until the upload finishes.
    mediaUrl: row.media_url ?? row.media_local_uri ?? undefined,
    mediaMimeType: row.media_mime_type ?? undefined,
    mediaDurationMs: row.media_duration_ms ?? undefined,
    mediaSizeBytes: row.media_size_bytes ?? undefined,
    isDeleted: row.is_deleted === 1,
    editedAt: row.edited_at ?? undefined,
    syncStatus: syncStatus === "sent" ? undefined : syncStatus,
  };
}

/** Newest `limit` messages of a thread, oldest → newest. */
export async function readThreadMessages(
  userId: number,
  threadId: string,
  limit: number,
): Promise<ChatMessage[]> {
  const db = await open(userId);
  const rows = await db.getAllAsync<MessageRow>(
    `SELECT * FROM chat_messages
     WHERE thread_id = ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [threadId, limit],
  );
  return rows.reverse().map(rowToMessage);
}

/** Messages strictly older than `beforeCreatedAt`, oldest → newest. */
export async function readOlderThreadMessages(
  userId: number,
  threadId: string,
  beforeCreatedAt: number,
  limit: number,
): Promise<ChatMessage[]> {
  const db = await open(userId);
  const rows = await db.getAllAsync<MessageRow>(
    `SELECT * FROM chat_messages
     WHERE thread_id = ? AND created_at < ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [threadId, beforeCreatedAt, limit],
  );
  return rows.reverse().map(rowToMessage);
}

/**
 * Store messages that came from the server (history page, socket, edit, delete).
 * If we already hold this server id under a local key (our own send), that row is
 * updated in place so the bubble keeps its key.
 */
export async function upsertServerMessages(
  userId: number,
  messages: readonly ChatMessage[],
): Promise<void> {
  if (messages.length === 0) return;
  const db = await open(userId);

  await db.withTransactionAsync(async () => {
    for (const message of messages) {
      await db.runAsync(
        `INSERT INTO chat_messages (
           client_key, server_id, thread_id, sender_id, kind, text,
           media_url, media_mime_type, media_duration_ms, media_size_bytes,
           media_local_uri, is_deleted, edited_at, created_at, sync_status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, 'sent')
         ON CONFLICT(server_id) DO UPDATE SET
           thread_id         = excluded.thread_id,
           sender_id         = excluded.sender_id,
           kind              = excluded.kind,
           text              = excluded.text,
           media_url         = excluded.media_url,
           media_mime_type   = excluded.media_mime_type,
           media_duration_ms = excluded.media_duration_ms,
           media_size_bytes  = excluded.media_size_bytes,
           media_local_uri   = NULL,
           is_deleted        = excluded.is_deleted,
           edited_at         = excluded.edited_at,
           created_at        = excluded.created_at,
           sync_status       = 'sent'`,
        [
          serverClientKey(message.id),
          message.id,
          message.threadId,
          message.senderId,
          message.kind,
          message.text ?? "",
          message.mediaUrl ?? null,
          message.mediaMimeType ?? null,
          message.mediaDurationMs ?? null,
          message.mediaSizeBytes ?? null,
          message.isDeleted ? 1 : 0,
          message.editedAt ?? null,
          message.createdAt,
        ],
      );
    }
  });
}

/** Save an outgoing message on the device before any network call. */
export async function insertPendingMessage(
  userId: number,
  message: ChatMessage,
  media: PendingMediaSource | null,
): Promise<void> {
  const db = await open(userId);
  await db.runAsync(
    `INSERT OR REPLACE INTO chat_messages (
       client_key, server_id, thread_id, sender_id, kind, text,
       media_url, media_mime_type, media_duration_ms, media_size_bytes,
       media_local_uri, is_deleted, edited_at, created_at, sync_status
     ) VALUES (?, NULL, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 0, NULL, ?, 'pending')`,
    [
      message.clientKey ?? message.id,
      message.threadId,
      CURRENT_USER_ID,
      message.kind,
      message.text ?? "",
      media?.mimeType ?? message.mediaMimeType ?? null,
      message.mediaDurationMs ?? null,
      media?.sizeBytes ?? null,
      media?.uri ?? null,
      message.createdAt,
    ],
  );
}

/** The server accepted a pending message: attach its id and final media URL. */
export async function markMessageSent(
  userId: number,
  clientKey: string,
  sent: ChatMessage,
): Promise<void> {
  const db = await open(userId);
  await db.withTransactionAsync(async () => {
    // A socket echo may already have stored this server id under `srv-*`.
    await db.runAsync(
      `DELETE FROM chat_messages WHERE server_id = ? AND client_key <> ?`,
      [sent.id, clientKey],
    );
    await db.runAsync(
      `UPDATE chat_messages SET
         server_id         = ?,
         text              = ?,
         media_url         = ?,
         media_mime_type   = ?,
         media_duration_ms = ?,
         media_size_bytes  = ?,
         media_local_uri   = NULL,
         created_at        = ?,
         sync_status       = 'sent'
       WHERE client_key = ?`,
      [
        sent.id,
        sent.text ?? "",
        sent.mediaUrl ?? null,
        sent.mediaMimeType ?? null,
        sent.mediaDurationMs ?? null,
        sent.mediaSizeBytes ?? null,
        sent.createdAt,
        clientKey,
      ],
    );
  });
}

export async function markMessageFailed(userId: number, clientKey: string): Promise<void> {
  const db = await open(userId);
  await db.runAsync(
    `UPDATE chat_messages SET sync_status = 'failed' WHERE client_key = ?`,
    [clientKey],
  );
}

export async function markMessagePending(userId: number, clientKey: string): Promise<void> {
  const db = await open(userId);
  await db.runAsync(
    `UPDATE chat_messages SET sync_status = 'pending' WHERE client_key = ?`,
    [clientKey],
  );
}

/** Everything still waiting to reach the server, oldest first. */
export async function readOutbox(userId: number): Promise<OutboxItem[]> {
  const db = await open(userId);
  const rows = await db.getAllAsync<MessageRow>(
    `SELECT * FROM chat_messages
     WHERE sync_status IN ('pending', 'failed')
     ORDER BY created_at ASC`,
  );
  return rows.map((row) => ({
    message: rowToMessage(row),
    media: row.media_local_uri
      ? {
          uri: row.media_local_uri,
          mimeType: row.media_mime_type ?? undefined,
          sizeBytes: row.media_size_bytes ?? undefined,
        }
      : null,
  }));
}

/** Drop the cached connection (e.g. on sign-out). Data stays on disk. */
export async function closeLocalChatDb(userId: number): Promise<void> {
  const handle = handles.get(userId);
  if (!handle) return;
  handles.delete(userId);
  try {
    const db = await handle;
    await db.closeAsync();
  } catch {
    // already closed
  }
}
