import type { BackendFeedPageResponse } from "@/types/community/postsApi";

export type BackendUserStreakResponse = {
  streak_start: string | null;
  attempt_number: number;
  max_duration_ms: number;
};

export type BackendUserPresenceResponse = {
  user_id: number;
  is_online: boolean;
  last_offline_at: string | null;
};

export type BackendUserProfileComment = {
  comment_id: number;
  post_id: number;
  text: string;
  created_at: string;
  post: {
    post_id: number;
    title: string;
    description: string;
  };
};

export type BackendUserProfileCommentsPage = {
  items: BackendUserProfileComment[];
  has_more: boolean;
};

export type BackendUserPostsPage = BackendFeedPageResponse;
