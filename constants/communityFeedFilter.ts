import type { PostTagId } from '@/constants/postTags';
import type { PostFeedSort } from '@/types/communityFeedFilter';

export const COMMUNITY_FEED_SORT_OPTIONS: {
  id: PostFeedSort;
  label: string;
  description: string;
}[] = [
  {
    id: 'newest',
    label: 'Newest',
    description: 'Latest posts first',
  },
  {
    id: 'hottest',
    label: 'Most popular',
    description: 'Top upvoted posts',
  },
  {
    id: 'most_commented',
    label: 'Most discussed',
    description: 'Posts with the most comments',
  },
];

export const DEFAULT_COMMUNITY_FEED_FILTER = {
  sort: 'newest' as const,
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
): string {
  const sortLabel =
    COMMUNITY_FEED_SORT_OPTIONS.find((option) => option.id === sort)?.label ?? 'Newest';
  if (!tagId) return sortLabel;
  return `${sortLabel} · 1 topic`;
}
