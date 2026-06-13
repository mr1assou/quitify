import { CURRENT_USER_ID, getCommunityUser } from "@/constants/communityUsers";
import type { CommunityUser } from "@/types/community";

type ResolveOptions = {
  authorsById?: Record<string, CommunityUser>;
  /** Latest profile photo for the signed-in user (from auth/me). */
  currentUserImageUrl?: string;
};

export function resolveCommunityAuthor(
  authorId: string,
  options: ResolveOptions = {},
): CommunityUser | undefined {
  const { authorsById = {}, currentUserImageUrl } = options;
  const author = authorsById[authorId] ?? getCommunityUser(authorId);
  if (!author) return undefined;

  if (authorId !== CURRENT_USER_ID && !author.isCurrentUser) {
    return author;
  }

  const avatarUrl = currentUserImageUrl ?? author.avatarUrl;
  if (avatarUrl === author.avatarUrl) return author;

  return { ...author, avatarUrl };
}

export function buildCurrentUserCommunityAuthor(
  profile: { name?: string; imageUrl?: string } | null | undefined,
  accountName?: string,
): CommunityUser {
  const seed = getCommunityUser(CURRENT_USER_ID)!;

  return {
    ...seed,
    name: accountName?.trim() || profile?.name?.trim() || seed.name,
    avatarUrl: profile?.imageUrl ?? seed.avatarUrl,
  };
}
