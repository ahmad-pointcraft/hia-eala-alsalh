import { useCallback, useEffect, useRef, useState } from 'react';
import type { Update } from '@/shared/api/contract';

/** Generic CRUD list hook with optional reorder. The type param `P` defaults to `Update<T>`. */
export function useCrudList<
  T extends { id: string; masjidId: string },
  P = Update<T>,
>(
  masjidId: string,
  fns: {
    list: (masjidId: string) => Promise<T[]>;
    create: (masjidId: string, input: Omit<T, 'id' | 'masjidId'>) => Promise<T>;
    update: (id: string, patch: P) => Promise<T>;
    remove: (id: string) => Promise<void>;
    reorder?: (masjidId: string, orderedIds: string[]) => Promise<void>;
  },
): {
  items: T[];
  loading: boolean;
  error: string | null;
  create: (input: Omit<T, 'id' | 'masjidId'>) => Promise<void>;
  update: (id: string, patch: P) => Promise<void>;
  updateOptimistic: (id: string, patch: P) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reorder?: (orderedIds: string[]) => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fnsRef = useRef(fns);
  fnsRef.current = fns;

  // STALE-RESPONSE GUARD — only the most recent list request may write state
  const listReqIdRef = useRef(0);

  const refresh = useCallback((): Promise<void> => {
    if (!masjidId) {
      listReqIdRef.current++;
      setLoading(false);
      setError(null);
      return Promise.resolve();
    }
    const reqId = ++listReqIdRef.current;
    setLoading(true);
    setError(null);
    return fnsRef.current
      .list(masjidId)
      .then((result) => {
        if (reqId !== listReqIdRef.current) return;
        setItems([...result]);
        setLoading(false);
      })
      .catch((err) => {
        if (reqId !== listReqIdRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load');
        setLoading(false);
      });
  }, [masjidId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: Omit<T, 'id' | 'masjidId'>) => {
      await fnsRef.current.create(masjidId, input);
      await refresh();
    },
    [masjidId, refresh],
  );

  const update = useCallback(
    async (id: string, patch: P) => {
      await fnsRef.current.update(id, patch);
      await refresh();
    },
    [refresh],
  );

  const updateOptimistic = useCallback(
    async (id: string, patch: P) => {
      const prev = items;
      setItems(prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      try {
        await fnsRef.current.update(id, patch);
      } catch (err) {
        setItems(prev);
        throw err;
      }
    },
    [items],
  );

  const remove = useCallback(
    async (id: string) => {
      await fnsRef.current.remove(id);
      await refresh();
    },
    [refresh],
  );

  const reorder = useCallback(
    async (orderedIds: string[]) => {
      if (!fnsRef.current.reorder) return;
      const prev = items;
      const reordered = orderedIds
        .map((id, index) => {
          const item = prev.find((it) => it.id === id);
          return item ? ({ ...item, order: index } as T) : undefined;
        })
        .filter((item): item is T => item !== undefined);
      setItems(reordered);
      try {
        await fnsRef.current.reorder(masjidId, orderedIds);
      } catch (err) {
        setItems(prev);
        throw err;
      }
    },
    [masjidId, items],
  );

  return fns.reorder
    ? { items, loading, error, create, update, updateOptimistic, remove, reorder, refresh }
    : { items, loading, error, create, update, updateOptimistic, remove, refresh };
}
