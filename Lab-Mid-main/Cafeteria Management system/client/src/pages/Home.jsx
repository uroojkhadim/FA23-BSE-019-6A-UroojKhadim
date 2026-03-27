import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, Star, Clock, ShieldCheck, Utensils } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-10 overflow-hidden rounded-[40px] m-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="/cafe_hero_premium.png" 
            alt="Premium Cafe" 
            className="w-full h-full object-cover transform scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/80 to-transparent"></div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-black text-xs uppercase tracking-[0.3em]">
            <Star size={14} fill="currentColor" /> The Pinnacle of Brewing
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-8xl font-black leading-tight tracking-tighter">
            Crafting <span className="gradient-text italic">Art</span> <br /> In Every Single <br /> Sip.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-text-secondary max-w-2xl font-medium leading-relaxed">
            Experience the sophisticated fusion of artisanal coffee and gourmet delights in our meticulously designed sanctuary.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-6 pt-6">
            <button 
              onClick={() => navigate('/menu')}
              className="btn-vibrant px-12 py-6 text-lg hover:scale-105"
            >
              Explore Collection <ArrowRight size={22} className="ml-2" />
            </button>
            <button className="px-12 py-6 glass-card font-black uppercase text-xs tracking-[0.2em] border-glass-border hover:bg-white/5">
              Our Heritage
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="hidden xl:flex absolute right-20 bottom-20 gap-8"
        >
          {[
            { label: 'Award Winning', value: '12+', icon: Star },
            { label: 'Daily Visitors', value: '400+', icon: Coffee },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-8 min-w-[200px] border-b-4 border-primary">
              <stat.icon size={24} className="text-primary mb-4" />
              <p className="text-3xl font-black mb-1">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Features */}
      <section className="px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: 'Artisanal Roasts', desc: 'Sourced from the finest altitudes and roasted to perfection.', icon: Coffee, color: 'primary' },
          { title: 'Gourmet Kitchen', desc: 'Chef-inspired delicacies crafted with seasonal ingredients.', icon: Utensils, color: 'accent' },
          { title: 'Safe Environment', desc: 'Rigorous hygiene standards for your peace of mind.', icon: ShieldCheck, color: 'secondary' }
        ].map((feature, i) => (
          <motion.div 
            whileHover={{ translateY: -15 }}
            key={i} 
            className="glass-panel p-12 space-y-6 text-center group"
          >
            <div className={`mx-auto w-20 h-20 rounded-3xl bg-${feature.color}/10 flex items-center justify-center text-${feature.color} group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-black/40`}>
              <feature.icon size={36} />
            </div>
            <h3 className="text-2xl font-black">{feature.title}</h3>
            <p className="text-text-secondary leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
