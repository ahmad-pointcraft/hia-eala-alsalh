/* ----------- FORMATS A TIMESTAMP INTO A HUMAN-READABLE RELATIVE TIME STRING ---------- */
export function formatLastSeen(at: number | null): string {
  if (!at) return '—';
  const diff = Date.now() - at;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(at).toLocaleDateString();
}
