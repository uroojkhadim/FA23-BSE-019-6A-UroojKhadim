import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log('🛡️ [ProtectedRoute]', {
    pathname: location.pathname,
    loading,
    isAuthenticated: !!user,
  });

  if (loading) {
    console.log('🛡️ [ProtectedRoute] Showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    console.log('🛡️ [ProtectedRoute] No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('🛡️ [ProtectedRoute] All good, rendering children');
  return children;
};

export default ProtectedRoute;
