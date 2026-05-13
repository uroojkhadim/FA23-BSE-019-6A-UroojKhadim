import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-center';
import { Mail as MailIcon, Lock as LockIcon, AlertCircle as AlertIcon, LogIn as LogInIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser } from '@/lib/emailAuth';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import ComsatsLogo from '@/components/ui/ComsatsLogo';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { setUser } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      const roleDashboardMap: Record<string, string> = {
        super_admin: '/super-admin/dashboard',
        admin: '/admin/dashboard',
        staff: '/staff/dashboard',
        teacher: '/teacher/dashboard',
        university_staff: '/university-staff/dashboard',
        student: '/student/dashboard',
      };
      
      const from = (location.state as any)?.from?.pathname || roleDashboardMap[user.role] || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginUser(email, password);
      
      if (result && result.user) {
        setUser(result.user);
        // Navigation is handled by useEffect
      } else {
        // Fallback for emergency bypass if backend is down (matching your requirement)
        const isSuperAdminCreds = email === 'uroojkhadim505@gmail.com' && password === '12345678';
        if (isSuperAdminCreds) {
          const mockUser = {
            _id: 'super-admin-id',
            uid: 'super-admin-id',
            fullName: 'Urooj Khadim',
            email: email,
            role: 'super_admin' as any,
            status: 'active'
          };
          setUser(mockUser);
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
          toast.success('Super Admin Bypass Active');
        } else {
          setError('Invalid credentials or server unreachable.');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to connect to the local server. Make sure your Node.js backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0, 102, 51, 0.8), rgba(0, 102, 51, 0.8)), url("https://images.unsplash.com/photo-1541339907198-e08756ebafe3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border-t-4 border-[#0ea5e9]">
          <div className="flex flex-col items-center mb-6">
            <ComsatsLogo size="lg" className="mb-4" />
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Cafeteria Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 uppercase tracking-widest font-bold">
              Local SQLite Edition
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-start">
                <AlertIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#0ea5e9] focus:border-[#0ea5e9] sm:text-sm font-medium"
                  placeholder="name@comsats.edu.pk"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#0ea5e9] focus:border-[#0ea5e9] sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ea5e9] transition-all duration-200 uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="flex items-center">
                    <LogInIcon className="mr-2 h-5 w-5" />
                    Sign in
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
             <Link
                to="/register"
                className="w-full flex justify-center py-3 px-4 border-2 border-[#0ea5e9] rounded-2xl text-xs font-bold text-[#0ea5e9] bg-white hover:bg-sky-50 transition-all uppercase tracking-widest"
              >
                Create Local Account
              </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}