import { flagUrlForCode } from "@/constants/leaderboard/leaderboardCountries";
import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import type { CommunityUser, PostComment } from "@/types/community/community";
import type { BackendFeedPostAuthor, BackendPostCommentResponse } from "@/types/community/postsApi";
import { resolveBadgeIdForSmokeFreeDays } from "@/utils/progress/badges";
import { withMockOnlineStatus } from "@/utils/community/mockOnlineStatus";
import { dbAuthorId } from "@/utils/community/presence";

export function authorIdFromComment(comment: BackendPostCommentResponse): string {
  return dbAuthorId(comment.author.user_id);
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
    parentCommentId:
      comment.parent_comment_id == null ? null : String(comment.parent_comment_id),
    replyToUserId:
      comment.reply_to?.user_id == null ? null : String(comment.reply_to.user_id),
    replyToHandle: comment.reply_to?.username?.trim().toLowerCase() ?? null,
    text: comment.text,
    createdAt: new Date(comment.created_at).getTime(),
    upvoteCount: comment.upvote_count,
    downvoteCount: comment.downvote_count,
    myVote: comment.my_vote,
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
