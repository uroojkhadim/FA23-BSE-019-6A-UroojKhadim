import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto px-10 py-20 min-h-[80vh]">
      <div className="flex items-center gap-6 mb-16 border-b border-glass-border pb-8">
        <ShoppingCart size={48} className="text-primary" />
        <div className="space-y-1">
          <h1 className="text-5xl font-black italic tracking-tighter">Your <span className="gradient-text">Selection</span></h1>
          <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">{itemCount} Masterpieces curated</p>
        </div>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
          <div className="xl:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, scale: 0.95 }}
                  key={item.id}
                  className="glass-panel p-8 flex items-center gap-10 group hover:bg-white/[0.03] transition-colors overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                     <ShoppingBag size={120} />
                  </div>
                  
                  <div className="w-24 h-24 rounded-3xl bg-white/5 border border-glass-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ShoppingBag size={40} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-black">{item.name}</h3>
                    <p className="text-xs font-black uppercase tracking-widest text-text-muted">{item.category}</p>
                    <p className="text-xl font-black text-primary italic">Rs. {item.price}</p>
                  </div>

                  <div className="flex items-center gap-8 px-6 py-4 bg-black/40 rounded-2xl border border-white/5 shadow-2xl">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:text-primary transition-colors hover:scale-125"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-black min-w-[30px] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:text-primary transition-colors hover:scale-125"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-4 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-2xl transition-all duration-300"
                  >
                    <Trash2 size={24} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="xl:col-span-1">
            <div className="glass-panel p-10 sticky top-32 space-y-10 border-t-8 border-primary shadow-2xl">
              <h2 className="text-2xl font-black flex items-center gap-3">
                Order <span className="gradient-text italic">Finalization</span>
              </h2>
              
              <div className="space-y-6 pt-6 border-b border-glass-border pb-10">
                <div className="flex justify-between items-center text-text-muted">
                  <span className="text-[10px] font-black uppercase tracking-widest">Base Investment</span>
                  <span className="font-bold">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Logistics</span>
                  <span className="font-bold">Rs. 250</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Net Total</span>
                  <span className="text-5xl font-black italic tracking-tighter">Rs. {subtotal + 250}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="btn-vibrant w-full py-6 text-xl shadow-2xl shadow-primary/40 group overflow-hidden"
              >
                Assemble Settle <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
              </button>
              
              <Link to="/menu" className="block text-center text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors pt-4">
                Continue Curating Collection
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="flex flex-col items-center justify-center py-40 space-y-8"
        >
          <Sparkles size={160} className="animate-pulse text-primary" />
          <p className="text-4xl font-black uppercase tracking-[0.5em] text-center">Collection <br /> Empty</p>
          <button 
            onClick={() => navigate('/menu')}
            className="px-10 py-5 bg-white/5 border border-glass-border rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all duration-500"
          >
            Start Your Journey
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
