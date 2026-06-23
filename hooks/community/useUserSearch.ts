import { useEffect, useState } from "react";

import {
  USERNAME_SEARCH_DEBOUNCE_MS,
  USERNAME_SEARCH_MIN_LENGTH,
} from "@/utils/community/usernameSearch";
import { useDebouncedValue } from "@/hooks/shared/useDebouncedValue";
import { searchUsersByUsername } from "@/services/users/searchUsersApi";
import type { CommunityUser } from "@/types/community/community";
import { mapSearchUserToCommunityUser } from "@/utils/community/mapSearchUser";
import { normalizeUsernameSearchQuery } from "@/utils/community/usernameSearch";

export type UserSearchResult = {
  query: string;
  debouncedQuery: string;
  users: CommunityUser[];
  loading: boolean;
  error: string | null;
  isQueryTooShort: boolean;
};

/** Debounced username search against onboarded normal-role users. */
export function useUserSearch(query: string): UserSearchResult {
  const normalizedQuery = normalizeUsernameSearchQuery(query);
  const debouncedQuery = useDebouncedValue(normalizedQuery, USERNAME_SEARCH_DEBOUNCE_MS);
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isQueryTooShort =
    debouncedQuery.length > 0 && debouncedQuery.length < USERNAME_SEARCH_MIN_LENGTH;

  useEffect(() => {
    if (!debouncedQuery || isQueryTooShort) {
      setUsers([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    searchUsersByUsername(debouncedQuery)
      .then((response) => {
        if (cancelled) return;
        setUsers(response.items.map(mapSearchUserToCommunityUser));
      })
      .catch(() => {
        if (cancelled) return;
        setUsers([]);
        setError("Could not search users");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isQueryTooShort]);

  return {
    query,
    debouncedQuery,
    users,
    loading,
    error,
    isQueryTooShort,
  };
}
