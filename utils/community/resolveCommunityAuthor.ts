import { CURRENT_USER_ID, getCommunityUser } from "@/constants/communityUsers";
import type { CommunityUser } from "@/types/community";
import { parseDbUserId, resolveOnlineFromMap } from "@/utils/community/presence";
import { withMockOnlineStatus } from "@/utils/community/mockOnlineStatus";

type ResolveOptions = {
  authorsById?: Record<string, CommunityUser>;
  /** Latest profile photo for the signed-in user (from auth/me). */
  currentUserImageUrl?: string;
  /** Database user id of the signed-in viewer. */
  currentAccountUserId?: number | null;
  /** Live presence from WebSocket / Redis. */
  onlineByUserId?: Record<number, boolean>;
  presenceReady?: boolean;
};

function isAuthorCurrentViewer(
  author: CommunityUser,
  authorId: string,
  currentAccountUserId?: number | null,
): boolean {
  if (currentAccountUserId != null && currentAccountUserId > 0) {
    const authorDbId = parseDbUserId(author.id) ?? parseDbUserId(authorId);
    return authorDbId === currentAccountUserId;
  }

  return authorId === CURRENT_USER_ID || author.id === CURRENT_USER_ID;
}

function applyRealtimePresence(
  author: CommunityUser,
  authorId: string,
  isCurrentUser: boolean,
  onlineByUserId?: Record<number, boolean>,
  presenceReady = false,
): CommunityUser {
  if (isCurrentUser) {
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
  const {
    authorsById = {},
    currentUserImageUrl,
    currentAccountUserId,
    onlineByUserId,
    presenceReady,
  } = options;
  const author = authorsById[authorId] ?? getCommunityUser(authorId);
  if (!author) return undefined;

  const isCurrentUser = isAuthorCurrentViewer(author, authorId, currentAccountUserId);

  let resolved = applyRealtimePresence(
    withMockOnlineStatus({ ...author, isCurrentUser }),
    authorId,
    isCurrentUser,
    onlineByUserId,
    presenceReady,
  );

  if (!isCurrentUser) {
    return resolved;
  }

  const avatarUrl = currentUserImageUrl ?? resolved.avatarUrl;
  if (avatarUrl === resolved.avatarUrl) return resolved;

  return { ...resolved, avatarUrl };
}

export function buildCurrentUserCommunityAuthor(
  profile: { name?: string; imageUrl?: string } | null | undefined,
  accountName?: string,
  accountUserId?: number | null,
): CommunityUser {
  const seed = getCommunityUser(CURRENT_USER_ID)!;
  const id =
    accountUserId != null && accountUserId > 0 ? `db-${accountUserId}` : CURRENT_USER_ID;

  return withMockOnlineStatus({
    ...seed,
    id,
    name: accountName?.trim() || profile?.name?.trim() || seed.name,
    avatarUrl: profile?.imageUrl ?? seed.avatarUrl,
    isCurrentUser: true,
    isOnline: true,
  });
}
