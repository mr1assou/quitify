import type { PostTagId } from "@/constants/community/postTags";
import type { TranslationKey } from "@/i18n/translate";
import type { PostFeedSort } from "@/types/community/communityFeedFilter";

export const COMMUNITY_FEED_SORT_OPTIONS: {
  id: PostFeedSort;
  labelKey: TranslationKey;
}[] = [
  {
    id: "newest",
    labelKey: "community.newest",
  },
  {
    id: "hottest",
    labelKey: "community.mostPopular",
  },
  {
    id: "most_commented",
    labelKey: "community.mostDiscussed",
  },
];

export const DEFAULT_COMMUNITY_FEED_FILTER = {
  sort: "newest" as const,
  tagId: null as PostTagId | null,
};

export const COMMUNITY_FEED_PAGE_SIZE = 10;

export function isDefaultCommunityFeedFilter(
  sort: PostFeedSort,
  tagId: PostTagId | null,
): boolean {
  return sort === DEFAULT_COMMUNITY_FEED_FILTER.sort && tagId === null;
}

export function communityFeedFilterSummary(
  sort: PostFeedSort,
  tagId: PostTagId | null,
  t: (key: TranslationKey) => string,
): string {
  const sortKey =
    COMMUNITY_FEED_SORT_OPTIONS.find((option) => option.id === sort)?.labelKey ??
    "community.newest";
  const sortLabel = t(sortKey);
  if (!tagId) return sortLabel;
  return `${sortLabel} · ${t("community.oneTopic")}`;
}
