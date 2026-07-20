import type { CommunityPost, PostVote } from "@/types/community/community";

/** Next vote after tapping up/down (same tap clears the vote). */
export function nextPostVote(
  current: PostVote | null,
  tapped: PostVote,
): PostVote | null {
  return current === tapped ? null : tapped;
}

/** Apply an absolute vote state and adjust counts from the previous state. */
export function applyPostVoteState(
  post: CommunityPost,
  next: PostVote | null,
): CommunityPost {
  if (post.myVote === next) return post;

  let upvoteCount = post.upvoteCount;
  let downvoteCount = post.downvoteCount;

  if (post.myVote === "up") upvoteCount = Math.max(0, upvoteCount - 1);
  if (post.myVote === "down") downvoteCount = Math.max(0, downvoteCount - 1);
  if (next === "up") upvoteCount += 1;
  if (next === "down") downvoteCount += 1;

  return {
    ...post,
    myVote: next,
    upvoteCount,
    downvoteCount,
  };
}

/** Apply a tap on up/down (toggle off if the same vote is pressed again). */
export function applyPostVote(post: CommunityPost, vote: PostVote): CommunityPost {
  return applyPostVoteState(post, nextPostVote(post.myVote, vote));
}
