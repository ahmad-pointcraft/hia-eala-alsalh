interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  cachedAt: number;
}

class CacheStore {
  private memory = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();
  private readonly STORAGE_PREFIX = 'hia-cache:';

  get<T>(key: string): T | undefined {
    const memEntry = this.memory.get(key);
    if (memEntry !== undefined) {
      return memEntry.data as T;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        this.memory.set(key, entry as CacheEntry<unknown>);
        return entry.data;
      }
    } catch {
      // localStorage unavailable or corrupted
    }

    return undefined;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttlMs,
      cachedAt: Date.now(),
    };

    this.memory.set(key, entry as CacheEntry<unknown>);

    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // localStorage full or unavailable
    }
  }

  isExpired(key: string): boolean {
    const memEntry = this.memory.get(key);
    if (memEntry !== undefined) {
      return Date.now() > memEntry.expiresAt;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (stored) {
        const entry: CacheEntry<unknown> = JSON.parse(stored);
        return Date.now() > entry.expiresAt;
      }
    } catch {
      // localStorage unavailable
    }

    return true;
  }

  invalidate(key: string): void {
    this.memory.delete(key);
    this.pendingRequests.delete(key);
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch {
      // localStorage unavailable
    }
  }

  getPending<T>(key: string): Promise<T> | undefined {
    return this.pendingRequests.get(key) as Promise<T> | undefined;
  }

  setPending<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, promise);
  }

  clearPending(key: string): void {
    this.pendingRequests.delete(key);
  }

  buildKey(feature: string, dateScope?: Date): string {
    if (dateScope) {
      const dateStr = dateScope.toISOString().slice(0, 10);
      return `${feature}:${dateStr}`;
    }
    return feature;
  }
}

export const cacheStore = new CacheStore();
export type { CacheEntry };
