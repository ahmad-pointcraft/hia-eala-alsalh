import { useCallback, useRef } from 'react';
import type { RefCallback } from 'react';

/**
 * Ref callback that focuses the attached heading once on mount —
 * the SPA route-change announcement pattern for screen readers.
 * Attach to each route page's `<Typography component="h1" tabIndex={-1}>`.
 */
export function useFocusHeading<T extends HTMLElement>(): RefCallback<T> {
  const focused = useRef(false);
  return useCallback((node: T | null) => {
    if (node && !focused.current) {
      focused.current = true;
      node.focus();
    }
  }, []);
}
