import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { type UserRole } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" className="text-[#0ea5e9] mb-4" />
          <p className="text-gray-500 animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated, saving the intended destination
    console.log('Unauthenticated access to protected route, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user.role !== 'super_admin' && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized if role not allowed
    console.warn(`User role ${user.role} is not allowed for this route. Allowed: ${allowedRoles.join(', ')}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;