import type { PostTagId } from '@/constants/postTags';

export type PostFeedSort =
  | 'newest'
  | 'hottest'
  | 'most_commented';

export type CommunityFeedFilter = {
  sort: PostFeedSort;
  tagId: PostTagId | null;
};

export type CommunityFeedFilterQuery = {
  sort: PostFeedSort;
  tag_id?: string;
};
