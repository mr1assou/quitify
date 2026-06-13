import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import type { CommunityPost, FeedItem, PostComment } from "@/types/community";
import type { PlayerProfile } from "@/types/playerProfile";
import { buildFeedItems } from "@/utils/community/buildFeedItems";
import { resolveProfileCommunityUserId } from "@/utils/profile/communityProfileLinks";

export type ProfileActivityComment = {
  comment: PostComment;
  post: CommunityPost;
};

function syntheticUpvotedPosts(
  profile: PlayerProfile,
  posts: CommunityPost[],
  communityUserId: string,
): CommunityPost[] {
  return posts
    .filter((post) => post.authorId !== communityUserId)
    .filter((post, index) => (profile.rank * 7 + index) % 5 === 0)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function useProfileActivity(profile: PlayerProfile) {
  const { state } = useCommunity();
  const { state: appState } = useApp();
  const communityUserId = resolveProfileCommunityUserId(profile);
  const currentUserImageUrl = appState.profile?.imageUrl;

  return useMemo(() => {
    const posts = state.posts
      .filter((post) => post.authorId === communityUserId)
      .sort((a, b) => b.createdAt - a.createdAt);

    const postFeed = buildFeedItems(posts, state.authorsById, currentUserImageUrl);

    const comments: ProfileActivityComment[] = Object.values(state.commentsById)
      .filter((comment) => comment.authorId === communityUserId)
      .map((comment) => {
        const post = state.posts.find((item) => item.id === comment.postId);
        return post ? { comment, post } : null;
      })
      .filter((item): item is ProfileActivityComment => item != null)
      .sort((a, b) => b.comment.createdAt - a.comment.createdAt);

    const upvotedPosts = profile.isCurrentUser
      ? state.posts
          .filter((post) => post.myVote === "up")
          .sort((a, b) => b.createdAt - a.createdAt)
      : syntheticUpvotedPosts(profile, state.posts, communityUserId);

    const upvotedFeed = buildFeedItems(upvotedPosts, state.authorsById, currentUserImageUrl);

    return { postFeed, comments, upvotedFeed, communityUserId };
  }, [communityUserId, currentUserImageUrl, profile, state.authorsById, state.commentsById, state.posts]);
}
