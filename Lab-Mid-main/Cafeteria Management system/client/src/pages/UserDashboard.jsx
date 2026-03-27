import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ShoppingBag, History, CheckCircle, Clock, Star, Gift, UtensilsCrossed, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        api.get('/menu'),
        api.get('/orders')
      ]);
      setMenu(menuRes.data);
      setOrders(ordersRes.data.filter(o => o.userId === user.id).reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [...new Set(menu.map(item => item.category))];

  return (
    <div className="p-10 max-w-[1500px] mx-auto space-y-20">
      {/* Hero Welcome */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
        <div className="z-10 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-black text-xs uppercase tracking-widest">
            <Star size={14} fill="currentColor" /> Premier Dining Experience
          </div>
          <h1 className="text-7xl font-black gradient-text leading-tight">
            Exquisite Dining, <br />{user.name}
          </h1>
          <p className="text-xl text-text-secondary max-w-xl font-medium leading-relaxed">
            Savor the finest selections from our luxury kitchen. Your gourmet journey through the elite menu starts here.
          </p>
          <div className="flex flex-wrap gap-4 pt-6 justify-center lg:justify-start">
            <button className="btn-vibrant px-10 py-5 text-lg shadow-2xl shadow-primary/30">
              Browse Signature Menu <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 glass-card font-black uppercase text-xs tracking-widest border-glass-border hover:bg-white/5">
              My Loyalty Points
            </button>
          </div>
        </div>
        <div className="relative z-10 w-full lg:w-1/3 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full"></div>
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <UtensilsCrossed size={200} className="text-white relative drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]" />
                </motion.div>
            </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        {/* Curated Menu */}
        <div className="xl:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-glass-border pb-8">
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tight">Signature Menu</h2>
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest">Handcrafted by elite chefs</p>
            </div>
            <div className="flex gap-4">
                <div className="w-12 h-12 glass-card flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform cursor-pointer"><Star size={22} fill="currentColor"/></div>
                <div className="w-12 h-12 glass-card flex items-center justify-center text-secondary shadow-lg hover:scale-110 transition-transform cursor-pointer"><Gift size={22} fill="currentColor"/></div>
            </div>
          </div>

          <div className="space-y-16">
            {categories.map(cat => (
              <div key={cat} className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-px bg-primary/30 text-primary"></span>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary">{cat}</h3>
                  <span className="flex-1 h-px bg-glass-border"></span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {menu.filter(item => item.category === cat).map((item, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={item.id} 
                      className="glass-card p-8 flex justify-between items-center group cursor-pointer hover:border-primary/50"
                    >
                      <div className="space-y-2">
                        <p className="font-black text-2xl tracking-tighter group-hover:text-primary transition-colors">{item.name}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-white/40 text-xs font-black uppercase tracking-widest">{item.category}</p>
                          <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                          <p className="text-primary font-black text-xl">Rs. {item.price}</p>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white/5 border border-glass-border rounded-[20px] flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-500">
                        <Plus size={28} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black flex items-center gap-4">
               <History size={36} className="text-secondary" /> Activity
            </h2>
            <p className="text-text-muted font-bold text-sm uppercase tracking-widest pl-12">Your recent transactions</p>
          </div>
          
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={order.id} 
                className="glass-panel p-8 border-l-8 border-primary hover:border-secondary transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <ShoppingBag size={120} />
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl ${
                    order.status === 'completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                  }`}>
                    {order.status === 'completed' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                    {order.status}
                  </div>
                </div>
                <div className="font-bold text-lg mb-6 leading-relaxed line-clamp-2 text-text-secondary italic">
                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-glass-border">
                  <span className="text-xs font-black text-text-muted uppercase tracking-widest">Total Settle</span>
                  <span className="text-3xl font-black text-primary">Rs. {order.finalAmount}</span>
                </div>
              </motion.div>
            ))}
            {orders.length === 0 && (
              <div className="glass-panel p-20 flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                <UtensilsCrossed size={80} />
                <p className="text-2xl font-black uppercase tracking-[0.2em]">Zero Records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
