import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheStore } from '@/display/services';

interface UseCachedDataOptions<T> {
  dateScoped?: boolean;
  /** IANA time zone used to resolve the date-scope boundary (masjid midnight). */
  timeZone?: string;
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
  const { dateScoped = false, timeZone, fallback, currentTime } = options;

  const cacheKey = dateScoped
    ? cacheStore.buildKey(key, currentTime, timeZone)
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
      // MARK THE INITIAL CHAIN AS HANDLED — the error already surfaces via the
      // `error` state; without this the mount-time call rejects unhandled.
      promise.catch(() => undefined);
    },
    [ttlMs],
  );

  const currentMinute = currentTime.getMinutes();
  const currentHour = currentTime.getHours();

  const didMountRef = useRef(false);

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
      setError(undefined);
      setIsLoading(false);
      triggerFetch(cacheKey);
      return;
    }

    // STALE-WHILE-REVALIDATE ON MOUNT — serve persisted cache instantly,
    // and always fetch on mount so cold-start or fresh pairing loads immediately.
    if (!didMountRef.current) {
      didMountRef.current = true;
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
  }, [cacheKey, fallback, triggerFetch, currentMinute, currentHour]);

  // PUSH INVALIDATION — when a realtime content change invalidates our key,
  // refetch immediately (don't wait for the TTL or the next minute tick).
  useEffect(() => {
    return cacheStore.subscribe((invalidatedKey) => {
      if (invalidatedKey === cacheKey) {
        triggerFetch(cacheKey);
      }
    });
  }, [cacheKey, triggerFetch]);

  return { data, isLoading, error };
}
