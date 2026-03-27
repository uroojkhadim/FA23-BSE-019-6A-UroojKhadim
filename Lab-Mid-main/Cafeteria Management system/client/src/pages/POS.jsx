import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ShoppingCart, CreditCard, Wallet, Smartphone, Plus, Minus, Trash2, Receipt, ArrowRight, User, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POS = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDetails, setPaymentDetails] = useState({ number: '', txnId: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu');
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
        status: 'completed'
      });
      alert('Order Placed Successfully!');
      setCart([]);
      setPaymentDetails({ number: '', txnId: '' });
    } catch (err) {
      alert('Order failed: ' + err.message);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-4 gap-10">
      {/* Menu Area */}
      <div className="xl:col-span-3 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-8 rounded-[32px] border border-glass-border">
          <div className="space-y-1">
            <h2 className="text-4xl font-black flex items-center gap-4">
              <Receipt className="text-primary" size={40} /> Terminal <span className="gradient-text">Elite</span>
            </h2>
            <p className="text-text-muted font-bold text-[10px] uppercase tracking-[0.2em] pl-14">Active Session: {user.name}</p>
          </div>
          <div className="flex flex-wrap gap-3">
             {['All Items', 'Coffee', 'Bakery', 'Specials'].map((cat, i) => (
               <button key={cat} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${i === 0 ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'glass-card border-glass-border hover:bg-white/5'}`}>
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {menu.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.96 }}
              key={item.id}
              onClick={() => addToCart(item)}
              className="glass-card p-8 cursor-pointer relative overflow-hidden group border-b-4 border-transparent hover:border-primary"
            >
              <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                    <Plus size={24} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Tag size={20} />
                </div>
                <div>
                    <h3 className="font-black text-xl mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">{item.category}</p>
                </div>
                <div className="pt-2">
                    <p className="text-3xl font-black text-white">Rs. {item.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className="glass-panel p-10 sticky top-32 h-[calc(100vh-180px)] flex flex-col shadow-2xl border-t-8 border-primary group">
        <div className="flex items-center justify-between mb-8 border-b border-glass-border pb-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
                <ShoppingCart className="text-secondary" /> Cart
            </h2>
            <span className="text-[10px] font-black bg-secondary/20 text-secondary px-3 py-1 rounded-lg uppercase tracking-widest">{cart.length} Units</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-3 custom-scrollbar">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                key={item.id} 
                className="flex items-center gap-5 bg-white/[0.03] p-5 rounded-[24px] border border-glass-border group/item hover:bg-white/5 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-black text-sm group-hover/item:text-primary transition-colors">{item.name}</p>
                  <p className="text-[10px] font-black text-text-muted mt-1 uppercase tracking-widest">Rs. {item.price}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary transition-colors"><Minus size={14}/></button>
                        <span className="font-black text-sm min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary transition-colors"><Plus size={14}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-black uppercase tracking-widest text-danger/50 hover:text-danger flex items-center gap-1 transition-colors">
                        <Trash2 size={10}/> Remove
                    </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-10 py-20 pointer-events-none">
              <Sparkles size={100} className="mb-6" />
              <p className="text-2xl font-black uppercase tracking-[0.3em]">Clear Deck</p>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-glass-border space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Subtotal Revenue</span>
                <span className="font-black text-lg">Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-glass-border hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                    <Tag size={16} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Privilege Discount (%)</span>
                </div>
                <input 
                  type="number" 
                  className="w-12 bg-transparent text-right font-black outline-none text-primary text-lg"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
            </div>
          </div>

          <div className="flex flex-col items-center py-4 bg-primary/5 rounded-[24px] border border-primary/10">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Grand Total</span>
            <span className="text-5xl font-black text-white italic tracking-tighter shadow-primary/20 drop-shadow-2xl">Rs. {total.toFixed(0)}</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${paymentMethod === 'cash' ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/30' : 'border-glass-border hover:bg-white/5 text-text-muted'}`}
              >
                <Wallet size={20}/> Cash Flow
              </button>
              <button 
                onClick={() => setPaymentMethod('jazzcash')}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${paymentMethod === 'jazzcash' ? 'bg-secondary border-secondary text-white shadow-2xl shadow-secondary/30' : 'border-glass-border hover:bg-white/5 text-text-muted'}`}
              >
                <Smartphone size={20}/> Mobile Link
              </button>
            </div>

            <AnimatePresence>
              {paymentMethod !== 'cash' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                  <input 
                    type="text" placeholder="Mobile Account Number" className="modern-input py-4 text-xs font-bold tracking-widest"
                    value={paymentDetails.number} onChange={(e) => setPaymentDetails({...paymentDetails, number: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Auth Transaction ID" className="modern-input py-4 text-xs font-bold tracking-widest"
                    value={paymentDetails.txnId} onChange={(e) => setPaymentDetails({...paymentDetails, txnId: e.target.value})}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className="btn-vibrant w-full py-6 text-xl shadow-2xl shadow-primary/40 disabled:grayscale disabled:opacity-20 disabled:scale-95 group"
          >
            Finalize Settle <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
