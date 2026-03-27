import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { LogOut, Coffee, LayoutDashboard, ShoppingCart, User, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel m-6 px-10 py-5 flex items-center justify-between sticky top-6 z-50">
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Coffee size={24} className="text-white" />
          </div>
          <span className="gradient-text tracking-tighter">Elite Cafe</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 ml-8">
          {user ? (
            <>
              <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors">Experience</Link>
              <Link to="/menu" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors">Collections</Link>
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors">Archive</Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors">Genesis</Link>
              <Link to="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors">Heritage</Link>
              <Link to="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors">Correspondence</Link>
              <Link to="/menu" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors">Manifest</Link>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-8">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-[9px] font-black text-text-secondary hover:text-primary flex items-center gap-2 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
                  Admin Panel
                </Link>
              )}
              {(user.role === 'admin' || user.role === 'staff') && (
                <Link to="/pos" className="text-[9px] font-black text-text-secondary hover:text-primary flex items-center gap-2 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
                  Terminal
                </Link>
              )}
            </div>

            <Link to="/cart" className="relative p-3 bg-white/5 border border-glass-border rounded-xl hover:bg-white/10 transition-colors">
                <ShoppingCart size={20} className="text-text-secondary" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg animate-bounce">
                    {itemCount}
                  </span>
                )}
            </Link>
            
            <div className="h-8 w-px bg-glass-border mx-2"></div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 bg-white/5 pl-4 pr-1.5 py-1.5 rounded-2xl border border-glass-border">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black tracking-tight">{user.name}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-black">{user.role}</span>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                  {user.name?.charAt(0)}
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-3.5 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-2xl transition-all duration-300 shadow-lg shadow-danger/10 group active:scale-95"
              >
                <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted hover:text-white transition-colors">Settle Login</Link>
            <Link to="/register" className="btn-vibrant px-8 py-4 text-xs shadow-xl shadow-primary/20">
               Enroll Member
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
