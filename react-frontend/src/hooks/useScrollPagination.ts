import { useCallback } from 'react';

interface UseScrollPaginationProps {
  totalDBRowCount: number;
  fetchNextPage: () => void;
}

export function useScrollPagination({
  totalDBRowCount,
  fetchNextPage,
}: UseScrollPaginationProps) {
  return useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (!containerRefElement) return;

      const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
      const shouldFetch = scrollHeight - scrollTop - clientHeight < 400;

      if (shouldFetch && totalDBRowCount > 0) {
        fetchNextPage();
      }
    },
    [totalDBRowCount, fetchNextPage],
  );
}
