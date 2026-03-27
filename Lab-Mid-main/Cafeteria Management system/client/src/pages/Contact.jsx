import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Clock, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Communique Sent Successfully');
  };

  return (
    <div className="bg-background min-h-screen py-32 px-10">
      <div className="max-w-[1400px] mx-auto space-y-32">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Info */}
          <div className="space-y-16">
             <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-primary font-black text-[10px] uppercase tracking-[0.4em]"
                >
                  Strategic Correspondence
                </motion.div>
                <h1 className="text-7xl font-black tracking-tighter italic leading-[0.9]">Connect with <br /><span className="gradient-text uppercase">The Elite</span></h1>
             </div>

             <div className="space-y-10">
                <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <MapPin size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Strategic Location</p>
                        <p className="text-xl font-bold">Main Campus, North Wing, Academic Block B</p>
                    </div>
                </div>

                <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Phone size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Direct Line</p>
                        <p className="text-xl font-bold">+1 (800) ELITE-CAFE</p>
                    </div>
                </div>

                <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Operational Hours</p>
                        <p className="text-xl font-bold italic text-primary">08:00 — 22:00 Daily</p>
                    </div>
                </div>
             </div>

             <div className="p-8 bg-primary/10 border border-primary/20 rounded-3xl flex items-center gap-6">
                <ShieldAlert className="text-primary shrink-0" size={32} />
                <p className="text-[10px] font-black leading-relaxed uppercase tracking-widest text-text-secondary">
                    Urgent event catering or high-level academic meetings require a 72-hour strategic notice period.
                </p>
             </div>
          </div>

          {/* Right: Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-12 md:p-16 space-y-10"
          >
            <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">The <span className="gradient-text">Communique</span></h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Identity verified messaging protocol</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Identity</label>
                        <input type="text" placeholder="Full Name" className="modern-input py-5" required />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Correlation Mail</label>
                        <input type="email" placeholder="Email Address" className="modern-input py-5" required />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Inquiry Vector</label>
                    <select className="modern-input py-5 appearance-none cursor-pointer">
                        <option>General Correspondence</option>
                        <option>Strategic Catering</option>
                        <option>Account Discrepancy</option>
                        <option>Feedback & Commendation</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Manifest</label>
                    <textarea placeholder="Your message..." rows={5} className="modern-input py-5 resize-none" required></textarea>
                </div>
                <button type="submit" className="btn-vibrant w-full py-6 text-xl shadow-2xl shadow-primary/40 group">
                    Authorize Dispatch <Send size={24} className="group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-500" />
                </button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
