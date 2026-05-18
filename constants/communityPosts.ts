import type { CommunityPost, PostComment } from "@/types/community";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const NOW = Date.now();

/** Seed posts shown on first open; the user can add new ones. */
export const SEED_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorId: "user-yuki",
    text: "540 days smoke-free today. The cravings stopped feeling urgent around month 4. If you're early in your quit — keep going. It gets quieter.",
    createdAt: NOW - 2 * HOUR,
    media: { kind: "image", imageKey: "default" },
    likeCount: 248,
    likedByMe: true,
    shareCount: 32,
    commentIds: ["comment-1", "comment-2"],
  },
  {
    id: "post-2",
    authorId: "user-amina",
    text: "Hit 6 months 🌱 Saved enough to take the kids on a small trip. Quit smoking, gained a memory.",
    createdAt: NOW - 6 * HOUR,
    likeCount: 134,
    likedByMe: false,
    shareCount: 9,
    commentIds: ["comment-3"],
  },
  {
    id: "post-3",
    authorId: "user-lucas",
    text: "Ran my first 10k this morning. A year ago I couldn't climb stairs without losing breath. Quitify squad — this is what's on the other side.",
    createdAt: NOW - 11 * HOUR,
    media: { kind: "video", imageKey: "default", durationLabel: "0:42" },
    likeCount: 412,
    likedByMe: false,
    shareCount: 58,
    commentIds: ["comment-4", "comment-5"],
  },
  {
    id: "post-4",
    authorId: "user-noah",
    text: "Day 18. Replaced my smoke breaks with short walks. Anyone else doing this?",
    createdAt: NOW - 22 * HOUR,
    likeCount: 47,
    likedByMe: false,
    shareCount: 2,
    commentIds: ["comment-6"],
  },
  {
    id: "post-5",
    authorId: "user-sofia",
    text: "Third attempt and the only thing that's different this time is staying connected. Telling people I quit makes it real.",
    createdAt: NOW - DAY - 3 * HOUR,
    likeCount: 86,
    likedByMe: true,
    shareCount: 5,
    commentIds: [],
  },
  {
    id: "post-6",
    authorId: "user-chloe",
    text: "First trimester. Hardest week was week 2 — then it became just a thing I don't do. Hang in there if you're new.",
    createdAt: NOW - DAY - 8 * HOUR,
    media: { kind: "image", imageKey: "default" },
    likeCount: 192,
    likedByMe: false,
    shareCount: 21,
    commentIds: [],
  },
  {
    id: "post-7",
    authorId: "user-leo",
    text: "One full year today. Twenty-two years of smoking gone. Tell future you they made it.",
    createdAt: NOW - 2 * DAY,
    likeCount: 980,
    likedByMe: true,
    shareCount: 124,
    commentIds: [],
  },
];

export const SEED_COMMENTS: PostComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    authorId: "user-amina",
    text: "This is what I needed to read today. Day 12 here.",
    createdAt: NOW - 1.5 * HOUR,
  },
  {
    id: "comment-2",
    postId: "post-1",
    authorId: "user-noah",
    text: "Saving this 🙏",
    createdAt: NOW - 1 * HOUR,
  },
  {
    id: "comment-3",
    postId: "post-2",
    authorId: "user-lucas",
    text: "Congrats Amina! Huge.",
    createdAt: NOW - 5 * HOUR,
  },
  {
    id: "comment-4",
    postId: "post-3",
    authorId: "user-yuki",
    text: "Inspiring. Going for my first 5k next week.",
    createdAt: NOW - 9 * HOUR,
  },
  {
    id: "comment-5",
    postId: "post-3",
    authorId: "user-sofia",
    text: "Lucas! 🔥",
    createdAt: NOW - 8 * HOUR,
  },
  {
    id: "comment-6",
    postId: "post-4",
    authorId: "user-emma",
    text: "Same. Two walks a day, completely changed things for me.",
    createdAt: NOW - 20 * HOUR,
  },
];
