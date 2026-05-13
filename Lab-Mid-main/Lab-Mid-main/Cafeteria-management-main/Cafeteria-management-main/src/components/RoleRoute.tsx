import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { type UserRole } from '@/store/authStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RoleRouteProps {
  children: ReactNode;
  roles: UserRole[];
  allowGuest?: boolean;
}

export default function RoleRoute({ children, roles, allowGuest = false }: RoleRouteProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (!user) {
    if (allowGuest) {
      return <>{children}</>;
    }

    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
