import type { BackendPostEngagement } from "@/types/community/postsApi";
import type { CommunityPost } from "@/types/community/community";

export function applyEngagementToPost(
  post: CommunityPost,
  engagement: BackendPostEngagement,
): CommunityPost {
  return {
    ...post,
    upvoteCount: Math.max(0, engagement.upvote_count),
    downvoteCount: Math.max(0, engagement.downvote_count),
    shareCount: Math.max(0, engagement.share_count),
    commentCount: Math.max(0, engagement.comment_count),
    myVote: engagement.my_vote,
  };
}

export function resolveCommentCount(post: CommunityPost): number {
  if (post.commentIds.length > 0) return post.commentIds.length;
  return post.commentCount ?? 0;
}
