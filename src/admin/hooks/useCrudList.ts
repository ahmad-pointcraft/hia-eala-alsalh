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
  refresh: () => void;
} {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(() => {
    if (!masjidId) return;
    setLoading(true);
    setError(null);
    fns
      .list(masjidId)
      .then((result) => {
        if (mounted.current) {
          setItems(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted.current) {
          setError(err instanceof Error ? err.message : 'Failed to load');
          setLoading(false);
        }
      });
  }, [masjidId, fns]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: Omit<T, 'id' | 'masjidId'>) => {
      const created = await fns.create(masjidId, input);
      if (mounted.current) setItems((prev) => [...prev, created]);
    },
    [masjidId, fns],
  );

  const update = useCallback(
    async (id: string, patch: P) => {
      const updated = await fns.update(id, patch);
      if (mounted.current) {
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      }
    },
    [fns],
  );

  const updateOptimistic = useCallback(
    async (id: string, patch: P) => {
      const prev = items;
      setItems(prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      try {
        await fns.update(id, patch);
      } catch (err) {
        if (mounted.current) setItems(prev);
        throw err;
      }
    },
    [fns, items],
  );

  const remove = useCallback(
    async (id: string) => {
      await fns.remove(id);
      if (mounted.current) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [fns],
  );

  const reorder = useCallback(
    async (orderedIds: string[]) => {
      if (!fns.reorder) return;
      const prev = items;
      const reordered = orderedIds
        .map((id) => prev.find((item) => item.id === id))
        .filter((item): item is T => item !== undefined);
      if (mounted.current) setItems(reordered);
      try {
        await fns.reorder(masjidId, orderedIds);
      } catch (err) {
        if (mounted.current) setItems(prev);
        throw err;
      }
    },
    [fns, masjidId, items],
  );

  return fns.reorder
    ? { items, loading, error, create, update, updateOptimistic, remove, reorder, refresh }
    : { items, loading, error, create, update, updateOptimistic, remove, refresh };
}
