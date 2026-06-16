import type { CommunityFeedFilter } from "@/types/community/communityFeedFilter";

export type PostsQueryPagination = {
  offset?: number;
  limit?: number;
};

export function buildPostsQueryString(
  filter: CommunityFeedFilter,
  pagination?: PostsQueryPagination,
): string {
  const params = new URLSearchParams();
  params.set("sort", filter.sort);
  if (filter.tagId) params.set("tag_id", filter.tagId);
  if (pagination?.offset != null) params.set("offset", String(pagination.offset));
  if (pagination?.limit != null) params.set("limit", String(pagination.limit));
  const query = params.toString();
  return query ? `?${query}` : "";
}
