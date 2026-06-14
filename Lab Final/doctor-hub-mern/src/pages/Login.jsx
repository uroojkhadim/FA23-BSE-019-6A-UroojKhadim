import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/missing-password':
        return 'Please enter your password.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login form submitted');
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    
    // ------------------------------
    // TIMING: Authentication start
    // ------------------------------
    console.time('Total Login Flow');
    console.time('Firebase - signInWithEmailAndPassword');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      console.timeEnd('Firebase - signInWithEmailAndPassword');
      console.log('✅ Authentication successful!');
      
      // ------------------------------
      // TIMING: Navigation to dashboard
      // ------------------------------
      console.time('React Router - Navigation');
      navigate('/patient');
      console.timeEnd('React Router - Navigation');
      console.timeEnd('Total Login Flow');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      console.timeEnd('Firebase - signInWithEmailAndPassword');
      console.timeEnd('Total Login Flow');
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <Stethoscope className="text-white" size={24} />
          </div>
          Doctor Hub
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8">Sign in to continue to your account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">!</div>
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
