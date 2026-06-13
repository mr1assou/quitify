import { flagUrlForCode } from "@/constants/leaderboardCountries";
import { CURRENT_USER_ID } from "@/constants/communityUsers";
import type { CommunityUser, PostComment } from "@/types/community";
import type { BackendFeedPostAuthor, BackendPostCommentResponse } from "@/types/postsApi";
import { resolveBadgeIdForSmokeFreeDays } from "@/utils/badges";
import { withMockOnlineStatus } from "@/utils/community/mockOnlineStatus";

export function authorIdFromComment(comment: BackendPostCommentResponse): string {
  return comment.is_mine ? CURRENT_USER_ID : `db-${comment.author.user_id}`;
}

export function mapCommentAuthorToCommunityUser(
  comment: BackendPostCommentResponse,
): CommunityUser {
  const { author } = comment;
  const id = authorIdFromComment(comment);

  return withMockOnlineStatus({
    id,
    name: author.username?.trim() || "Member",
    handle: author.username?.trim().toLowerCase() || `user${author.user_id}`,
    bio: "",
    smokeFreeDays: author.smoke_free_days,
    badgeId: resolveBadgeIdForSmokeFreeDays(author.smoke_free_days, comment.is_mine),
    avatarUrl: author.image_url ?? undefined,
    countryFlag: author.countryFlag ?? flagUrlForCode("us"),
    avatarRank: (author.user_id % 10) + 1,
    leaderboardRank: 0,
    isCurrentUser: comment.is_mine,
    location: author.country ?? undefined,
    isOnline: comment.is_mine ? true : author.is_online,
  });
}

export function mapBackendComment(comment: BackendPostCommentResponse): PostComment {
  return {
    id: String(comment.comment_id),
    postId: String(comment.post_id),
    authorId: authorIdFromComment(comment),
    text: comment.text,
    createdAt: new Date(comment.created_at).getTime(),
  };
}

export function mapCommentsFromApi(comments: BackendPostCommentResponse[]): {
  comments: PostComment[];
  authorsById: Record<string, CommunityUser>;
} {
  const authorsById: Record<string, CommunityUser> = {};
  const mapped = comments.map((row) => {
    const author = mapCommentAuthorToCommunityUser(row);
    authorsById[author.id] = author;
    return mapBackendComment(row);
  });

  return { comments: mapped, authorsById };
}
