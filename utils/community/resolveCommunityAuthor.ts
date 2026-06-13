import { CURRENT_USER_ID, getCommunityUser } from "@/constants/communityUsers";
import type { CommunityUser } from "@/types/community";
import { resolveOnlineFromMap } from "@/utils/community/presence";
import { withMockOnlineStatus } from "@/utils/community/mockOnlineStatus";

type ResolveOptions = {
  authorsById?: Record<string, CommunityUser>;
  /** Latest profile photo for the signed-in user (from auth/me). */
  currentUserImageUrl?: string;
  /** Live presence from WebSocket / Redis. */
  onlineByUserId?: Record<number, boolean>;
  presenceReady?: boolean;
};

function applyRealtimePresence(
  author: CommunityUser,
  authorId: string,
  onlineByUserId?: Record<number, boolean>,
  presenceReady = false,
): CommunityUser {
  if (authorId === CURRENT_USER_ID || author.isCurrentUser) {
    return { ...author, isOnline: true };
  }

  const live = resolveOnlineFromMap(
    authorId,
    onlineByUserId ?? {},
    author.isOnline,
    presenceReady,
  );
  if (live === undefined) return author;
  return { ...author, isOnline: live };
}

export function resolveCommunityAuthor(
  authorId: string,
  options: ResolveOptions = {},
): CommunityUser | undefined {
  const { authorsById = {}, currentUserImageUrl, onlineByUserId, presenceReady } = options;
  const author = authorsById[authorId] ?? getCommunityUser(authorId);
  if (!author) return undefined;

  let resolved = applyRealtimePresence(
    withMockOnlineStatus(author),
    authorId,
    onlineByUserId,
    presenceReady,
  );

  if (authorId !== CURRENT_USER_ID && !author.isCurrentUser) {
    return resolved;
  }

  const avatarUrl = currentUserImageUrl ?? resolved.avatarUrl;
  if (avatarUrl === resolved.avatarUrl) return resolved;

  return { ...resolved, avatarUrl };
}

export function buildCurrentUserCommunityAuthor(
  profile: { name?: string; imageUrl?: string } | null | undefined,
  accountName?: string,
): CommunityUser {
  const seed = getCommunityUser(CURRENT_USER_ID)!;

  return withMockOnlineStatus({
    ...seed,
    name: accountName?.trim() || profile?.name?.trim() || seed.name,
    avatarUrl: profile?.imageUrl ?? seed.avatarUrl,
    isOnline: true,
  });
}
