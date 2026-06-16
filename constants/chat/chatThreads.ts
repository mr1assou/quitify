import type { ChatMessage, ChatThread } from "@/types/chat/chat";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const NOW = Date.now();

export const SEED_THREADS: ChatThread[] = [
  {
    id: "thread-amina",
    participantId: "user-amina",
    messageIds: ["m-a1", "m-a2", "m-a3", "m-a4"],
    lastReadAt: NOW - 1 * HOUR,
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
];
