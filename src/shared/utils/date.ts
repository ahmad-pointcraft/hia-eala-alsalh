// ==================== TIME CONSTANTS ====================
export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

/** Computes a future timestamp offset from the current time. */
export function getExpirationTime(durationMs: number): number {
  return Date.now() + durationMs;
}

/** Checks if a given timestamp has expired relative to current time. */
export function isExpired(expiresAt: number | null | undefined): boolean {
  if (!expiresAt) return false;
  return Date.now() > expiresAt;
}

/* ----------- FORMATS A TIMESTAMP INTO A HUMAN-READABLE RELATIVE TIME STRING ---------- */
export function formatLastSeen(at: number | null): string {
  if (!at) return '—';
  const diff = Date.now() - at;
  const mins = Math.floor(diff / MS_PER_MINUTE);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(at).toLocaleDateString();
}
