import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LandingPage         from './pages/LandingPage'
import LoginPage           from './pages/LoginPage'
import RegisterPage        from './pages/RegisterPage'
import StudentDashboard    from './pages/StudentDashboard'
import SupervisorDashboard from './pages/SupervisorDashboard'
import LibrarianDashboard  from './pages/LibrarianDashboard'
import AdminDashboard      from './pages/AdminDashboard'
import SeedPage            from './pages/SeedPage'
import { ToastProvider, ToastContainer } from './components/layout/Toast'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-navy/40 font-body text-sm">Loading…</span>
      </div>
    </div>
  )
  
  if (!user) {
    console.log('[ProtectedRoute] No user found, redirecting to /login')
    return <Navigate to="/login" replace />
  }

  if (roles && user.role && !roles.includes(user.role)) {
    console.log(`[ProtectedRoute] Role mismatch. User: ${user.role}, Allowed: ${roles.join(', ')}. Redirecting to /`)
    return <Navigate to="/" replace />
  }
  
  return children
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  
  console.log('[DashboardRedirect] Redirecting user with role:', user.role)
  
  const routes = { 
    student: '/student-dashboard', 
    supervisor: '/supervisor-dashboard', 
    librarian: '/librarian-dashboard', 
    admin: '/admin-dashboard',
    subadmin: '/admin-dashboard'
  }
  
  const target = user.role ? (routes[user.role] || '/login') : '/login'
  return <Navigate to={target} replace />
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/seed"      element={<SeedPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

        <Route path="/student-dashboard/*"    element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/supervisor-dashboard/*" element={<ProtectedRoute roles={['supervisor']}><SupervisorDashboard /></ProtectedRoute>} />
        <Route path="/librarian-dashboard/*"  element={<ProtectedRoute roles={['librarian']}><LibrarianDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard/*"      element={<ProtectedRoute roles={['admin', 'subadmin']}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
