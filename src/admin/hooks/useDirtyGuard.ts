import { useEffect, useCallback } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * Dirty guard — prevents accidental navigation away with unsaved changes.
 * Uses react-router useBlocker for in-app navigation + beforeunload for browser close.
 */
export function useDirtyGuard(dirty: boolean) {
  const blocker = useBlocker(
    useCallback(() => dirty, [dirty]),
  );

  // Warn on browser close/refresh
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  return blocker;
}
