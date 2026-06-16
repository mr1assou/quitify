import type { PostTagId } from "@/constants/community/postTags";

export type CommunityUser = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  smokeFreeDays: number;
  badgeId: string;
  countryFlag: string;
  /** Synthetic rank used for profile photo cycling in the feed. */
  avatarRank: number;
  /** Display rank on the player profile screen. */
  leaderboardRank: number;
  isCurrentUser?: boolean;
  location?: string;
  /** Custom avatar from API (R2 profile folder). */
  avatarUrl?: string;
  /** UI-only presence indicator (mock until real-time status exists). */
  isOnline?: boolean;
  /** UI-only last offline time (epoch ms). */
  lastSeenAt?: number;
};

export type PostVote = "up" | "down";

export type PostMediaKind = "image" | "video";

export type PostMediaFrame = "square" | "portrait" | "landscape";

export type PostImageCrop = {
  scale: number;
  /** Horizontal pan as a fraction of max pan at this scale (-1 = left edge, 1 = right edge). */
  panX: number;
  /** Vertical pan as a fraction of max pan at this scale (-1 = top edge, 1 = bottom edge). */
  panY: number;
};

export type PostMedia = {
  kind: PostMediaKind;
  imageKey?: string;
  localUri?: string;
  durationLabel?: string;
  frame?: PostMediaFrame;
  crop?: PostImageCrop;
};

export type CommunityPost = {
  id: string;
  authorId: string;
  title?: string;
  tagId?: PostTagId;
  text: string;
  createdAt: number;
  media?: PostMedia[];
  upvoteCount: number;
  downvoteCount: number;
  myVote: PostVote | null;
  shareCount: number;
  commentIds: string[];
  /** Total comments from API when thread ids are not loaded yet. */
  commentCount?: number;
};

export type PostComment = {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId?: string | null;
  replyToUserId?: string | null;
  replyToHandle?: string | null;
  text: string;
  createdAt: number;
  upvoteCount: number;
  downvoteCount: number;
  myVote: PostVote | null;
};

export type CommentReplyTarget = {
  commentId: string;
  userId: string;
  handle: string;
  name: string;
};

export type FeedItem = {
  post: CommunityPost;
  author: CommunityUser;
};
