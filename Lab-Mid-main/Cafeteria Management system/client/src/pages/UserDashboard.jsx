import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingBag, History, CheckCircle, Clock, Star, Gift, UtensilsCrossed, Plus, ArrowRight, Wallet, BadgePercent, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import Skeleton from '../components/Skeleton.jsx';

const UserDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();

    // Strategic Socket Link
    const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.on('order_status_updated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      if (updatedOrder.user_id === user.id) {
          toast.info(`Elite Protocol Update: Your order is now ${updatedOrder.status.toUpperCase()}`);
      }
    });

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        api.get('/menu'),
        api.get('/orders')
      ]);
      setMenu(menuRes.data);
      // Filter orders for current user and sort by newest first
      setOrders(ordersRes.data.filter(o => o.user_id === user.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
      toast.error('Data synchronization failed');
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const categories = [...new Set(menu.map(item => item.category))];
  const discountRate = user.role === 'student' ? 10 : (user.role === 'teacher' ? 5 : 0);

  return (
    <div className="p-6 md:p-12 max-w-[1600px] mx-auto space-y-20 bg-background min-h-screen">
      {/* Top Stats Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-card p-8 flex items-center justify-between group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:scale-110 transition-transform duration-700">
                <Wallet size={120} />
            </div>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Available Capital</p>
                <p className="text-4xl font-black italic tracking-tighter">Rs. {user.walletBalance || 0}</p>
            </div>
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <Plus size={24} />
            </div>
        </div>

        <div className="glass-card p-8 flex items-center justify-between group overflow-hidden relative border-l-4 border-accent">
            <div className="absolute -right-4 -bottom-4 text-accent/5 group-hover:scale-110 transition-transform duration-700">
                <BadgePercent size={120} />
            </div>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Exclusive Privilege</p>
                <p className="text-4xl font-black italic tracking-tighter">{discountRate}% OFF</p>
            </div>
            <div className="px-4 py-2 bg-accent/20 rounded-full text-accent font-black text-[10px] uppercase tracking-widest border border-accent/20">
                {user.role}
            </div>
        </div>

        <div className="glass-card p-8 flex items-center justify-between group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 text-secondary/5 group-hover:scale-110 transition-transform duration-700">
                <ShoppingBag size={120} />
            </div>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Active Ventures</p>
                <p className="text-4xl font-black italic tracking-tighter">{orders.filter(o => o.status !== 'completed').length}</p>
            </div>
            <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary border border-secondary/20">
                <Clock size={24} />
            </div>
        </div>
      </motion.div>

      {/* Hero Welcome */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16 border border-glass-border"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
        <div className="z-10 space-y-8 text-center lg:text-left flex-1">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/15 border border-primary/20 rounded-full text-primary font-black text-[11px] uppercase tracking-[0.2em]">
            <Star size={14} fill="currentColor" /> Signature Member Status
          </div>
          <h1 className="text-7xl md:text-8xl font-black gradient-text tracking-tighter leading-[0.85]">
            Welcome Back, <br /><span className="text-white italic">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-xl text-text-muted max-w-xl font-medium leading-relaxed opacity-80">
            Revisit your favorite artisanal selections or explore our latest seasonal masterpieces.
          </p>
          <div className="flex flex-wrap gap-6 pt-4 justify-center lg:justify-start">
            <button className="btn-vibrant px-12 py-6 text-xl shadow-2xl shadow-primary/30 group">
              Explore Collection <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="px-12 py-6 glass-card font-black uppercase text-xs tracking-widest border-glass-border hover:bg-white/10 hover:border-primary/40">
              Transaction History
            </button>
          </div>
        </div>
        <div className="relative z-10 w-full lg:w-auto hidden xl:flex justify-center flex-1">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/40 blur-[120px] rounded-full group-hover:bg-primary/60 transition-colors duration-1000"></div>
                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <UtensilsCrossed size={280} className="text-white/90 drop-shadow-[0_40px_100px_rgba(255,255,255,0.3)]" />
                </motion.div>
            </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        {/* Curated Previews */}
        <div className="xl:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-glass-border pb-10">
            <div className="space-y-1">
              <h2 className="text-5xl font-black italic tracking-tighter">Elite <span className="gradient-text">Selection</span></h2>
              <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.4em]">Drafted for the Discerning</p>
            </div>
            <button className="text-primary font-black text-[10px] uppercase tracking-[0.2em] border-b border-primary/40 pb-1 hover:text-white transition-colors">View All Manifest</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {loading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-[24px]" />)
            ) : (
              menu.slice(0, 4).map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.id} 
                  className="glass-card p-8 flex justify-between items-center group cursor-pointer hover:border-primary/40 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.1] transition-opacity">
                    <ShoppingBag size={100} />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <p className="font-black text-2xl tracking-tighter group-hover:text-primary transition-colors">{item.name}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">{item.category}</p>
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      <p className="text-primary font-black text-2xl tracking-tighter italic">Rs. {item.price}</p>
                    </div>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                      toast.success(`Success! ${item.name} added to curation.`);
                    }}
                    className="w-16 h-16 bg-white/5 border border-glass-border rounded-[22px] flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-[0_20px_40px_-5px_rgba(29,78,216,0.3)] transition-all duration-500 relative z-10"
                  >
                    <Plus size={28} />
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="space-y-12">
          <div className="flex flex-col gap-2 border-b border-glass-border pb-10">
            <h2 className="text-4xl font-black italic tracking-tighter flex items-center gap-4">
               <History size={32} className="text-secondary" /> Activity
            </h2>
            <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.4em] pl-1">Venture Archive</p>
          </div>
          
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {orders.slice(0, 5).map((order, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id} 
                  className="glass-panel p-8 border-l-4 border-primary hover:border-accent transition-all group relative overflow-hidden bg-white/[0.02]"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}</span>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-xl ${
                      order.status === 'completed' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                      {order.status}
                    </div>
                  </div>
                  <div className="font-bold text-lg mb-6 leading-relaxed line-clamp-1 text-text-secondary italic">
                    {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-glass-border">
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Net Settle</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">Rs. {order.finalAmount}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {orders.length === 0 && !loading && (
              <div className="glass-panel p-20 flex flex-col items-center justify-center opacity-10 text-center space-y-6">
                <UtensilsCrossed size={80} />
                <p className="text-xl font-black uppercase tracking-[0.6em]">Void Manifest</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
