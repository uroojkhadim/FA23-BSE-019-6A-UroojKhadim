import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, CheckCircle2, Send, LogIn } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Students, Teachers, Administrators } from '@/entities/index';
import { useAuthStore, type UserRole } from '@/store/authStore';
import { loginUser, resendVerificationEmail } from '@/lib/emailAuth';
import { auth } from '@/lib/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);

  // Get message from navigation state (from registration)
  const messageFromState = location.state as { message?: string; email?: string };

  // Monitor auth state for unverified users
  React.useEffect(() => {
    if (messageFromState?.email) {
      setEmail(messageFromState.email);
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.emailVerified) {
        setShowResendButton(true);
      } else if (user && user.emailVerified) {
        setShowResendButton(false);
      }
    });
    return () => unsubscribe();
  }, [messageFromState]);

  const findUserByEmail = async (
    collectionId: 'students' | 'teachers' | 'admins',
    normalizedEmail: string,
  ) => {
    let skip = 0;
    while (true) {
      const result = await BaseCrudService.getAll<Students | Teachers | Administrators>(
        collectionId,
        undefined,
        { limit: 1000, skip },
      );
      const found = result.items.find((item) => item.email?.toLowerCase() === normalizedEmail);
      if (found) return found;
      if (!result.hasNext || result.nextSkip === null) return null;
      skip = result.nextSkip;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      // Login with Firebase
      const result = await loginUser(email, password);

      if (result && result.verified) {
        // Find user in database
        const roleToCollection = {
          student: 'students',
          teacher: 'teachers',
          admin: 'admins',
        } as const;

        const collectionId = roleToCollection[role];
        const dbUser = await findUserByEmail(collectionId, email.toLowerCase());

        if (dbUser) {
          // Set user in auth store
          setUser({
            _id: (dbUser as any)._id || (dbUser as any).id || '',
            email: dbUser.email,
            fullName: (dbUser as any).fullName || (dbUser as any).name || 'User',
            role: role,
          });

          // Navigate based on role
          const roleRoutes = {
            student: '/student/dashboard',
            teacher: '/teacher/dashboard',
            admin: '/admin/dashboard',
          };
          navigate(roleRoutes[role]);
        } else {
          // User exists in Firebase but not in database
          // This can happen for old registrations or database issues
          console.warn('User exists in Firebase but not in database:', email);
          setError('User profile not found. Please complete your registration or contact support.');
          
          // Optionally redirect to registration completion page
          // For now, suggest re-registration
          setTimeout(() => {
            if (window.confirm('Your user profile is incomplete. Would you like to register again?')) {
              navigate('/register');
            }
          }, 2000);
        }
      } else if (result && !result.verified) {
        // Email not verified
        setShowResendButton(true);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      // Try to get user by email
      setError('Please login first to resend verification email.');
      return;
    }

    setIsResendingEmail(true);
    try {
      const success = await resendVerificationEmail(auth.currentUser);
      if (success) {
        setSuccess('✅ Verification email resent! Please check your inbox.');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to resend verification email.');
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      setError('Failed to resend verification email.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Glassmorphic Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h1 className="font-bold text-3xl mb-2 text-black">Welcome Back</h1>
              <p className="font-paragraph text-sm text-black/80">
                Sign in to access your account
              </p>
            </div>

            {messageFromState?.message && (
              <div className="mb-6 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-sm text-black">{messageFromState.message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-sm text-black">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-sm text-black">{success}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="font-paragraph text-sm uppercase tracking-wide text-black mb-2 block">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg font-paragraph text-base text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-lg font-paragraph text-base uppercase tracking-wide hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Logging in...'
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login
                  </>
                )}
              </button>

              {/* Resend Verification Email */}
              {showResendButton && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingEmail}
                    className="text-sm text-black/80 hover:text-black underline underline-offset-4 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                  >
                    {isResendingEmail ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Register Link */}
              <p className="font-paragraph text-sm text-center text-black/70">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
