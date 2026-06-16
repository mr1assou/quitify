import type { CommunityPost, PostVote } from "@/types/community/community";

export function applyPostVote(post: CommunityPost, vote: PostVote): CommunityPost {
  if (post.myVote === vote) {
    return {
      ...post,
      myVote: null,
      upvoteCount: vote === "up" ? post.upvoteCount - 1 : post.upvoteCount,
      downvoteCount: vote === "down" ? post.downvoteCount - 1 : post.downvoteCount,
    };
  }

  if (post.myVote === null) {
    return {
      ...post,
      myVote: vote,
      upvoteCount: vote === "up" ? post.upvoteCount + 1 : post.upvoteCount,
      downvoteCount: vote === "down" ? post.downvoteCount + 1 : post.downvoteCount,
    };
  }

  return {
    ...post,
    myVote: vote,
    upvoteCount:
      vote === "up" ? post.upvoteCount + 1 : Math.max(0, post.upvoteCount - 1),
    downvoteCount:
      vote === "down" ? post.downvoteCount + 1 : Math.max(0, post.downvoteCount - 1),
  };
}
