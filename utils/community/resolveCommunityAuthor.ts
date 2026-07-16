import { CURRENT_USER_ID, getCommunityUser } from "@/constants/community/communityUsers";
import { FIRST_STEP_BADGE_ID } from "@/constants/progress/badges";
import {
  countryFlagForRank,
  resolveCountryFlagUrl,
} from "@/constants/leaderboard/leaderboardCountries";
import type { CommunityUser } from "@/types/community/community";
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

type BuildCurrentUserOptions = {
  badgeId?: string;
  smokeFreeDays?: number;
};

export function buildCurrentUserCommunityAuthor(
  profile:
    | {
        name?: string;
        imageUrl?: string;
        countryFlag?: string;
        countryCode?: string;
      }
    | null
    | undefined,
  accountName?: string,
  accountUserId?: number | null,
  options?: BuildCurrentUserOptions,
): CommunityUser {
  const seed = getCommunityUser(CURRENT_USER_ID)!;
  const id =
    accountUserId != null && accountUserId > 0 ? `db-${accountUserId}` : CURRENT_USER_ID;

  const countryFlag =
    resolveCountryFlagUrl(profile?.countryFlag, profile?.countryCode) ??
    resolveCountryFlagUrl(seed.countryFlag, seed.location) ??
    countryFlagForRank(seed.avatarRank);

  return withMockOnlineStatus({
    ...seed,
    id,
    name: accountName?.trim() || profile?.name?.trim() || seed.name,
    avatarUrl: profile?.imageUrl ?? seed.avatarUrl,
    countryFlag,
    location: profile?.countryCode ?? seed.location,
    // Never inherit mock seed days/badge (those caused a Champion flash on new posts).
    smokeFreeDays: options?.smokeFreeDays ?? 0,
    badgeId: options?.badgeId ?? FIRST_STEP_BADGE_ID,
    isCurrentUser: true,
    isOnline: true,
  });
}
