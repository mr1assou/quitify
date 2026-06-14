import type { PostVote } from "@/types/community";
import type { BackendPostCommentEngagement } from "@/types/postsApi";
import type { PostComment } from "@/types/community";

export function applyCommentVote(
  comment: PostComment,
  vote: PostVote,
): PostComment {
  const wasUp = comment.myVote === "up";
  const wasDown = comment.myVote === "down";
  let upvoteCount = comment.upvoteCount;
  let downvoteCount = comment.downvoteCount;
  let myVote: PostVote | null = vote;

  if (wasUp && vote === "up") {
    upvoteCount -= 1;
    myVote = null;
  } else if (wasDown && vote === "down") {
    downvoteCount -= 1;
    myVote = null;
  } else if (wasUp && vote === "down") {
    upvoteCount -= 1;
    downvoteCount += 1;
  } else if (wasDown && vote === "up") {
    downvoteCount -= 1;
    upvoteCount += 1;
  } else if (vote === "up") {
    upvoteCount += 1;
  } else {
    downvoteCount += 1;
  }

  return { ...comment, upvoteCount, downvoteCount, myVote };
}

export function applyCommentEngagement(
  comment: PostComment,
  engagement: BackendPostCommentEngagement,
): PostComment {
  return {
    ...comment,
    upvoteCount: engagement.upvote_count,
    downvoteCount: engagement.downvote_count,
    myVote: engagement.my_vote,
  };
}
