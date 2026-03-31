import React from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  History, 
  Bell,
  CircleCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session here
    navigate('/login');
  };

  const stats = [
    { label: 'Recent Orders', value: '12', icon: <ShoppingBag className="w-5 h-5" />, color: 'blue' },
    { label: 'Pending Bills', value: 'Rs. 450', icon: <History className="w-5 h-5" />, color: 'emerald' },
    { label: 'Notifications', value: '3 New', icon: <Bell className="w-5 h-5" />, color: 'amber' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">User Dashboard</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Verified Session</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 rounded-2xl transition-all font-bold text-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 space-y-4 hover:border-white/20 transition-all cursor-default group">
                <div className={`w-12 h-12 bg-${stat.color}-500/10 text-${stat.color}-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <h2 className="text-3xl font-black mt-1 tracking-tight">{stat.value}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 min-h-[400px] flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center text-emerald-400 border border-emerald-500/10">
              <CircleCheck className="w-12 h-12" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Authentication Success</h3>
              <p className="text-slate-400 max-w-sm mx-auto">You have successfully logged in via WhatsApp OTP verification. Your profile is now active.</p>
            </div>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-bold text-sm tracking-widest">
              VIEW RECENT ACTIVITY
            </button>
          </div>
        </motion.div>

        <footer className="flex items-center justify-center gap-2 pt-8 opacity-20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-black">Secure Cafeteria System</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
