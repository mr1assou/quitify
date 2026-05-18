import { useMemo } from "react";

import { getCommunityUser } from "@/constants/communityUsers";
import { useCommunity } from "@/context/CommunityContext";
import type { CommunityPost, CommunityUser, PostComment } from "@/types/community";

export type CommunityPostDetail = {
  post: CommunityPost;
  author: CommunityUser;
  comments: Array<{ comment: PostComment; author: CommunityUser }>;
};

export function useCommunityPost(postId: string): CommunityPostDetail | null {
  const { state } = useCommunity();

  return useMemo(() => {
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return null;
    const author = getCommunityUser(post.authorId);
    if (!author) return null;

    const comments = post.commentIds
      .map((cid) => state.commentsById[cid])
      .filter((c): c is PostComment => Boolean(c))
      .map((c) => {
        const cAuthor = getCommunityUser(c.authorId);
        return cAuthor ? { comment: c, author: cAuthor } : null;
      })
      .filter((c): c is { comment: PostComment; author: CommunityUser } => c !== null);

    return { post, author, comments };
  }, [postId, state.posts, state.commentsById]);
}
