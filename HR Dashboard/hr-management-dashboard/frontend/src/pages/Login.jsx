import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: 'uroojkhadim505@gmail.com', password: 'urooj87665' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      console.log('🔑 User already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('🔑 Calling login function...');
      await login(loginData.email, loginData.password);
      console.log('🔑 Login completed, navigating to dashboard');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('❌ Login failed in component:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    try {
      console.log('📝 Calling signup function...');
      await signup(signupData.email, signupData.password, signupData.name);
      console.log('📝 Signup completed, navigating to dashboard');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('❌ Signup failed in component:', error);
      // If email already exists, switch to login tab and pre-fill email
      if (error.code === 'auth/email-already-in-use') {
        setLoginData(prev => ({ ...prev, email: signupData.email }));
        setActiveTab('login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Stats for left side
  const stats = [
    { icon: Users, number: '12,543', label: 'Candidates Hired' },
    { icon: Briefcase, number: '1,234', label: 'Open Positions' },
    { icon: TrendingUp, number: '89%', label: 'Offer Acceptance' },
  ];

  console.log('📍 Current location:', location.pathname);
  console.log('👤 Current user:', user);

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900' : 'bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600'}`} />
        
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">HR Pro</h2>
                <p className="text-white/70 text-sm">Enterprise Suite</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Smart Recruitment &
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                Workforce Management
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              Streamline your hiring process, manage candidates, and build amazing teams with our enterprise HR platform.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header (only on small screens) */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${isDark ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} rounded-2xl flex items-center justify-center`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">HR Pro</h2>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-105 transition-all`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden lg:flex justify-end mb-8">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-105 transition-all`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Auth Tabs */}
          <div className={`flex gap-2 mb-8 p-1.5 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? isDark
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'bg-white text-blue-600 shadow-lg'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'signup'
                  ? isDark
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'bg-white text-blue-600 shadow-lg'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>

          {/* Form Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className={`${isDark ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} rounded-3xl p-8 shadow-2xl`}
            >
              {/* Welcome Text */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeTab === 'login' ? 'Welcome Back!' : 'Create Account'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === 'login'
                    ? 'Sign in to continue managing your workforce'
                    : 'Get started with your free account today'}
                </p>
              </div>

              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-12 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    loading={loading}
                    className={`w-full h-12 rounded-xl text-white font-semibold text-base ${isDark ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'} shadow-lg hover:shadow-xl transition-all`}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        placeholder="John Doe"
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-12 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-12 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    loading={loading}
                    className={`w-full h-12 rounded-xl text-white font-semibold text-base ${isDark ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'} shadow-lg hover:shadow-xl transition-all`}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              )}

              {/* Your Credentials Info (Login Only) */}
              {activeTab === 'login' && (
                <div className={`mt-8 p-4 rounded-2xl border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      Your Credentials
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Email: <span className="font-semibold">uroojkhadim505@gmail.com</span>
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Password: <span className="font-semibold">urooj87665</span>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <p className={`text-center text-sm mt-8 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            © 2024 HR Pro Enterprise. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
