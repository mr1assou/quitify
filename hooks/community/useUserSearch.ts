import { useMemo } from "react";

import { COMMUNITY_USERS } from "@/constants/community/communityUsers";
import type { CommunityUser } from "@/types/community/community";
import { normalizeSearch } from "@/utils/community";

export type UserSearchResult = {
  query: string;
  users: CommunityUser[];
};

/** Simple in-memory user search (name, handle, location, bio). */
export function useUserSearch(query: string): UserSearchResult {
  return useMemo(() => {
    const needle = normalizeSearch(query);
    if (!needle) {
      return {
        query,
        users: COMMUNITY_USERS.filter((u) => !u.isCurrentUser),
      };
    }

    const users = COMMUNITY_USERS.filter((u) => {
      if (u.isCurrentUser) return false;
      return [u.name, u.handle, u.bio, u.location ?? ""]
        .map(normalizeSearch)
        .some((field) => field.includes(needle));
    });

    return { query, users };
  }, [query]);
}
