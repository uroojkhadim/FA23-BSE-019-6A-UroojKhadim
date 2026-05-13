import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner size="lg" className="text-[#0ea5e9]" />
      </div>
    );
  }

  if (user) {
    // Redirect based on role if already authenticated
    const roleDashboardMap: Record<string, string> = {
      super_admin: '/super-admin/dashboard',
      admin: '/admin/dashboard',
      staff: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
    };
    
    return <Navigate to={roleDashboardMap[user.role] || '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
