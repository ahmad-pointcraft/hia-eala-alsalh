import type { MosqueConfig } from '@/shared/types';
import { mosqueConfigSchema } from '@/shared/types/schema';

/** Validates a MosqueConfig draft for display settings. Returns field-path → error map (empty = valid). */
export function validateDisplaySettings(config: MosqueConfig): Record<string, string> {
  const result = mosqueConfigSchema.safeParse(config);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) errors[path] = issue.message;
  }
  return errors;
}

export function isValid(errors: Record<string, string>): boolean {
  return Object.keys(errors).length === 0;
}
