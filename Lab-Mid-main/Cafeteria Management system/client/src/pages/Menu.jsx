import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import { useCart } from '../context/CartContext.jsx';
import { Search, Filter, ShoppingBag, Star, Plus, Tag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton.jsx';

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = menu;
    if (category !== 'All') {
      result = result.filter(item => item.category === category);
    }
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMenu(result);
  }, [category, searchTerm, menu]);

  const categories = ['All', ...new Set(menu.map(item => item.category))];

  return (
    <div className="max-w-[1600px] mx-auto px-10 py-20 space-y-16">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-widest">
            <Tag size={12} /> Curated Collections
          </div>
          <h1 className="text-6xl font-black tracking-tighter">Signature <span className="gradient-text">Menu</span></h1>
          <p className="text-text-secondary text-lg font-medium max-w-xl">
            Discover our meticulously crafted selection of artisanal beverages and gourmet delicacies.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search our flavors..." 
              className="modern-input pl-14 pr-8 py-5 min-w-[350px] bg-white/[0.02] border-glass-border focus:bg-white/[0.05]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 border-b border-glass-border pb-10">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
              category === cat 
              ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-105' 
              : 'glass-card border-glass-border text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))
          ) : (
            filteredMenu.map((item, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              key={item.id}
              className="glass-card p-8 group relative overflow-hidden border-b-4 border-transparent hover:border-primary flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl border border-glass-border">
                  <ShoppingBag size={28} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{item.category}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Signature</span>
                  </div>
                </div>

                <p className="text-text-secondary text-sm font-medium leading-relaxed opacity-60">
                   A perfect balance of hand-picked ingredients and artisanal craftsmanship.
                </p>
              </div>

              <div className="pt-10 flex items-center justify-between mt-auto">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Investment</p>
                  <p className="text-3xl font-black italic">Rs. {item.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-16 h-16 bg-white/5 hover:bg-primary hover:text-white border border-glass-border hover:border-primary rounded-[24px] flex items-center justify-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 group/btn"
                >
                  <Plus size={32} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                </button>
              </div>
            </motion.div>
          )))}
        </AnimatePresence>
      </div>

      {filteredMenu.length === 0 && (
        <div className="py-40 flex flex-col items-center justify-center opacity-20 space-y-6">
          <Search size={80} />
          <p className="text-3xl font-black uppercase tracking-[0.4em]">Historical Void</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
