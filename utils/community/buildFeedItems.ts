import type { CommunityPost, CommunityUser, FeedItem } from "@/types/community";

import { resolveCommunityAuthor } from "./resolveCommunityAuthor";

export function buildFeedItems(
  posts: CommunityPost[],
  authorsById: Record<string, CommunityUser> = {},
  currentUserImageUrl?: string,
): FeedItem[] {
  return posts
    .map<FeedItem | null>((post) => {
      const author = resolveCommunityAuthor(post.authorId, {
        authorsById,
        currentUserImageUrl,
      });
      if (!author) return null;

      return { post, author };
    })
    .filter((item): item is FeedItem => item !== null);
}
