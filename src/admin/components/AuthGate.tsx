import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/admin/store/useSession';
import { isExpired } from '@/shared/utils';
import { useEffect } from 'react';

export function AuthGate() {
  const session = useSession((s) => s.session);
  const signOut = useSession((s) => s.signOut);
  const expired = isExpired(session?.expiresAt);

  useEffect(() => {
    if (expired) {
      void signOut();
    }
  }, [expired, signOut]);

  if (!session || expired) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
