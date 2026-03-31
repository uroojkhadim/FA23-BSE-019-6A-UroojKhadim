import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Page Header */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground uppercase mb-4">
            Menu
          </h1>
          <div className="w-16 h-1 bg-foreground"></div>
        </section>

        {/* Category Filter */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-paragraph text-sm uppercase tracking-wide px-6 py-3 border transition-colors ${
                  selectedCategory === category
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-foreground border-secondary hover:border-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Items Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 min-h-[360px] sm:min-h-[520px]">
          {isLoading ? null : filteredItems.length > 0 ? (
            <div className="grid grid-cols-12 gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <div className="border border-secondary h-full flex flex-col">
                    {item.itemImage && (
                      <Link to={`/menu/${item._id}`}>
                        <Image
                          src={item.itemImage}
                          alt={item.itemName || 'Menu item'}
                          className="w-full h-64 object-cover"
                          width={400}
                        />
                      </Link>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <Link to={`/menu/${item._id}`}>
                        <h3 className="font-heading text-xl text-foreground uppercase mb-2 hover:text-accent transition-colors">
                          {item.itemName}
                        </h3>
                      </Link>
                      {item.category && (
                        <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-3">
                          {item.category}
                        </p>
                      )}
                      {item.itemDescription && (
                        <p className="font-paragraph text-sm text-foreground mb-4 line-clamp-2 flex-1">
                          {item.itemDescription}
                        </p>
                      )}
                      {item.dietaryRestrictions && (
                        <p className="font-paragraph text-xs text-foreground mb-4">
                          {item.dietaryRestrictions}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-heading text-xl text-foreground">
                          {formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                        </span>
                        <button
                          onClick={() => actions.addToCart({ 
                            collectionId: 'menuitems', 
                            itemId: item._id 
                          })}
                          disabled={addingItemId === item._id}
                          className="bg-primary text-primary-foreground font-paragraph font-semibold px-4 py-2 rounded text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {addingItemId === item._id ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-paragraph text-lg text-foreground">
                No menu items available in this category.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
