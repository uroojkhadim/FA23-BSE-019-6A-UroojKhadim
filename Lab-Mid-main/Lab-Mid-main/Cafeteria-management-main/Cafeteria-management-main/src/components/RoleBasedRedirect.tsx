import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" className="text-[#0ea5e9] mb-4" />
          <p className="text-gray-500 animate-pulse">Determining access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found in RoleBasedRedirect, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Define redirection map based on user roles as per requirements
  const roleDashboardMap: Record<string, string> = {
    super_admin: '/super-admin/dashboard',
    admin: '/admin/dashboard',
    staff: '/staff/dashboard',
    teacher: '/teacher/dashboard',
    university_staff: '/university-staff/dashboard',
    student: '/student/dashboard',
  };


  const targetPath = roleDashboardMap[user.role] || '/dashboard';
  console.log(`User role ${user.role} detected, redirecting to ${targetPath}`);
  
  return <Navigate to={targetPath} replace />;
};

export default RoleBasedRedirect;