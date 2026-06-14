import { useState } from 'react';
import { Stethoscope, Mail, Lock, CheckCircle, Star } from 'lucide-react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please fill both fields', 'error');
      return;
    }
    showToast('Welcome back! (Demo login successful)');
  };

  const handleRegister = () => {
    alert('Registration portal opens soon — stay tuned!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f0fa] via-[#d9eaf5] to-[#cfe2f0] flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-teal-600 text-white'
        }`}>
          <CheckCircle size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <TopBar />

      <main className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Section */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
              <Stethoscope className="text-teal-600" size={18} />
              <span className="text-slate-700 font-medium text-sm">Trusted Healthcare Network</span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-6xl lg:text-7xl font-extrabold">
                <span className="bg-gradient-to-r from-[#1d6b58] to-[#2f9b7c] bg-clip-text text-transparent">
                  Doctor Hub
                </span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl">
                Connect with top specialists, book instant virtual consultations, and take control of your health journey — anytime, anywhere.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-lg">
                <p className="text-3xl font-bold text-teal-700">150+</p>
                <p className="text-sm text-slate-600 mt-1">Expert Doctors</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-lg">
                <p className="text-3xl font-bold text-teal-700">24/7</p>
                <p className="text-sm text-slate-600 mt-1">Online Support</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-lg">
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-bold text-teal-700">4.9</p>
                  <Star className="text-yellow-500" size={18} fill="currentColor" />
                </div>
                <p className="text-sm text-slate-600 mt-1">Patient Rating</p>
              </div>
            </div>

            {/* Signature Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-50 px-4 py-2 rounded-lg border border-yellow-200">
              <span className="text-yellow-700 font-medium">✨ Designed by Urooj Khadim ✨</span>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white/85 backdrop-blur-xl p-8 rounded-3xl border border-white/70 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-slate-500 mt-2">Sign in to access your dashboard & appointments</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1d6b58] to-[#2f9b7c] text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <button
                  onClick={handleRegister}
                  className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
                >
                  Register
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 bg-yellow-50/70 px-4 py-2 rounded-lg border border-yellow-100">
                Demo: use any email / click Login (simulated)
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Custom Styles for Toast Animation */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Landing;
