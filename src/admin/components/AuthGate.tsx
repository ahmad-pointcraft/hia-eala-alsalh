import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/admin/hooks/useSession';

export function AuthGate() {
  const session = useSession((s) => s.session);
  if (!session) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}
