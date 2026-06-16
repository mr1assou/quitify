/**
 * Messages fetched per page when opening a chat or scrolling to older history.
 *
 * 30 is a good mobile default:
 * - ~1–2 screens of bubbles on first load (fast open)
 * - Small enough for threads with photos/videos
 * - Large enough that users rarely paginate on short chats
 *
 * WhatsApp/Telegram-style apps typically use 20–50.
 */
export const CHAT_MESSAGES_PAGE_SIZE = 30;
