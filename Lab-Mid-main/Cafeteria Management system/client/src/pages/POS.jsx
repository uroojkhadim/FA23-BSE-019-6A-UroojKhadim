import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { toast } from 'react-toastify';
import { ShoppingCart, CreditCard, Wallet, Smartphone, Plus, Minus, Trash2, Receipt, ArrowRight, User, Tag, Sparkles, Clock, CheckCircle, Flame, Send, Monitor, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const POS = () => {
  const [view, setView] = useState('terminal'); // 'terminal' or 'queue'
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [category, setCategory] = useState('All');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDetails, setPaymentDetails] = useState({ number: '', txnId: '' });
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  useEffect(() => {
    fetchMenu();
    if (view === 'queue') fetchOrders();
    
    // Strategic Socket Link
    const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.on('new_order', (newOrder) => {
        if (view === 'queue') {
            setOrders(prev => [newOrder, ...prev]);
            toast.success('Incoming Strategic Manifest: New Order Received');
        }
    });

    socket.on('order_status_updated', (updatedOrder) => {
        if (view === 'queue') {
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        }
    });

    return () => socket.disconnect();
  }, [view]);

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu');
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      // Sort: Pending first, then newest
      setOrders(res.data.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return new Date(b.created_at) - new Date(a.created_at);
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
      try {
          await api.patch(`/orders/${orderId}`, { status: newStatus });
          toast.success(`Protocol Updated: ${newStatus.toUpperCase()}`);
          fetchOrders();
      } catch (err) {
          toast.error('Protocol Update Failure');
      }
  };

  const total = subtotal - (subtotal * (discount / 100));

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    
    try {
      await api.post('/orders', {
        userId: user.id,
        items: cart,
        total: subtotal,
        discount: discount,
        finalAmount: total,
        paymentMethod,
        paymentDetails,
        status: 'completed' // Direct POS orders are completed immediately
      });
      toast.success('Elite Transaction Completed!');
      clearCart();
      setPaymentDetails({ number: '', txnId: '' });
    } catch (err) {
      toast.error('Transaction Failed: ' + err.message);
    }
  };

  const filteredMenu = category === 'All' ? menu : menu.filter(item => item.category === category);
  const categories = ['All', ...new Set(menu.map(item => item.category))];

  return (
    <div className="p-6 md:p-10 space-y-10 bg-background min-h-screen">
      {/* View Switcher */}
      <div className="flex items-center gap-6 bg-white/[0.02] p-3 rounded-[28px] border border-glass-border w-fit mx-auto shadow-2xl">
         <button 
            onClick={() => setView('terminal')}
            className={`px-10 py-5 rounded-[22px] flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${view === 'terminal' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-text-muted hover:text-white'}`}
         >
            <Receipt size={18} /> Asset Terminal
         </button>
         <button 
            onClick={() => setView('queue')}
            className={`px-10 py-5 rounded-[22px] flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${view === 'queue' ? 'bg-secondary text-white shadow-xl shadow-secondary/30' : 'text-text-muted hover:text-white'}`}
         >
            <Monitor size={18} /> Command Queue
         </button>
      </div>

      {view === 'terminal' ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          {/* Menu Area */}
          <div className="xl:col-span-3 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/[0.02] p-10 rounded-[40px] border border-glass-border shadow-inner">
              <div className="space-y-2">
                <h2 className="text-5xl font-black italic tracking-tighter">Terminal <span className="gradient-text">Elite</span></h2>
                <p className="text-text-muted font-black text-[9px] uppercase tracking-[0.4em] pl-1">Authorized Specialist: {user.name}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                 {categories.map((cat) => (
                   <button 
                     key={cat} 
                     onClick={() => setCategory(cat)}
                     className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${category === cat ? 'bg-primary text-white shadow-2xl shadow-primary/40' : 'glass-card border-glass-border hover:bg-white/10 hover:border-primary/30'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filteredMenu.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10 }} whileTap={{ scale: 0.95 }}
                  key={item.id} onClick={() => addToCart(item)}
                  className="glass-card p-10 cursor-pointer relative overflow-hidden group border-b-8 border-transparent hover:border-primary shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <div className="w-14 h-14 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                        <Plus size={28} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Tag size={28} />
                    </div>
                    <div>
                        <h3 className="font-black text-2xl tracking-tight mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">{item.category}</p>
                    </div>
                    <div className="pt-4 border-t border-glass-border">
                        <p className="text-4xl font-black italic tracking-tighter">Rs. {item.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Area */}
          <div className="glass-panel p-10 sticky top-32 h-[calc(100vh-220px)] flex flex-col shadow-2xl border-t-8 border-primary group bg-white/[0.01]">
            <div className="flex items-center justify-between mb-10 border-b border-glass-border pb-8">
                <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                    <ShoppingCart className="text-secondary" size={32} /> Manifest
                </h2>
                <div className="bg-secondary/20 text-secondary px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-secondary/20">
                    {cart.length} Core Units
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-4 scrollbar-hide">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} className="bg-white/[0.03] p-6 rounded-[32px] border border-glass-border group/item hover:bg-white/5 transition-colors shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className="space-y-1">
                          <p className="font-black text-lg group-hover/item:text-primary transition-colors leading-tight tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Base Settle: Rs. {item.price}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-5 bg-black/40 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary transition-colors"><Minus size={16}/></button>
                            <span className="font-black text-lg min-w-[24px] text-center italic">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary transition-colors"><Plus size={16}/></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 bg-danger/10 text-danger rounded-xl flex items-center justify-center hover:bg-danger hover:text-white transition-all shadow-lg active:scale-95">
                            <Trash2 size={18}/>
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-10 py-20">
                  <Sparkles size={120} className="mb-8" />
                  <p className="text-3xl font-black uppercase tracking-[0.5em] italic">Void</p>
                </div>
              )}
            </div>

            <div className="mt-10 pt-10 border-t-2 border-primary/30 space-y-8">
              <div className="space-y-5">
                <div className="flex justify-between items-center px-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted">Selection Base</span>
                    <span className="font-black text-2xl tracking-tighter">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-[24px] border border-glass-border">
                    <div className="flex items-center gap-4">
                        <Tag size={20} className="text-primary" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Privilege Disc. (%)</span>
                    </div>
                    <input 
                      type="number" className="w-16 bg-transparent text-right font-black outline-none text-primary text-2xl italic"
                      value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>
              </div>

              <div className="py-8 bg-primary/10 rounded-[40px] border border-primary/20 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-[11px] font-black text-primary/60 uppercase tracking-[0.6em] mb-2 relative z-10">Total Settlement</p>
                <p className="text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl relative z-10 shadow-primary/40">Rs. {total.toFixed(0)}</p>
              </div>

              <button 
                onClick={handlePlaceOrder} disabled={cart.length === 0}
                className="btn-vibrant w-full py-8 text-2xl shadow-2xl shadow-primary/50 disabled:grayscale disabled:opacity-20 group"
              >
                Authorize Settle <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Order Queue View */
        <div className="space-y-12">
           <div className="flex items-center justify-between bg-white/[0.02] p-10 rounded-[40px] border border-glass-border shadow-2xl">
              <div className="space-y-4">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase"><span className="gradient-text">Command</span> Registry</h2>
                <p className="text-text-muted font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-3">
                   <Clock size={16} className="text-secondary" /> Real-time Strategic Monitoring Active
                </p>
              </div>
              <button 
                onClick={fetchOrders}
                className="w-20 h-20 bg-white/5 border border-glass-border rounded-[30px] flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:rotate-180 transition-all duration-700 shadow-xl active:scale-90"
              >
                <RefreshCcw size={32} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              <AnimatePresence mode="popLayout">
                {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').map((order, idx) => (
                  <motion.div 
                    layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                    key={order.id} className="glass-panel p-10 space-y-8 border-t-8 border-secondary group relative overflow-hidden bg-white/[0.02]"
                  >
                     <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                        <Flame size={120} />
                     </div>

                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Order Hash</p>
                           <p className="font-mono text-lg text-primary">{order.id.split('-')[0]}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-xl ${
                          order.status === 'preparing' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                          order.status === 'ready' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {order.status}
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 min-h-[120px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Manifest Details</p>
                        <div className="space-y-3">
                           {order.items.map((item, i) => (
                             <div key={i} className="flex justify-between text-sm font-bold italic text-text-secondary leading-tight">
                                <span>{item.quantity}× {item.name}</span>
                                <span className="text-white/20">...</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="pt-6 border-t border-glass-border flex justify-between items-center text-nowrap">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black border border-white/5 uppercase">
                              {order.user_name?.charAt(0) || 'U'}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">User: {order.user_name}</span>
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter text-white">Rs. {order.final_amount}</span>
                     </div>

                     <div className="grid grid-cols-2 gap-4 pt-4">
                        {order.status === 'pending' && (
                           <button 
                             onClick={() => updateOrderStatus(order.id, 'preparing')}
                             className="col-span-2 py-5 bg-orange-600/10 border border-orange-600/20 text-orange-600 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-orange-600/5 flex items-center justify-center gap-3"
                           >
                              <Flame size={14} /> Initiate Protocol
                           </button>
                        )}
                        {order.status === 'preparing' && (
                           <button 
                             onClick={() => updateOrderStatus(order.id, 'ready')}
                             className="col-span-2 py-5 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-white transition-all shadow-xl shadow-secondary/5 flex items-center justify-center gap-3"
                           >
                              <CheckCircle size={14} /> Secure Readiness
                           </button>
                        )}
                        {order.status === 'ready' && (
                           <button 
                             onClick={() => updateOrderStatus(order.id, 'completed')}
                             className="col-span-2 py-5 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5 flex items-center justify-center gap-3"
                           >
                              <Send size={14} /> Finalize Handoff
                           </button>
                        )}
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 && (
                <div className="col-span-full py-40 flex flex-col items-center justify-center opacity-10 space-y-8">
                   <Monitor size={160} />
                   <p className="text-5xl font-black uppercase tracking-[1em] italic">Absolute Zero</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default POS;
