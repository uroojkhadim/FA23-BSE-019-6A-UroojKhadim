import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Utensils } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { MenuItems } from '@/entities';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle } from 'lucide-react';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();
  const { user } = useAuthStore();

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<MenuItems>('menuitems');
      setItems(result.items.filter(item => item.isAvailable));
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  // Role-based access control
  if (user && user.role !== 'student') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h2 className="font-heading text-lg text-amber-900 mb-1">Access Restricted</h2>
                <p className="font-paragraph text-sm text-amber-800">
                  The menu is only available for students. {user.role === 'teacher' ? 'Teachers cannot access student order details.' : 'Administrators can manage cafeteria operations from the dashboard.'}
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Page Header */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-slate-900 uppercase mb-4">
              Menu
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"></div>
            <p className="font-paragraph text-sm text-slate-600 mt-4">Discover delicious meals from our cafeteria</p>
          </motion.div>
        </section>

        {/* Category Filter */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-paragraph text-sm uppercase tracking-wide px-6 py-3 rounded-xl border-2 transition-all font-semibold ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Menu Items Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 min-h-[360px] sm:min-h-[520px]">
          {isLoading ? (
            <div className="grid grid-cols-12 gap-8">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="h-64 bg-slate-200 animate-pulse" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-8 bg-slate-200 rounded animate-pulse w-24" />
                        <div className="h-10 bg-slate-200 rounded animate-pulse w-32" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-card shadow-card-hover hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <Link to={`/menu/${item._id}`} className="relative overflow-hidden">
                      <Image
                        src={item.itemImage}
                        alt={item.itemName || 'Menu item'}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        width={400}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item.category && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <p className="font-paragraph text-xs uppercase tracking-wide text-slate-700 font-semibold">
                            {item.category}
                          </p>
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex-1 flex flex-col">
                      <Link to={`/menu/${item._id}`}>
                        <h3 className="font-heading text-xl text-slate-900 uppercase mb-2 hover:text-blue-600 transition-colors line-clamp-1">
                          {item.itemName}
                        </h3>
                      </Link>
                      {item.itemDescription && (
                        <p className="font-paragraph text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                          {item.itemDescription}
                        </p>
                      )}
                      {item.dietaryRestrictions && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.dietaryRestrictions.split(',').map((restriction, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-50 text-green-700 text-xs uppercase tracking-wide rounded-full font-semibold"
                            >
                              {restriction.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="font-heading text-2xl text-slate-900 font-bold">
                          {formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                        </span>
                        <button
                          onClick={() => actions.addToCart({ 
                            collectionId: 'menuitems', 
                            itemId: item._id 
                          })}
                          disabled={addingItemId === item._id}
                          className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 text-white font-paragraph font-semibold px-6 py-2.5 rounded-xl transition-all hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-md hover:shadow-lg transform active:scale-95"
                        >
                          {addingItemId === item._id ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Adding...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
                              Add to Cart
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="w-12 h-12 text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="font-paragraph text-lg text-slate-600 font-medium">
                No menu items available in this category.
              </p>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
