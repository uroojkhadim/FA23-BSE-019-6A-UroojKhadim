import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Utensils, AlertCircle, Search, Plus } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { MenuItems } from '@/entities';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Image } from '@/components/ui/image';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeService } from '@/lib/RealtimeService';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();
  const { user } = useAuth();


  useEffect(() => {
    setIsLoading(true);
    const unsub = RealtimeService.subscribeToCollection('menuitems', (data) => {
      setItems(data.filter(item => item.isAvailable));
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const loadMenuItems = async () => {
    // This is now handled by the real-time listener
  };

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.itemDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Modern food placeholder images
  const getFoodImage = (item: MenuItems) => {
    if (item.itemImage && !item.itemImage.includes('YOUR_IMAGE_URL') && !item.itemImage.includes('placeholder')) {
      return item.itemImage;
    }
    // Reliable food category images
    const category = item.category?.toLowerCase() || '';
    if (category.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80';
    if (category.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80';
    if (category.includes('drink') || category.includes('beverage')) return 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&w=400&q=80';
    if (category.includes('coffee') || category.includes('tea')) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80';
    if (category.includes('sandwich')) return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80';
    if (category.includes('rice') || category.includes('biryani')) return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80';
    
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'; // Default healthy bowl
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground uppercase tracking-tight">
            Menu Explorer
          </h1>
          <p className="text-secondary-foreground font-paragraph text-sm mt-1">
            Browse and order your favorite meals from COMSATS Cafeteria.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-80 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search delicious food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-medium focus:border-primary focus:ring-0 transition-all outline-none"
            />
          </div>
          
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <Link 
              to="/add-menu"
              className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-110 transition-all flex items-center gap-2"
              title="Add New Menu Item"
            >
              <Plus className="w-6 h-6" />
              <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Add Item</span>
            </Link>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto cart-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`font-paragraph text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-xl border-2 transition-all font-bold whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>


      {/* Menu Items Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-slate-100" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="pt-4 flex justify-between">
                    <div className="h-6 bg-slate-100 rounded w-20" />
                    <div className="h-10 bg-slate-100 rounded w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <Link to={`/menu/${item._id}`} className="relative overflow-hidden aspect-video">
                  <Image
                    src={getFoodImage(item)}
                    alt={item.itemName || 'Menu item'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {item.category && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <p className="font-paragraph text-[10px] uppercase tracking-wider text-primary font-bold">
                        {item.category}
                      </p>
                    </div>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <Link to={`/menu/${item._id}`}>
                    <h3 className="font-heading text-lg font-bold text-slate-900 uppercase mb-1 hover:text-primary transition-colors line-clamp-1">
                      {item.itemName}
                    </h3>
                  </Link>
                  {item.itemDescription && (
                    <p className="font-paragraph text-xs text-slate-500 mb-4 line-clamp-2 flex-1">
                      {item.itemDescription}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="font-heading text-xl text-primary font-bold">
                      {formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                    </span>
                    <button
                      onClick={() => actions.addToCart({ 
                        collectionId: 'menuitems', 
                        itemId: item._id 
                      })}
                      disabled={addingItemId === item._id}
                      className="bg-primary text-white font-paragraph font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:shadow-lg shadow-primary/20 transform active:scale-95 flex items-center gap-2"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Utensils className="w-16 h-16 text-slate-200 mb-4" />
            <p className="font-heading text-xl text-slate-400 uppercase tracking-widest">No Items Found</p>
          </div>
        )}
      </div>
    </div>
  );
}
