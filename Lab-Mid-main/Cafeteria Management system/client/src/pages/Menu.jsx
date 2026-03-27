import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import { useCart } from '../context/CartContext.jsx';
import { Search, ShoppingBag, Star, Plus, Tag, Flame, Clock, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton.jsx';
import { toast } from 'react-toastify';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu');
      setMenu(res.data);
      setFilteredMenu(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load signature selection');
    } finally {
      setTimeout(() => setLoading(false), 800); // Shimmer effect duration
    }
  };

  useEffect(() => {
    let result = menu;
    if (category !== 'All') {
      result = result.filter(item => item.category === category);
    }
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMenu(result);
  }, [category, searchTerm, menu]);

  const categories = ['All', ...new Set(menu.map(item => item.category))];

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 space-y-20 bg-background min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/15 rounded-full text-primary font-black text-[11px] uppercase tracking-[0.2em] border border-primary/20"
          >
            <Flame size={14} className="animate-pulse" /> Daily Exclusive Selection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9]"
          >
            Elite <span className="gradient-text italic">Dining</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-xl font-medium max-w-2xl leading-relaxed"
          >
            Experience a curated journey of artisanal flavors and premium ingredients, crafted for the discerning university palate.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full lg:w-auto flex flex-col sm:flex-row gap-6"
        >
          <div className="relative group flex-1 sm:min-w-[400px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-all duration-300" size={22} />
            <input 
              type="text" 
              placeholder="Search by flavor or mood..." 
              className="modern-input pl-16 pr-8 py-6 w-full text-lg bg-white/[0.03] border-glass-border focus:bg-white/[0.08] focus:border-primary/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      {/* Categories Navigation */}
      <div className="flex flex-wrap gap-4 scrollbar-hide">
        {categories.map((cat, idx) => (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-12 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${
              category === cat 
              ? 'bg-primary text-white border-primary shadow-[0_20px_40px_-10px_rgba(29,78,216,0.4)] scale-105' 
              : 'glass-card border-glass-border text-text-muted hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="h-[280px] rounded-[32px]" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                </div>
              </div>
            ))
          ) : (
            filteredMenu.map((item, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              key={item.id}
              className={`glass-card p-6 group relative overflow-hidden border border-glass-border hover:border-primary/50 flex flex-col h-full transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] ${item.stock === 0 ? 'grayscale pointer-events-none' : ''}`}
            >
              {/* Image Container */}
              <div className="relative h-[250px] mb-8 overflow-hidden rounded-[24px] shadow-2xl">
                 <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                 
                 {/* Item Metadata Overlays */}
                 <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary border border-white/10 flex items-center gap-2">
                        <Clock size={10} /> 12 MIN
                    </div>
                 </div>

                 {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-3xl font-black uppercase tracking-[0.4em] text-danger -rotate-12 border-4 border-danger px-6 py-2">Deficit</span>
                    </div>
                 )}
              </div>
              
              <div className="space-y-5 flex-1 px-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">{item.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">{item.category}</p>
                    </div>
                    {item.stock < 10 && item.stock > 0 && (
                        <span className="text-[9px] font-black text-accent bg-accent/10 px-2 py-1 rounded">LOW STOCK</span>
                    )}
                </div>

                <p className="text-text-muted text-sm font-medium leading-relaxed opacity-80">
                   Indulge in a masterpiece of {item.category.toLowerCase()} flavors, traditionally prepared to satisfy the most demanding epicureans.
                </p>
              </div>

              <div className="pt-8 flex items-center justify-between mt-auto px-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Signature Price</p>
                  <p className="text-4xl font-black italic tracking-tighter flex items-center">
                    <span className="text-lg mr-1 opacity-40">Rs.</span>{item.price}
                  </p>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addToCart(item)}
                  className="w-16 h-16 bg-white/5 hover:bg-primary hover:text-white border border-glass-border hover:border-primary rounded-[22px] flex items-center justify-center transition-all duration-500 hover:shadow-[0_15px_30px_-5px_rgba(29,78,216,0.6)] group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  <Plus size={32} className="relative z-10 group-hover/btn:rotate-90 transition-transform duration-500" />
                </motion.button>
              </div>
            </motion.div>
          )))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMenu.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="py-40 flex flex-col items-center justify-center space-y-8"
        >
          <div className="relative">
            <Search size={120} className="text-primary" />
            <div className="absolute inset-0 bg-primary blur-[80px] opacity-20"></div>
          </div>
          <p className="text-4xl font-black uppercase tracking-[0.6em] text-center">Historical Vacuum</p>
          <button onClick={() => {setCategory('All'); setSearchTerm('')}} className="text-primary font-black uppercase text-xs tracking-widest hover:underline">Reset Selection</button>
        </motion.div>
      )}

      {/* Cart Quick Entry Toast Hint */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-10 right-10 z-50 bg-black/80 backdrop-blur-2xl border border-glass-border p-6 rounded-[32px] shadow-2xl flex items-center gap-6 group cursor-pointer hover:bg-primary/10 transition-colors"
      >
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <ShoppingBag size={24} />
        </div>
        <div className="pr-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Elite Provisioning</p>
            <p className="font-black text-xl">View Selection <IndianRupee size={16} className="inline ml-1" /></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
