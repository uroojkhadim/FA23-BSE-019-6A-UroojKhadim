import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreditCard, ShieldCheck, Mail, User, MapPin, ArrowRight, Loader2, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      toast.success('Gourmet Assets Secured Successfully!');
      clearCart();
    }, 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-20 text-center space-y-10 max-w-2xl border-t-8 border-success"
        >
          <motion.div 
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-32 h-32 bg-success/20 rounded-[40px] flex items-center justify-center text-success mx-auto shadow-2xl shadow-success/20"
          >
            <CheckCircle size={64} fill="currentColor" className="text-white" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter">Order <span className="text-success">Confirmed</span></h1>
            <p className="text-text-secondary text-lg font-medium">Your gourmet selection is now being crafted by our elite chefs.</p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Transaction ID: ELITE-ORDER-{Date.now().toString().slice(-8)}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-vibrant px-12 py-6 text-lg w-full"
          >
            Track in Archive <Package size={22} className="ml-2" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-10 py-20 grid grid-cols-1 xl:grid-cols-2 gap-20">
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter italic"><span className="gradient-text">Assembly</span> & Logistics</h2>
          <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] pl-1">Global Trade Protocol Secure</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-10">
          <div className="glass-panel p-10 space-y-8">
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Identity</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input type="text" placeholder="Full Name" className="modern-input pl-12 py-5" required />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Correspondence</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input type="email" placeholder="Email Address" className="modern-input pl-12 py-5" required />
                    </div>
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Logistics Destination</label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input type="text" placeholder="Strategic Address..." className="modern-input pl-12 py-5" required />
                </div>
             </div>
          </div>

          <div className="glass-panel p-10 space-y-8 border-b-4 border-primary">
            <h3 className="text-xl font-black flex items-center gap-3">
                <CreditCard className="text-primary" /> Gateway Integration
            </h3>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Asset Reference</label>
                    <div className="relative">
                        <input type="text" placeholder="0000 0000 0000 0000" className="modern-input py-5 tracking-widest" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Expiry Period</label>
                        <input type="text" placeholder="MM / YY" className="modern-input py-5" required />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Security Token (CVC)</label>
                        <input type="password" placeholder="***" className="modern-input py-5" required />
                    </div>
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={processing}
            className="btn-vibrant w-full py-6 text-xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 group disabled:grayscale disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" size={28} /> Confirming Assets...
              </>
            ) : (
              <>
                Authorize Collection Settle <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
              </>
            )}
          </button>
        </form>
      </div>

      <div>
         <div className="glass-panel p-12 sticky top-32 space-y-12">
            <div className="space-y-2">
                <h3 className="text-3xl font-black italic tracking-tighter">Selection <span className="gradient-text">Manifest</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{cart.length} Core Assets Identified</p>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                        <div className="space-y-1">
                            <p className="font-black group-hover:text-primary transition-colors">{item.name}</p>
                            <p className="text-[9px] font-black uppercase text-text-muted tracking-widest">{item.quantity} Unit(s) × Rs. {item.price}</p>
                        </div>
                        <p className="font-black italic">Rs. {item.price * item.quantity}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-10 border-t border-glass-border">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Selection Aggregate</span>
                    <span className="font-black">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Strategic Logistics</span>
                    <span className="font-black">Rs. 250</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-glass-border">
                    <span className="text-xs font-black uppercase tracking-widest">Global Total</span>
                    <span className="text-5xl font-black italic tracking-tighter text-primary shadow-primary/20 drop-shadow-2xl">Rs. {subtotal + 250}</span>
                </div>
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-center gap-6">
                <ShieldCheck className="text-primary shrink-0" size={32} />
                <p className="text-[10px] font-black leading-relaxed uppercase tracking-widest text-text-secondary">
                    Your transaction is encrypted. Elite Cafe ensures absolute security for all financial assets.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Checkout;
