import { useEffect, useMemo, useState } from "react";

import { STATS_LIST_PAGE_SIZE } from "@/constants/statsListPagination";

export function usePaginatedList<T>(
  items: T[],
  resetKey?: string | number,
  pageSize = STATS_LIST_PAGE_SIZE,
) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [resetKey, items.length]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  return {
    page: safePage,
    totalPages,
    setPage,
    paginatedItems,
  };
}
