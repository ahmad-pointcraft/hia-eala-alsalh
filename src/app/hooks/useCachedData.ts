import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheStore } from '@/app/services/cache';

interface UseCachedDataOptions<T> {
  dateScoped?: boolean;
  fallback?: T;
  currentTime: Date;
}

interface UseCachedDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
  options: UseCachedDataOptions<T>,
): UseCachedDataResult<T> {
  const { dateScoped = false, fallback, currentTime } = options;

  const cacheKey = dateScoped
    ? cacheStore.buildKey(key, currentTime)
    : cacheStore.buildKey(key);

  const [data, setData] = useState<T | undefined>(() => {
    const cached = cacheStore.get<T>(cacheKey);
    return cached ?? fallback;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const prevKeyRef = useRef(cacheKey);
  const fetchRef = useRef(fetcher);
  fetchRef.current = fetcher;

  const triggerFetch = useCallback(
    (ck: string): void => {
      const pending = cacheStore.getPending<T>(ck);
      if (pending) {
        setIsLoading(true);
        pending
          .then((result) => {
            setData(result);
            setError(undefined);
          })
          .catch((err: unknown) => {
            setError(err instanceof Error ? err : new Error(String(err)));
          })
          .finally(() => {
            setIsLoading(false);
          });
        return;
      }

      setIsLoading(true);
      const promise = fetchRef
        .current()
        .then((result) => {
          cacheStore.set(ck, result, ttlMs);
          setData(result);
          setError(undefined);
          return result;
        })
        .catch((err: unknown) => {
          const cachedFallback = cacheStore.get<T>(ck);
          if (cachedFallback !== undefined) {
            setData(cachedFallback);
            setError(undefined);
            return cachedFallback;
          }
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          throw error;
        })
        .finally(() => {
          cacheStore.clearPending(ck);
          setIsLoading(false);
        });

      cacheStore.setPending(ck, promise);
    },
    [ttlMs],
  );

  useEffect(() => {
    if (prevKeyRef.current !== cacheKey) {
      prevKeyRef.current = cacheKey;
      const cached = cacheStore.get<T>(cacheKey);
      if (cached !== undefined) {
        setData(cached);
        setError(undefined);
        setIsLoading(false);
        return;
      }

      setData(fallback);
      triggerFetch(cacheKey);
      return;
    }

    if (cacheStore.isExpired(cacheKey)) {
      const cached = cacheStore.get<T>(cacheKey);
      if (cached !== undefined) {
        setData(cached);
      }
      triggerFetch(cacheKey);
    }
  }, [cacheKey, fallback, triggerFetch]);

  return { data, isLoading, error };
}
