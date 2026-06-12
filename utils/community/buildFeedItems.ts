import { getCommunityUser } from "@/constants/communityUsers";
import type { CommunityPost, FeedItem, PostComment } from "@/types/community";

export function buildFeedItems(
  posts: CommunityPost[],
  commentsById: Record<string, PostComment>,
): FeedItem[] {
  return posts
    .map<FeedItem | null>((post) => {
      const author = getCommunityUser(post.authorId);
      if (!author) return null;

      const previewComments = post.commentIds
        .slice(-2)
        .map((cid) => {
          const comment = commentsById[cid];
          const cAuthor = comment ? getCommunityUser(comment.authorId) : undefined;
          return comment && cAuthor ? { comment, author: cAuthor } : null;
        })
        .filter((c): c is NonNullable<typeof c> => c !== null);

      return { post, author, previewComments };
    })
    .filter((item): item is FeedItem => item !== null);
}
