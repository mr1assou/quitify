import type { PostComment } from "@/types/community";
import { parseDbUserId } from "@/utils/community/presence";

export function resolveCommentPermissions(
  comment: PostComment,
  postAuthorId: string,
  currentAccountUserId?: number | null,
): { canEdit: boolean; canDelete: boolean } {
  if (currentAccountUserId == null || currentAccountUserId <= 0) {
    return { canEdit: false, canDelete: false };
  }

  const authorDbId = parseDbUserId(comment.authorId);
  const postOwnerDbId = parseDbUserId(postAuthorId);
  const isAuthor = authorDbId === currentAccountUserId;
  const isPostOwner = postOwnerDbId === currentAccountUserId;

  return {
    canEdit: isAuthor,
    canDelete: isAuthor || isPostOwner,
  };
}
