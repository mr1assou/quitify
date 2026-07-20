import type { PostVote } from "@/types/community/community";
import type { BackendPostCommentEngagement } from "@/types/community/postsApi";
import type { PostComment } from "@/types/community/community";
import { nextPostVote } from "@/utils/community/postVote";

/** Apply an absolute comment vote state and adjust counts. */
export function applyCommentVoteState(
  comment: PostComment,
  next: PostVote | null,
): PostComment {
  if (comment.myVote === next) return comment;

  let upvoteCount = comment.upvoteCount;
  let downvoteCount = comment.downvoteCount;

  if (comment.myVote === "up") upvoteCount = Math.max(0, upvoteCount - 1);
  if (comment.myVote === "down") downvoteCount = Math.max(0, downvoteCount - 1);
  if (next === "up") upvoteCount += 1;
  if (next === "down") downvoteCount += 1;

  return {
    ...comment,
    upvoteCount,
    downvoteCount,
    myVote: next,
  };
}

/** Apply a tap on up/down (toggle off if the same vote is pressed again). */
export function applyCommentVote(
  comment: PostComment,
  vote: PostVote,
): PostComment {
  return applyCommentVoteState(comment, nextPostVote(comment.myVote, vote));
}

export function applyCommentEngagement(
  comment: PostComment,
  engagement: BackendPostCommentEngagement,
): PostComment {
  return {
    ...comment,
    upvoteCount: Math.max(0, engagement.upvote_count),
    downvoteCount: Math.max(0, engagement.downvote_count),
    myVote: engagement.my_vote,
  };
}
