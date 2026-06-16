import type { PostImageCrop, PostMediaFrame } from "@/types/community/community";

export type AllowedImageContentType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export type PresignedUploadResponse = {
  uploadUrl: string;
  imageUrl: string;
  key: string;
  expiresIn: number;
};

export type CreatePostPayload = {
  title: string;
  description?: string;
  tag_id: string;
  image_url?: string;
  image_frame?: PostMediaFrame;
  image_crop?: PostImageCrop;
};

export type BackendPostResponse = {
  post_id: number;
  author_id: number;
  title: string;
  description: string;
  tag_id: string | null;
  image_url: string | null;
  image_frame: string | null;
  image_crop: PostImageCrop | null;
  upvote_count: number;
  downvote_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
};

export type BackendFeedPostAuthor = {
  user_id: number;
  username: string | null;
  country: string | null;
  countryFlag: string | null;
  image_url: string | null;
  smoke_free_days: number;
  is_online: boolean;
};

export type BackendFeedPostResponse = BackendPostResponse & {
  is_mine: boolean;
  comment_count: number;
  my_vote: "up" | "down" | null;
  author: BackendFeedPostAuthor;
};

export type BackendFeedPageResponse = {
  items: BackendFeedPostResponse[];
  has_more: boolean;
};

export type BackendPostEngagement = {
  post_id: number;
  upvote_count: number;
  downvote_count: number;
  share_count: number;
  comment_count: number;
  my_vote: "up" | "down" | null;
};

export type BackendPostCommentReplyTo = {
  user_id: number;
  username: string | null;
};

export type BackendPostCommentResponse = {
  comment_id: number;
  post_id: number;
  parent_comment_id: number | null;
  reply_to: BackendPostCommentReplyTo | null;
  is_mine: boolean;
  text: string;
  upvote_count: number;
  downvote_count: number;
  my_vote: "up" | "down" | null;
  created_at: string;
  author: BackendFeedPostAuthor;
};

export type BackendPostCommentsPageResponse = {
  items: BackendPostCommentResponse[];
  has_more: boolean;
};

export type BackendPostCommentEngagement = {
  comment_id: number;
  upvote_count: number;
  downvote_count: number;
  my_vote: "up" | "down" | null;
};

export type BackendDeleteCommentResponse = {
  post_id: number;
  comment_count: number;
  removed_comment_ids: number[];
};
