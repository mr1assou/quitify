import type { ChatMessage, ChatThread } from "@/types/chat";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const NOW = Date.now();

export const SEED_THREADS: ChatThread[] = [
  {
    id: "thread-amina",
    participantId: "user-amina",
    messageIds: ["m-a1", "m-a2", "m-a3", "m-a4"],
    lastReadAt: NOW - 1 * HOUR,
  },
  {
    id: "thread-lucas",
    participantId: "user-lucas",
    messageIds: ["m-l1", "m-l2"],
    lastReadAt: NOW - 2 * DAY,
  },
  {
    id: "thread-yuki",
    participantId: "user-yuki",
    messageIds: ["m-y1", "m-y2", "m-y3"],
    lastReadAt: NOW,
  },
];

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "m-a1",
    threadId: "thread-amina",
    senderId: "me",
    text: "Hey! Saw your 6-month post. So proud of you.",
    createdAt: NOW - 3 * HOUR,
    kind: "text",
  },
  {
    id: "m-a2",
    threadId: "thread-amina",
    senderId: "user-amina",
    text: "Thanks! How are you holding up this week?",
    createdAt: NOW - 2.5 * HOUR,
    kind: "text",
  },
  {
    id: "m-a3",
    threadId: "thread-amina",
    senderId: "me",
    text: "Day 95. Cravings are way easier than they were last month.",
    createdAt: NOW - 2 * HOUR,
    kind: "text",
  },
  {
    id: "m-a4",
    threadId: "thread-amina",
    senderId: "user-amina",
    text: "That's huge. Want to do a call this weekend?",
    createdAt: NOW - 40 * MIN,
    kind: "text",
  },

  {
    id: "m-l1",
    threadId: "thread-lucas",
    senderId: "user-lucas",
    text: "Running with me tomorrow? Easy 3k.",
    createdAt: NOW - 2 * DAY - 3 * HOUR,
    kind: "text",
  },
  {
    id: "m-l2",
    threadId: "thread-lucas",
    senderId: "me",
    text: "I'm in!",
    createdAt: NOW - 2 * DAY - 2 * HOUR,
    kind: "text",
  },

  {
    id: "m-y1",
    threadId: "thread-yuki",
    senderId: "me",
    text: "Your post saved my evening. Thank you.",
    createdAt: NOW - 1.2 * HOUR,
    kind: "text",
  },
  {
    id: "m-y2",
    threadId: "thread-yuki",
    senderId: "user-yuki",
    text: "🙌 Glad it helped.",
    createdAt: NOW - 1 * HOUR,
    kind: "text",
  },
  {
    id: "m-y3",
    threadId: "thread-yuki",
    senderId: "user-yuki",
    text: "What helps you most when the urge hits?",
    createdAt: NOW - 50 * MIN,
    kind: "text",
  },
];
