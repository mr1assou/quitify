import type { BackendPostEngagement } from "@/types/postsApi";
import type { CommunityPost } from "@/types/community";

export function applyEngagementToPost(
  post: CommunityPost,
  engagement: BackendPostEngagement,
): CommunityPost {
  return {
    ...post,
    upvoteCount: engagement.upvote_count,
    downvoteCount: engagement.downvote_count,
    shareCount: engagement.share_count,
    commentCount: engagement.comment_count,
    myVote: engagement.my_vote,
  };
}

export function resolveCommentCount(post: CommunityPost): number {
  if (post.commentIds.length > 0) return post.commentIds.length;
  return post.commentCount ?? 0;
}
