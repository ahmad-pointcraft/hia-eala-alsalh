import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useSession } from '@/admin/store';
import { hasPermission, type Permission } from '@/admin/utils';
import { NotAuthorized } from '@/admin/routes/NotAuthorized';

export interface RoleGateProps {
  /** Capability required to access the guarded route. */
  permission: Permission;
  /** Custom fallback element to render on unauthorized access (defaults to <NotAuthorized />). */
  fallback?: ReactNode;
  /** Child elements to render when authorized. If omitted, renders react-router <Outlet />. */
  children?: ReactNode;
}

/**
 * Route-level guard that evaluates role capabilities before rendering protected content.
 */
export function RoleGate({ permission, fallback, children }: RoleGateProps): JSX.Element {
  const role = useSession((s) => s.session?.user?.role);
  const authorized = hasPermission(role, permission);

  if (!authorized) {
    return <>{fallback ?? <NotAuthorized />}</>;
  }

  return <>{children ?? <Outlet />}</>;
}
