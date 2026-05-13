import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { registerUser } from '@/lib/emailAuth';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import ComsatsLogo from '@/components/ui/ComsatsLogo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin' | 'super_admin' | 'staff' | 'university_staff'>('student');
  const [adminType, setAdminType] = useState<'admin' | 'super_admin' | 'staff'>('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

      const target = roleDashboardMap[user.role] || '/dashboard';
      navigate(target, { replace: true });
    }
  }, [user, loading, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalRole = role === 'admin' ? adminType : role;
      
      const result = await registerUser(email, password, fullName, finalRole as any);
      if (result) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Connection failed. Is the local Node.js server running?');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Ensure backend is running.');
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
            <h2 className="text-center text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
              Local Registration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 font-bold uppercase tracking-widest">
              Join the Local SQLite Portal
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-sky-50 border-l-4 border-sky-400 p-4 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-sky-400 mr-3 mt-0.5" />
                <p className="text-sm text-sky-700 font-bold">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#0ea5e9] focus:border-[#0ea5e9] sm:text-sm font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
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
              <label htmlFor="role" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Register as
              </label>
              <div className="mt-1 space-y-3">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="block w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#0ea5e9] focus:border-[#0ea5e9] sm:text-sm font-bold text-slate-700"
                >
                  <option value="student">Student / Customer</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="university_staff">University Staff</option>
                  <option value="admin">Management / Admin</option>
                </select>

                {role === 'admin' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pl-4 border-l-2 border-[#0ea5e9] space-y-2"
                  >
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Admin Permissions</p>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${adminType === 'super_admin' ? 'bg-sky-50 border-[#0ea5e9]' : 'border-gray-100 bg-slate-50'}`}>
                        <input 
                          type="radio" 
                          name="adminType" 
                          value="super_admin" 
                          checked={adminType === 'super_admin'}
                          onChange={() => setAdminType('super_admin')}
                          className="hidden"
                        />
                        <span className={`text-xs uppercase tracking-widest font-bold ${adminType === 'super_admin' ? 'text-[#0ea5e9]' : 'text-gray-400'}`}>Super Admin</span>
                      </label>
                      <label className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${adminType === 'admin' ? 'bg-sky-50 border-[#0ea5e9]' : 'border-gray-100 bg-slate-50'}`}>
                        <input 
                          type="radio" 
                          name="adminType" 
                          value="admin" 
                          checked={adminType === 'admin'}
                          onChange={() => setAdminType('admin')}
                          className="hidden"
                        />
                        <span className={`text-xs uppercase tracking-widest font-bold ${adminType === 'admin' ? 'text-[#0ea5e9]' : 'text-gray-400'}`}>Standard Admin</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
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
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] transition-all uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="flex items-center">
                    Register Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-gray-100">
             <Link to="/login" className="text-xs font-bold text-[#0ea5e9] uppercase tracking-widest hover:underline">
                Back to Login
              </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}