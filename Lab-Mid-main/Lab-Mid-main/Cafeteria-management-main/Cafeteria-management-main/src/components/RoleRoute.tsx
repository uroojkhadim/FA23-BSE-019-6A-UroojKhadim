import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type UserRole } from '@/store/authStore';

interface RoleRouteProps {
  children: ReactNode;
  roles: UserRole[];
  allowGuest?: boolean;
}

export default function RoleRoute({ children, roles, allowGuest = false }: RoleRouteProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  if (!user) {
    if (allowGuest) {
      return <>{children}</>;
    }

    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
