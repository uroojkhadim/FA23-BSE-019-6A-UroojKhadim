import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Orders, MenuItems, Discounts, Payments } from '@/entities';
import { Plus, Minus, Trash2, Tag, CreditCard, AlertCircle, ShoppingCart, Clock, Package, CheckCircle2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { PAYMENT_METHODS, formatPaymentMethod, getPaymentStatusLabel, paymentMethodRequiresReference, type PaymentMethod } from '@/lib/payments';
import { calculateDiscountAmount, getDiscountLabel, isDiscountCurrentlyActive } from '@/lib/discounts';
import { createOrderWorkflow, parseOrderNotes } from '@/lib/orderWorkflow';
import { getOrderStatusLabel, isOrderActive, normalizeOrderStatus } from '@/lib/orderStatus';

interface CartItem {
  menuItem: MenuItems;
  quantity: number;
}

export default function POSPage() {
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [discounts, setDiscounts] = useState<Discounts[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discounts | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [transferReference, setTransferReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currency } = useCurrency();
  const { user } = useAuth();

  const handleCreateOrder = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const orderData = {
        _id: crypto.randomUUID(),
        userId: user?._id || 'walk-in',
        totalPrice: cart.reduce((sum, item) => sum + (item.menuItem.itemPrice || 0) * item.quantity, 0),
        status: 'accepted', // Admin orders are auto-accepted
        paymentMethod,
        isPaid: paymentMethod === 'cash' || paymentMethod === 'debit-credit-card',
        orderTime: new Date().toISOString(),
        notes: notes + (transferReference ? ` | Ref: ${transferReference}` : ''),
      };
      
      await BaseCrudService.create('orders', orderData);
      toast.success('Order placed and confirmed successfully');
      setCart([]);
      setNotes('');
      setTransferReference('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAccess = user && (user.role === 'admin' || user.role === 'staff');


  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <p className="font-heading text-xl text-slate-400 uppercase tracking-widest text-center px-4">
          Access Restricted: Administrators Only
        </p>
      </div>
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuResult, ordersResult, discountsResult] = await Promise.all([
        BaseCrudService.getAll<MenuItems>('menuitems'),
        BaseCrudService.getAll<Orders>('orders'),
        BaseCrudService.getAll<Discounts>('discounts')
      ]);
      setMenuItems(menuResult.items.filter((item) => item.isAvailable));
      setOrders(ordersResult.items.filter((order) => isOrderActive(order.status)));
      setDiscounts(discountsResult.items.filter((discount) => isDiscountCurrentlyActive(discount)));
    } catch (loadError) {
      console.error('Failed to load data:', loadError);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: MenuItems) => {
    setError('');
    const existing = cart.find((cartItem) => cartItem.menuItem._id === item._id);
    if (existing) {
      setCart(cart.map((cartItem) =>
        cartItem.menuItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
      return;
    }

    setCart([...cart, { menuItem: item, quantity: 1 }]);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((cartItem) => cartItem.menuItem._id !== itemId));
      return;
    }

    setCart(cart.map((cartItem) =>
      cartItem.menuItem._id === itemId
        ? { ...cartItem, quantity }
        : cartItem
    ));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((cartItem) => cartItem.menuItem._id !== itemId));
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + (item.menuItem.itemPrice || 0) * item.quantity, 0);

  const calculateDiscount = () => calculateDiscountAmount(selectedDiscount, calculateSubtotal());

  const calculateTotal = () => Math.max(0, calculateSubtotal() - calculateDiscount());

  const createOrder = async () => {
    if (cart.length === 0) return;

    setError('');
    try {
      await createOrderWorkflow({
        lineItems: cart.map((item) => ({
          menuItemId: item.menuItem._id,
          quantity: item.quantity,
          unitPrice: item.menuItem.itemPrice || 0,
        })),
        paymentMethod,
        notes,
        transferReference,
        discount: selectedDiscount && calculateDiscount() > 0 ? selectedDiscount : null,
        source: 'pos',
      });

      setCart([]);
      setSelectedDiscount(null);
      setPaymentMethod('cash');
      setTransferReference('');
      setNotes('');
      await loadData();
    } catch (createError) {
      console.error('Failed to create order:', createError);
      setError(createError instanceof Error ? createError.message : 'Failed to create order.');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, isPaid?: boolean) => {
    try {
      await BaseCrudService.update('orders', {
        _id: orderId,
        status,
        ...(isPaid !== undefined && { isPaid })
      });

      if (isPaid) {
        const payments = await BaseCrudService.getAll<Payments>('payments');
        const relatedPayment = payments.items.find((payment) => payment.orderReference === orderId);

        if (relatedPayment) {
          await BaseCrudService.update('payments', {
            ...relatedPayment,
            paymentStatus: 'completed',
            paymentDateTime: new Date().toISOString(),
          });
        }
      }

      await loadData();
    } catch (updateError) {
      console.error('Failed to update order:', updateError);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground uppercase tracking-tight">
            POS Terminal
          </h1>
          <p className="text-secondary-foreground font-paragraph text-sm mt-1">
            Quickly create orders and manage transactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <Clock className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground uppercase mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Menu Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl h-40 animate-pulse" />
                ))
              ) : menuItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(item)}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 text-sm uppercase line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-4">{item.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-primary">{formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#0ea5e9]" />
              Current Tray
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 cart-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Plus className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Tray is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.menuItem._id} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <img src={item.menuItem.itemImage} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.menuItem.itemName}</p>
                      <p className="text-xs text-[#0ea5e9] font-bold">Rs.{item.menuItem.itemPrice}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const newCart = [...cart];
                          const idx = newCart.findIndex(i => i.menuItem._id === item.menuItem._id);
                          if (newCart[idx].quantity > 1) {
                            newCart[idx].quantity--;
                          } else {
                            newCart.splice(idx, 1);
                          }
                          setCart(newCart);
                        }}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => {
                          const newCart = [...cart];
                          const idx = newCart.findIndex(i => i.menuItem._id === item.menuItem._id);
                          newCart[idx].quantity++;
                          setCart(newCart);
                        }}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>Rs.{cart.reduce((sum, item) => sum + (item.menuItem.itemPrice || 0) * item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 font-bold">
                <span className="uppercase tracking-widest text-sm">Grand Total</span>
                <span className="text-2xl text-[#0ea5e9]">Rs.{cart.reduce((sum, item) => sum + (item.menuItem.itemPrice || 0) * item.quantity, 0)}</span>
              </div>
              
              <div className="pt-4 space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        paymentMethod === method.value 
                          ? 'bg-[#0ea5e9] text-white border-[#0ea5e9] shadow-lg shadow-sky-900/20' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCreateOrder}
                disabled={cart.length === 0 || isProcessing}
                className="w-full mt-4 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-sky-900/20 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
