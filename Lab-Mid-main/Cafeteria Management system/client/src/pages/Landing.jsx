import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Star, Clock, MapPin, Coffee, Pizza, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop" 
            alt="Elite Cafe Interior" 
            className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        </div>

        <div className="relative z-10 text-center space-y-12 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary font-black text-xs uppercase tracking-[0.4em]"
          >
            <Star size={16} fill="currentColor" /> The University's Premier Hub
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-8xl md:text-[12rem] font-black tracking-tighter leading-[0.8] drop-shadow-2xl"
          >
            ELITE <br /> <span className="gradient-text italic">CAFE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Where artisanal gastronomy meets the academic spirit. Explore a curated selection of gourmet flavors designed for the discerning student and staff.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10"
          >
            <button 
                onClick={() => navigate('/menu')}
                className="btn-vibrant px-16 py-8 text-2xl group shadow-[0_20px_50px_-10px_rgba(29,78,216,0.5)]"
            >
              Explore Selection <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
            </button>
            <button 
                onClick={() => navigate('/login')}
                className="px-16 py-8 glass-card border-glass-border font-black uppercase text-sm tracking-[0.4em] hover:bg-white/10 hover:border-primary/50 transition-all"
            >
              Order Now
            </button>
          </motion.div>
        </div>

        {/* Floating Accents */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
            <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Signature Items Preview */}
      <section className="py-40 max-w-[1600px] mx-auto px-10 space-y-32">
        <div className="text-center space-y-6">
            <h2 className="text-6xl font-black italic tracking-tighter">Artisanal <span className="gradient-text">Masterpieces</span></h2>
            <p className="text-text-muted font-black text-xs uppercase tracking-[0.5em]">Handpicked for your daily excellence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
                { name: 'Signature Latte', icon: <Coffee />, desc: 'Triple-shot artisanal roast with hand-frothed emulsion.', price: '450' },
                { name: 'Wagyu Signature', icon: <Utensils />, desc: 'Prime Wagyu beef with aged cheddar and truffle infusion.', price: '1200' },
                { name: 'Truffle Pizza', icon: <Pizza />, desc: 'Foraged mushroom blend with buffalo mozzarella.', price: '2200' }
            ].map((item, idx) => (
                <motion.div 
                    whileHover={{ y: -20 }}
                    key={idx}
                    className="glass-card p-12 space-y-8 group border-t-8 border-transparent hover:border-primary transition-all duration-700"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {React.cloneElement(item.icon, { size: 40 })}
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black">{item.name}</h3>
                        <p className="text-text-muted font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-8 border-t border-glass-border flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Inaugural Price</span>
                        <span className="text-3xl font-black tracking-tighter italic flex items-center gap-1">
                            <span className="text-sm opacity-40">Rs.</span>{item.price}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-white/[0.02]">
        <div className="max-w-[1400px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
                <div className="space-y-6">
                    <h2 className="text-7xl font-black tracking-tighter italic leading-[0.9]">Beyond Just <br /> <span className="gradient-text">Provisioning</span></h2>
                    <p className="text-2xl text-text-secondary leading-relaxed font-medium">
                        At Elite Cafe, we believe that academic excellence is fueled by gastronomic excellence. We source only the finest ethical ingredients to create a space where ideas flourish.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="text-5xl font-black text-primary italic tracking-tighter">12k+</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted text-nowrap">Annual Patrons</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl font-black text-primary italic tracking-tighter">100%</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted text-nowrap">Ethical Sourcing</p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.5em] text-primary hover:text-white transition-colors group"
                >
                    Scientific Heritage <ArrowRight size={20} className="group-hover:translate-x-4 transition-transform" />
                </button>
            </div>
            
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full"></div>
                <img 
                    src="https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=1000&auto=format&fit=crop" 
                    alt="Coffee Pour" 
                    className="relative z-10 rounded-[60px] shadow-2xl border border-glass-border grayscale hover:grayscale-0 transition-all duration-700"
                />
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 text-center space-y-16 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-6 translate-y-20"></div>
        <div className="relative z-10 space-y-12">
            <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter">Secure Your <br /><span className="gradient-text uppercase">Manifest</span></h2>
            <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">Skip the queue. Pre-order your signature selection today through our secure web application.</p>
            <button 
                onClick={() => navigate('/register')}
                className="btn-vibrant px-20 py-8 text-2xl shadow-2xl shadow-primary/40 group overflow-hidden"
            >
                Enroll in Elite Perks <ArrowRight size={28} className="group-hover:translate-x-4 transition-transform duration-500" />
            </button>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-glass-border text-center space-y-6">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-text-muted">Elite Cafeteria Management System</p>
        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">© 2026 Crafted for Discerning Scholars</p>
      </footer>
    </div>
  );
};

export default Landing;
