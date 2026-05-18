export type CommunityUser = {
  id: string;
  /** Display name. */
  name: string;
  /** @-style handle, lowercase, no spaces. */
  handle: string;
  /** Short profile blurb. */
  bio: string;
  /** Smoke-free streak in days (used for status + badge). */
  smokeFreeDays: number;
  /** Highest badge tier this person has earned (from constants/badges). */
  badgeId: string;
  /** When true, render the in-app user avatar (yes.png). */
  isCurrentUser?: boolean;
  /** Optional location hint shown on profile. */
  location?: string;
};

export type PostMediaKind = "image" | "video";

export type PostMedia = {
  kind: PostMediaKind;
  /** Asset key resolved by `getPostImage`. */
  imageKey?: string;
  /** Optional video duration (mm:ss). */
  durationLabel?: string;
};

export type CommunityPost = {
  id: string;
  authorId: string;
  /** Body text. */
  text: string;
  /** ISO/epoch timestamp the post was created. */
  createdAt: number;
  /** Optional attached media (image or short video). */
  media?: PostMedia;
  /** Total like count (already including current user if liked). */
  likeCount: number;
  /** Whether the current user has liked this post. */
  likedByMe: boolean;
  /** Total share count (display-only). */
  shareCount: number;
  /** Ordered comment ids attached to this post. */
  commentIds: string[];
};

export type PostComment = {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: number;
};

export type FeedItem = {
  post: CommunityPost;
  author: CommunityUser;
  /** Last 2 comments to preview under the post. */
  previewComments: Array<{ comment: PostComment; author: CommunityUser }>;
};
