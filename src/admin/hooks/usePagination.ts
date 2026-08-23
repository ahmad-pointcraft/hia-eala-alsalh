import { useCallback, useState } from 'react';
import type { TablePaginationProps } from '@mui/material';

/** Rows-per-page options shared by all paginated tabs. */
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50] as const;

export interface UsePaginationReturn<T> {
  /** 0-based current page. */
  page: number;
  /** Current rows-per-page (default 10). */
  rowsPerPage: number;
  /** Client-side page slice over the (sorted) full list. */
  slice: (items: T[]) => T[];
  /** Reset to the first page — call after create/delete/reorder mutations. */
  reset: () => void;
  /**
   * Ready-to-spread props for MUI TablePagination, bound to the total row count.
   * Usage: `pagination={paginationProps(sorted.length)}`
   */
  paginationProps: (totalCount: number) => TablePaginationProps;
}

/**
 * The one shared client-side pagination pattern.
 * Owns ALL reset semantics: changing rows-per-page forces page 0, and
 * `reset()` snaps the view back after create/delete/reorder so the affected
 * rows stay visible.
 */
export function usePagination<T>(initialRowsPerPage: number = 10): UsePaginationReturn<T> {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const slice = useCallback(
    (items: T[]): T[] => {
      // IN-RANGE GUARD — NEVER STRAND ON AN OUT-OF-RANGE PAGE
      const maxPage = Math.max(0, Math.ceil(items.length / rowsPerPage) - 1);
      const safePage = Math.min(page, maxPage);
      return items.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
    },
    [page, rowsPerPage],
  );

  const reset = useCallback(() => setPage(0), []);

  const paginationProps = useCallback(
    (totalCount: number): TablePaginationProps => ({
      component: 'div',
      count: totalCount,
      page,
      rowsPerPage,
      rowsPerPageOptions: [...ROWS_PER_PAGE_OPTIONS],
      onPageChange: (_event, newPage) => setPage(newPage),
      onRowsPerPageChange: (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // SIZE CHANGE RESETS TO FIRST PAGE (FR-006)
      },
    }),
    [page, rowsPerPage],
  );

  return { page, rowsPerPage, slice, reset, paginationProps };
}
