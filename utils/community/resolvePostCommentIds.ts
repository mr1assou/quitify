import type { CommunityPost, PostComment } from "@/types/community/community";

type CommentState = {
  posts: CommunityPost[];
  commentsById: Record<string, PostComment>;
  commentsLoadedByPostId?: Record<string, boolean>;
};

/** Resolves comment ids from the post, feed cache, or loaded comments store. */
export function resolvePostCommentIds(
  post: CommunityPost,
  state: CommentState,
): string[] {
  const ids = new Set<string>();

  for (const id of post.commentIds) {
    ids.add(id);
  }

  const fromFeed = state.posts.find((p) => p.id === post.id)?.commentIds ?? [];
  for (const id of fromFeed) {
    ids.add(id);
  }

  for (const comment of Object.values(state.commentsById)) {
    if (comment.postId === post.id) {
      ids.add(comment.id);
    }
  }

  return Array.from(ids).sort((a, b) => {
    const commentA = state.commentsById[a];
    const commentB = state.commentsById[b];
    if (!commentA || !commentB) return 0;
    return commentA.createdAt - commentB.createdAt;
  });
}

export function countLoadedPostComments(
  postId: string,
  commentsById: Record<string, PostComment>,
): number {
  return Object.values(commentsById).filter((comment) => comment.postId === postId).length;
}

export function hasLoadedPostComments(
  postId: string,
  state: CommentState,
): boolean {
  return state.commentsLoadedByPostId?.[postId] === true;
}
