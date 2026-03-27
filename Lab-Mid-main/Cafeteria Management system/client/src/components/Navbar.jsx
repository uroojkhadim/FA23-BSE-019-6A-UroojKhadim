import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, Coffee, LayoutDashboard, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel m-6 px-10 py-5 flex items-center justify-between sticky top-6 z-50">
      <Link to="/" className="flex items-center gap-3 text-2xl font-bold group">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
          <Coffee size={24} className="text-white" />
        </div>
        <span className="gradient-text tracking-tighter">Cafe Hub</span>
      </Link>
      
      <div className="flex items-center gap-10">
        <div className="hidden md:flex items-center gap-8">
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-bold text-text-secondary hover:text-primary flex items-center gap-2 transition-all hover:-translate-y-0.5">
              <LayoutDashboard size={18} /> Admin Panel
            </Link>
          )}
          {(user?.role === 'admin' || user?.role === 'staff') && (
            <Link to="/pos" className="text-sm font-bold text-text-secondary hover:text-primary flex items-center gap-2 transition-all hover:-translate-y-0.5">
              <ShoppingCart size={18} /> POS Terminal
            </Link>
          )}
        </div>
        
        <div className="h-8 w-px bg-glass-border mx-2"></div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white/5 pl-4 pr-1.5 py-1.5 rounded-2xl border border-glass-border">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black tracking-tight">{user?.name}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-black">{user?.role}</span>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-3.5 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-2xl transition-all duration-300 shadow-lg shadow-danger/10 group active:scale-95"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
