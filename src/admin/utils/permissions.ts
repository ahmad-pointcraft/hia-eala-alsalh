import type { UserRole } from '@/shared/api';

export type Permission =
  | 'devices:manage'
  | 'timings:manage'
  | 'content:manage'
  | 'images:manage'
  | 'settings:manage'
  | 'team:manage';

export const PERMISSION_MATRIX: Record<UserRole, readonly Permission[]> = {
  masjid_admin: [
    'devices:manage',
    'timings:manage',
    'content:manage',
    'images:manage',
    'settings:manage',
    'team:manage',
  ],
  content_editor: [
    'content:manage',
    'images:manage',
  ],
} as const;

export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/devices': 'devices:manage',
  '/timings': 'timings:manage',
  '/content': 'content:manage',
  '/images': 'images:manage',
  '/settings': 'settings:manage',
  '/team': 'team:manage',
};

/**
 * Checks whether a user role possesses a specific capability.
 * Prohibits raw role string comparisons in UI components (Article V DRY).
 */
export function hasPermission(
  role: UserRole | undefined | null,
  permission: Permission,
): boolean {
  if (!role) return false;
  return PERMISSION_MATRIX[role]?.includes(permission) ?? false;
}
