import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/admin/store';
import { isExpired } from '@/shared/utils';

export function AuthGate(): JSX.Element {
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
