import type { CommunityPost, PostComment } from "@/types/community/community";

export function buildCommentThread(
  comments: PostComment[],
): Array<{ comment: PostComment; depth: number }> {
  const walk = (
    parentId: string | null,
    depth: number,
    out: Array<{ comment: PostComment; depth: number }>,
  ) => {
    const children = comments
      .filter((comment) => (comment.parentCommentId ?? null) === parentId)
      .sort((a, b) => a.createdAt - b.createdAt);

    for (const child of children) {
      out.push({ comment: child, depth });
      walk(child.id, depth + 1, out);
    }
  };

  const threaded: Array<{ comment: PostComment; depth: number }> = [];
  walk(null, 0, threaded);
  return threaded;
}

export function resolveCommentCountForPost(
  post: CommunityPost,
  comments: PostComment[],
): number {
  if (comments.length > 0) return comments.length;
  return post.commentCount ?? post.commentIds.length;
}
