import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { MenuItems } from '@/entities';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';

export default function MenuItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MenuItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();
  const { user } = useAuthStore();

  useEffect(() => {
    loadMenuItem();
  }, [id]);

  const loadMenuItem = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await BaseCrudService.getById<MenuItems>('menuitems', id);
      setItem(data);
    } catch (error) {
      console.error('Failed to load menu item:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
                  Menu ordering features are available for students only.
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
        <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 min-h-[360px] sm:min-h-[520px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : !item ? (
            <div className="text-center py-24">
              <h2 className="font-heading text-3xl text-foreground uppercase mb-4">
                Item Not Found
              </h2>
              <Link 
                to="/menu"
                className="inline-flex items-center gap-2 font-paragraph text-base text-accent hover:underline"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                Back to Menu
              </Link>
            </div>
          ) : (
            <>
              {/* Back Link */}
              <Link 
                to="/menu"
                className="inline-flex items-center gap-2 font-paragraph text-sm text-foreground hover:text-accent transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                Back to Menu
              </Link>

              {/* Item Detail */}
              <div className="grid grid-cols-12 gap-8">
                {/* Image */}
                {item.itemImage && (
                  <div className="col-span-12 lg:col-span-6">
                    <Image
                      src={item.itemImage}
                      alt={item.itemName || 'Menu item'}
                      className="w-full h-auto object-cover border border-secondary"
                      width={800}
                    />
                  </div>
                )}

                {/* Details */}
                <div className={`col-span-12 ${item.itemImage ? 'lg:col-span-6' : ''}`}>
                  <div className="space-y-6">
                    {item.category && (
                      <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide">
                        {item.category}
                      </p>
                    )}
                    
                    <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase">
                      {item.itemName}
                    </h1>

                    <div className="w-16 h-1 bg-foreground"></div>

                    <div className="font-heading text-3xl text-foreground">
                      {formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                    </div>

                    {item.itemDescription && (
                      <div>
                        <h2 className="font-heading text-xl text-foreground uppercase mb-3">
                          Description
                        </h2>
                        <p className="font-paragraph text-base text-foreground leading-relaxed">
                          {item.itemDescription}
                        </p>
                      </div>
                    )}

                    {item.dietaryRestrictions && (
                      <div>
                        <h2 className="font-heading text-xl text-foreground uppercase mb-3">
                          Dietary Information
                        </h2>
                        <p className="font-paragraph text-base text-foreground">
                          {item.dietaryRestrictions}
                        </p>
                      </div>
                    )}

                    <div className="pt-6">
                      {item.isAvailable ? (
                        <button
                          onClick={() => actions.addToCart({ 
                            collectionId: 'menuitems', 
                            itemId: item._id 
                          })}
                          disabled={addingItemId === item._id}
                          className="w-full sm:w-auto bg-primary text-primary-foreground font-paragraph font-semibold px-8 py-4 rounded transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {addingItemId === item._id ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>
                      ) : (
                        <div className="border border-secondary px-8 py-4 inline-block">
                          <p className="font-paragraph text-base text-foreground">
                            Currently Unavailable
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
