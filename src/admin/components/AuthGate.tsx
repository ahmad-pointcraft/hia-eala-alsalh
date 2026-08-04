import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/admin/store/useSession';

export function AuthGate() {
  const session = useSession((s) => s.session);
  if (!session) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}
