import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type AllowedRole = 'users' | 'vendors';

interface GuardProps {
  children: ReactNode;
}

interface RoleGuardProps extends GuardProps {
  allowedRoles: AllowedRole[];
}

export function RequireAuth({ children }: GuardProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  return <>{children}</>;
}

export function RequireRole({ children, allowedRoles }: RoleGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  // Pengguna baru (role masih null) diarahkan untuk menyelesaikan registrasi
  if (!user?.role) {
    return <Navigate to="/register" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectTo = user.role === 'vendors' ? '/vendor/dashboard' : '/user/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}


