import { useMemo } from "react";

import { getCommunityUser } from "@/constants/communityUsers";
import { useCommunity } from "@/context/CommunityContext";
import type { FeedItem } from "@/types/community";

/** Feed for the Community tab: posts + author + preview comments, newest first. */
export function useCommunityFeed(): FeedItem[] {
  const { state } = useCommunity();

  return useMemo(() => {
    const sorted = [...state.posts].sort((a, b) => b.createdAt - a.createdAt);

    return sorted
      .map<FeedItem | null>((post) => {
        const author = getCommunityUser(post.authorId);
        if (!author) return null;

        const previewComments = post.commentIds
          .slice(-2)
          .map((cid) => {
            const comment = state.commentsById[cid];
            const cAuthor = comment ? getCommunityUser(comment.authorId) : undefined;
            return comment && cAuthor ? { comment, author: cAuthor } : null;
          })
          .filter((c): c is NonNullable<typeof c> => c !== null);

        return { post, author, previewComments };
      })
      .filter((item): item is FeedItem => item !== null);
  }, [state.posts, state.commentsById]);
}
