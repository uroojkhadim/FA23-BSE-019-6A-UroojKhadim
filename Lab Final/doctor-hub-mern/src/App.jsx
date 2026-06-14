import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NewLanding from './pages/NewLanding';
import DoctorSearch from './pages/DoctorSearch';
import PatientDashboardNew from './pages/PatientDashboardNew';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children, role }) {
  const { currentUser, userData, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (role && userData?.role !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewLanding />} />
        <Route path="/search" element={<DoctorSearch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboardNew />
            </ProtectedRoute>
          }
        />
        {/* Fallback to landing for other routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
