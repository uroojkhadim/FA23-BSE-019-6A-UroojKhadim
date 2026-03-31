import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Orders, MenuItems, Discounts, Payments } from '@/entities';
import { Plus, Minus, Trash2, Tag, CreditCard, AlertCircle } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
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
  const { currency } = useCurrency();
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
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
                  The POS System is only available for administrators.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground uppercase mb-4">
            POS System
          </h1>
          <div className="w-16 h-1 bg-foreground"></div>
        </section>

        <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-7">
              <h2 className="font-heading text-2xl text-foreground uppercase mb-6">
                Menu Items
              </h2>
              <div className="grid grid-cols-12 gap-4 min-h-[320px] sm:min-h-[400px]">
                {isLoading ? null : menuItems.length > 0 ? (
                  menuItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      className="col-span-12 sm:col-span-6 md:col-span-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full border border-secondary p-4 text-left hover:border-foreground transition-colors"
                      >
                        {item.itemImage && (
                          <Image
                            src={item.itemImage}
                            alt={item.itemName || 'Menu item'}
                            className="w-full h-32 object-cover mb-3"
                            width={200}
                          />
                        )}
                        <h3 className="font-heading text-base text-foreground uppercase mb-2">
                          {item.itemName}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground">
                          {formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                        </p>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-12 text-center py-12">
                    <p className="font-paragraph text-base text-foreground">
                      No menu items available
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="border border-secondary p-4 sm:p-6 lg:sticky lg:top-28">
                <h2 className="font-heading text-2xl text-foreground uppercase mb-6">
                  Current Order
                </h2>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="font-paragraph text-sm text-foreground text-center py-8">
                      No items in cart
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.menuItem._id} className="flex items-center gap-4 pb-4 border-b border-secondary">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading text-sm text-foreground uppercase mb-1">
                            {item.menuItem.itemName}
                          </h4>
                          <p className="font-paragraph text-xs text-foreground">
                            {formatPrice(item.menuItem.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                            className="w-6 h-6 border border-secondary flex items-center justify-center hover:border-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <span className="font-paragraph text-sm text-foreground w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                            className="w-6 h-6 border border-secondary flex items-center justify-center hover:border-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.menuItem._id)}
                            className="ml-2 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <>
                    <div className="mb-6">
                      <label className="font-heading text-sm text-foreground uppercase mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" strokeWidth={1.5} />
                        Redeem Offer
                      </label>
                      <select
                        value={selectedDiscount?._id || ''}
                        onChange={(event) => {
                          const discount = discounts.find((item) => item._id === event.target.value);
                          setSelectedDiscount(discount || null);
                        }}
                        className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                      >
                        <option value="">No offer selected</option>
                        {discounts.map((discount) => (
                          <option key={discount._id} value={discount._id}>
                            {getDiscountLabel(discount)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="font-heading text-sm text-foreground uppercase mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" strokeWidth={1.5} />
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                        className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 font-paragraph text-xs text-secondary-foreground">
                        {PAYMENT_METHODS.find((method) => method.value === paymentMethod)?.helperText}
                      </p>
                    </div>

                    {paymentMethodRequiresReference(paymentMethod) && (
                      <div className="mb-6">
                        <label className="font-heading text-sm text-foreground uppercase mb-2 block">
                          Transaction Reference
                        </label>
                        <input
                          type="text"
                          value={transferReference}
                          onChange={(event) => setTransferReference(event.target.value)}
                          className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                          placeholder="Enter JazzCash, EasyPaisa, or transfer reference"
                        />
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="font-heading text-sm text-foreground uppercase mb-2 block">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                        rows={2}
                        placeholder="Special instructions..."
                      />
                    </div>

                    <div className="space-y-2 mb-6 pb-6 border-b border-secondary">
                      <div className="flex justify-between">
                        <span className="font-paragraph text-sm text-foreground">Subtotal</span>
                        <span className="font-paragraph text-sm text-foreground">
                          {formatPrice(calculateSubtotal(), currency ?? DEFAULT_CURRENCY)}
                        </span>
                      </div>
                      {selectedDiscount && calculateDiscount() > 0 && (
                        <div className="flex justify-between text-accent">
                          <span className="font-paragraph text-sm">Offer Applied</span>
                          <span className="font-paragraph text-sm">
                            -{formatPrice(calculateDiscount(), currency ?? DEFAULT_CURRENCY)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2">
                        <span className="font-heading text-lg text-foreground uppercase">Total</span>
                        <span className="font-heading text-lg text-foreground">
                          {formatPrice(calculateTotal(), currency ?? DEFAULT_CURRENCY)}
                        </span>
                      </div>
                    </div>

                    {error && (
                      <p className="font-paragraph text-sm text-destructive mb-4">
                        {error}
                      </p>
                    )}

                    <div className="space-y-3">
                      <button
                        onClick={createOrder}
                        className="w-full bg-primary text-primary-foreground font-paragraph font-semibold px-6 py-3 rounded transition-opacity hover:opacity-90"
                      >
                        Create Order
                      </button>
                      <button
                        onClick={() => {
                          setCart([]);
                          setSelectedDiscount(null);
                          setTransferReference('');
                          setNotes('');
                          setError('');
                        }}
                        className="w-full bg-transparent text-foreground font-paragraph font-semibold px-6 py-3 rounded border border-secondary transition-colors hover:border-foreground"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <section className="mt-16">
            <h2 className="font-heading text-2xl text-foreground uppercase mb-6">
              Active Orders
            </h2>
            <div className="space-y-4 min-h-[200px]">
              {isLoading ? null : orders.length > 0 ? (
                orders.map((order, index) => {
                  const parsedNotes = parseOrderNotes(order.notes);
                  const normalizedStatus = normalizeOrderStatus(order.status);
                  return (
                    <motion.div
                      key={order._id}
                      className="border border-secondary p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-6">
                          <h3 className="font-heading text-xl text-foreground uppercase mb-3">
                            Order #{order.orderNumber}
                          </h3>
                          <div className="space-y-1">
                            <p className="font-paragraph text-sm text-foreground">
                              Status: <span className="uppercase">{getOrderStatusLabel(order.status)}</span>
                            </p>
                            {order._createdDate && (
                              <p className="font-paragraph text-sm text-foreground">
                                {format(new Date(order._createdDate), 'MMM dd, yyyy HH:mm')}
                              </p>
                            )}
                            <p className="font-paragraph text-sm text-foreground">
                              Payment: {formatPaymentMethod(order.paymentMethod)}
                            </p>
                            {parsedNotes.discountCode && (
                              <p className="font-paragraph text-sm text-foreground">
                                Offer: {parsedNotes.discountCode}
                              </p>
                            )}
                            {parsedNotes.paymentReference && (
                              <p className="font-paragraph text-sm text-foreground">
                                Reference: {parsedNotes.paymentReference}
                              </p>
                            )}
                            <p className="font-paragraph text-sm text-foreground">
                              Settlement: {order.isPaid ? getPaymentStatusLabel('completed') : getPaymentStatusLabel('pending')}
                            </p>
                            {parsedNotes.customerNote && (
                              <p className="font-paragraph text-sm text-foreground">
                                Notes: {parsedNotes.customerNote}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <div className="flex flex-col gap-3">
                            <div className="text-right mb-3">
                              <p className="font-heading text-2xl text-foreground">
                                {formatPrice(order.totalPrice || 0, currency ?? DEFAULT_CURRENCY)}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end">
                              {!order.isPaid && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, normalizedStatus, true)}
                                  className="bg-primary text-primary-foreground font-paragraph text-sm px-4 py-2 rounded transition-opacity hover:opacity-90"
                                >
                                  Mark as Paid
                                </button>
                              )}
                              {normalizedStatus === 'ordered' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'accepted')}
                                  className="bg-transparent text-foreground font-paragraph text-sm px-4 py-2 rounded border border-secondary transition-colors hover:border-foreground"
                                >
                                  Accept Order
                                </button>
                              )}
                              {normalizedStatus === 'accepted' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'in_process')}
                                  className="bg-transparent text-foreground font-paragraph text-sm px-4 py-2 rounded border border-secondary transition-colors hover:border-foreground"
                                >
                                  Start Process
                                </button>
                              )}
                              {normalizedStatus === 'in_process' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'delivered')}
                                  className="bg-transparent text-foreground font-paragraph text-sm px-4 py-2 rounded border border-secondary transition-colors hover:border-foreground"
                                >
                                  Mark Delivered
                                </button>
                              )}
                              {normalizedStatus !== 'delivered' && normalizedStatus !== 'cancelled' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                  className="bg-transparent text-destructive font-paragraph text-sm px-4 py-2 rounded border border-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <p className="font-paragraph text-base text-foreground">
                    No active orders
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
