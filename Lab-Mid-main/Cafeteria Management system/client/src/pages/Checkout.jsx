import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { toast } from 'react-toastify';
import { CreditCard, ShieldCheck, Mail, User, MapPin, ArrowRight, Loader2, CheckCircle, Package, Wallet, BadgePercent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user, setUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  const discountRate = user.role === 'student' ? 0.1 : (user.role === 'staff' ? 0.05 : 0);
  const discountAmount = subtotal * discountRate;
  const finalTotal = subtotal - discountAmount;

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'wallet' && (user.walletBalance || 0) < finalTotal) {
      toast.error('Capital Deficit: Insufficient Wallet Balance');
      return;
    }

    setProcessing(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: subtotal,
        discount: discountAmount,
        finalAmount: finalTotal,
        paymentMethod,
        status: 'pending'
      };

      const res = await api.post('/orders', orderData);
      
      setOrderId(res.data.id);
      
      // Update local wallet balance if paid by wallet
      if (paymentMethod === 'wallet') {
        setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - finalTotal }));
      }

      setSuccess(true);
      toast.success('Gourmet Assets Secured Successfully!');
      clearCart();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Transaction Protocol Failure');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-10 md:p-20 text-center space-y-10 max-w-2xl border-t-8 border-success"
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
            <h1 className="text-6xl font-black italic tracking-tighter leading-none">Order <br /><span className="text-success uppercase">Confirmed</span></h1>
            <p className="text-text-secondary text-lg font-medium">Your gourmet selection is now being crafted. Prepare for excellence.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted mb-1">Transaction Identity</p>
             <p className="font-mono text-xl text-primary">{orderId}</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-vibrant px-12 py-6 text-xl w-full"
          >
            Monitor Progress <Package size={22} className="ml-2" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 xl:grid-cols-2 gap-20 bg-background min-h-screen">
      <div className="space-y-12">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-black text-[10px] uppercase tracking-widest">
            <ShieldCheck size={14} /> Secure Transaction Protocol
          </motion.div>
          <h2 className="text-6xl font-black tracking-tighter italic"><span className="gradient-text uppercase">Authorize</span> Settlement</h2>
        </div>

        <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted pl-1">Method of Exchange</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-8 rounded-[32px] border-2 transition-all duration-500 flex flex-col items-center gap-4 group ${
                        paymentMethod === 'wallet' ? 'border-primary bg-primary/10 shadow-[0_20px_40px_-10px_rgba(29,78,216,0.3)]' : 'border-glass-border bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                >
                    <Wallet size={40} className={paymentMethod === 'wallet' ? 'text-primary' : 'text-text-muted group-hover:text-white'} />
                    <div className="text-center">
                        <p className="font-black text-xs uppercase tracking-widest">Digital Wallet</p>
                        <p className="text-[10px] text-text-muted mt-1">Balance: Rs. {user.walletBalance || 0}</p>
                    </div>
                </button>
                <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-8 rounded-[32px] border-2 transition-all duration-500 flex flex-col items-center gap-4 group opacity-50 cursor-not-allowed`}
                    disabled
                >
                    <CreditCard size={40} className="text-text-muted" />
                    <div className="text-center">
                        <p className="font-black text-xs uppercase tracking-widest">Card/External</p>
                        <p className="text-[10px] text-text-muted mt-1">Under Maintenance</p>
                    </div>
                </button>
            </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-10 group">
          <div className="glass-panel p-10 space-y-10 border border-glass-border">
             <h3 className="text-xl font-black flex items-center gap-3">
                <User size={24} className="text-primary" /> Identity Verification
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Member Name</label>
                    <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input type="text" value={user.name} className="modern-input pl-14 py-6 bg-white/[0.02] border-glass-border" disabled />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Authentication Mail</label>
                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input type="email" value={user.email} className="modern-input pl-14 py-6 bg-white/[0.02] border-glass-border" disabled />
                    </div>
                </div>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={processing || cart.length === 0}
            className="btn-vibrant w-full py-7 text-2xl shadow-[0_30px_60px_-10px_rgba(29,78,216,0.5)] flex items-center justify-center gap-5 group disabled:grayscale disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" size={32} /> Securely Settling...
              </>
            ) : (
              <>
                Confirm Asset Transfer <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform duration-500" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="relative">
         <div className="glass-panel p-10 md:p-14 sticky top-32 space-y-12 border-t-8 border-primary shadow-2xl bg-white/[0.03]">
            <div className="flex justify-between items-start border-b border-glass-border pb-10">
                <div className="space-y-2">
                    <h3 className="text-4xl font-black italic tracking-tighter">Selection <span className="gradient-text uppercase">Manifest</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{cart.length} Core Assets Identified</p>
                </div>
                <div className="bg-primary/20 p-4 rounded-2xl text-primary">
                    <Package size={32} />
                </div>
            </div>

            <div className="space-y-8 max-h-[350px] overflow-y-auto pr-6 scrollbar-hide">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                        <div className="space-y-1">
                            <p className="font-black text-lg group-hover:text-primary transition-colors tracking-tight">{item.name}</p>
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">{item.quantity} Unit(s) × Rs. {item.price}</p>
                        </div>
                        <p className="font-black italic text-xl tracking-tight">Rs. {item.price * item.quantity}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-10 border-t border-glass-border">
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Selection Base</span>
                    <span className="font-black text-xl tracking-tight">Rs. {subtotal}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-accent">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <BadgePercent size={14} /> Elite Member Discount ({user.role})
                        </span>
                        <span className="font-black text-xl tracking-tight">- Rs. {discountAmount.toFixed(0)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-10 border-t-2 border-primary/30">
                    <span className="text-xs font-black uppercase tracking-[0.5em] text-text-muted">Global Settle</span>
                    <div className="text-right">
                        <span className="text-6xl font-black italic tracking-tighter text-primary drop-shadow-[0_10px_20px_rgba(29,78,216,0.3)]">
                           Rs. {finalTotal.toFixed(0)}
                        </span>
                        <p className="text-[9px] font-black text-primary/60 uppercase mt-2 tracking-widest">Inclusive of all logistics</p>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] flex items-center gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[40px]"></div>
                <ShieldCheck className="text-primary shrink-0 relative z-10" size={40} />
                <p className="text-[11px] font-black leading-relaxed uppercase tracking-widest text-text-secondary relative z-10">
                    Encrypted Protocol Active. Your identity and financial assets are secured by Elite Cafe standards.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Checkout;
