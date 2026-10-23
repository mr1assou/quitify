import { useCallback, useEffect, useRef, useState } from "react";

import { useCommunity } from "@/context/CommunityContext";
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
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMoreError: string | null;
  isQueryTooShort: boolean;
  isDebouncing: boolean;
  loadMore: () => void;
};

/** Debounced, paginated username search against onboarded normal-role users. */
export function useUserSearch(query: string): UserSearchResult {
  const { state, upsertAuthor } = useCommunity();
  const authorsByIdRef = useRef(state.authorsById);
  authorsByIdRef.current = state.authorsById;

  const normalizedQuery = normalizeUsernameSearchQuery(query);
  const debouncedQuery = useDebouncedValue(normalizedQuery, USERNAME_SEARCH_DEBOUNCE_MS);
  const normalizedQueryRef = useRef(normalizedQuery);
  normalizedQueryRef.current = normalizedQuery;
  const requestGenerationRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const isQueryTooShort =
    debouncedQuery.length > 0 && debouncedQuery.length < USERNAME_SEARCH_MIN_LENGTH;
  const isDebouncing = normalizedQuery !== debouncedQuery;

  useEffect(() => {
    const requestGeneration = ++requestGenerationRef.current;
    setUsers([]);
    setHasMore(false);
    setLoadMoreError(null);

    if (!debouncedQuery || isQueryTooShort) {
      setLoading(false);
      loadingMoreRef.current = false;
      setLoadingMore(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    loadingMoreRef.current = false;
    setLoadingMore(false);

    searchUsersByUsername(debouncedQuery, 0)
      .then((response) => {
        if (
          cancelled ||
          requestGeneration !== requestGenerationRef.current ||
          normalizedQueryRef.current !== debouncedQuery
        ) return;
        const mappedUsers = response.items.map(mapSearchUserToCommunityUser);
        for (const user of mappedUsers) {
          if (!authorsByIdRef.current[user.id]) {
            upsertAuthor(user);
          }
        }
        setUsers(mappedUsers);
        setHasMore(response.has_more);
      })
      .catch(() => {
        if (
          cancelled ||
          requestGeneration !== requestGenerationRef.current ||
          normalizedQueryRef.current !== debouncedQuery
        ) return;
        setUsers([]);
        setError("Could not search users");
      })
      .finally(() => {
        if (!cancelled && requestGeneration === requestGenerationRef.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isQueryTooShort, upsertAuthor]);

  const loadMore = useCallback(async () => {
    if (
      isDebouncing ||
      isQueryTooShort ||
      !hasMore ||
      loading ||
      loadingMoreRef.current
    ) {
      return;
    }

    const requestQuery = debouncedQuery;
    const requestGeneration = requestGenerationRef.current;
    const offset = users.length;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await searchUsersByUsername(requestQuery, offset);
      if (
        requestGeneration !== requestGenerationRef.current ||
        normalizedQueryRef.current !== requestQuery
      ) return;

      const mappedUsers = response.items.map(mapSearchUserToCommunityUser);
      for (const user of mappedUsers) {
        if (!authorsByIdRef.current[user.id]) {
          upsertAuthor(user);
        }
      }

      setUsers((current) => {
        const existingIds = new Set(current.map((user) => user.id));
        return [...current, ...mappedUsers.filter((user) => !existingIds.has(user.id))];
      });
      setHasMore(response.has_more);
    } catch {
      if (
        requestGeneration === requestGenerationRef.current &&
        normalizedQueryRef.current === requestQuery
      ) {
        setLoadMoreError("Could not load more users");
      }
    } finally {
      if (requestGeneration === requestGenerationRef.current) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [
    debouncedQuery,
    hasMore,
    isDebouncing,
    isQueryTooShort,
    loading,
    upsertAuthor,
    users,
  ]);

  return {
    query,
    debouncedQuery,
    users,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMoreError,
    isQueryTooShort,
    isDebouncing,
    loadMore,
  };
}
